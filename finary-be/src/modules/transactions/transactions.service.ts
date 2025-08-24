import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { Prisma, Transaction, Category } from '@prisma/client';
import { FindAllFilters, TxType } from './types/Transaction';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}
  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    const { amount, description, date, type, categoryId } =
      createTransactionDto;

    try {
      const created = await this.prisma.$transaction(async (tx) => {
        const budget = await tx.budgets.findFirst({
          where: { userId, categoryId },
        });

        if (!budget) {
          throw new NotFoundException('Budget not found for this category');
        }

        const transaction = await tx.transaction.create({
          data: {
            amount,
            type,
            description,
            date,
            userId,
            categoryId,
          },
        });

        if (type === 'EXPENSE') {
          await tx.budgets.update({
            where: { id: budget.id },
            data: {
              spent: { increment: amount },
            },
          });
        }
        return transaction;
      });
      await this.invalidateUserTransactionsBudgetsCache(userId);

      return created;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating transaction',
      );
    }
  }

  async findAll(
    page: number,
    limit: number,
    userId: string,
    filters: FindAllFilters = {},
  ): Promise<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    data: (Transaction & { category: Category })[];
    report: {
      income: number;
      expense: number;
      net: number;
      byCategory: { categoryId: string; total: number }[];
    };
  }> {
    const skip = (page - 1) * limit;
    const where: any = { userId };

    if (filters.type) where.type = filters.type;
    if (filters.categoryId) where.categoryId = filters.categoryId;

    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) where.date.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.date.lte = new Date(filters.dateTo);
    }

    try {
      const [transactionData, totalItems, sumIncome, sumExpense] =
        await this.prisma.$transaction([
          this.prisma.transaction.findMany({
            where,
            skip,
            take: limit,
            include: { category: true },
            orderBy: { date: 'desc' },
          }),
          this.prisma.transaction.count({ where }),
          this.prisma.transaction.aggregate({
            where: { ...where, type: 'INCOME' as TxType },
            _sum: { amount: true },
          }),
          this.prisma.transaction.aggregate({
            where: { ...where, type: 'EXPENSE' as TxType },
            _sum: { amount: true },
          }),
        ]);

      const byCategory = await this.prisma.transaction.groupBy({
        by: ['categoryId'],
        where,
        _sum: { amount: true },
      });

      const income = Number(sumIncome._sum.amount ?? 0);
      const expense = Number(sumExpense._sum.amount ?? 0);

      return {
        currentPage: page,
        totalPages: Math.max(1, Math.ceil(totalItems / limit)),
        totalItems,
        data: transactionData,
        report: {
          income,
          expense,
          net: income - expense,
          byCategory: byCategory
            .map((r) => ({
              categoryId: r.categoryId,
              total: Number(r._sum.amount ?? 0),
            }))
            .sort((a, b) => b.total - a.total),
        },
      };
    } catch (error) {
      console.error('Transaction find all error:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException('Database error occurred');
      }
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while fetching transactions', // Fixed: grammar
      );
    }
  }

  async findOne(
    id: string,
    userId: string,
  ): Promise<Transaction & { category: Category }> {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id, userId },
        include: { category: true },
      });

      if (!transaction) {
        throw new NotFoundException(`Transaction with ${id} not found`);
      }

      return transaction;
    } catch (error) {
      console.error('Transaction find one error:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException('Database error occurred');
      }
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while fetching transaction',
      );
    }
  }

  async update(
    id: string,
    userId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const { amount, description, date, type, categoryId } =
      updateTransactionDto;

    try {
      const existedTransaction = await this.prisma.transaction.findUnique({
        where: { id, userId },
        include: { category: true },
      });

      if (!existedTransaction) {
        throw new NotFoundException(`Transaction not found with ${id}`);
      }

      const updated = await this.prisma.$transaction(async (tx) => {
        // 1. Revert old transaction impact
        if (existedTransaction.type === 'EXPENSE') {
          const oldBudget = await tx.budgets.findFirst({
            where: { categoryId: existedTransaction.categoryId, userId },
          });
          if (oldBudget) {
            await tx.budgets.update({
              where: { id: oldBudget.id },
              data: {
                spent: {
                  decrement: existedTransaction.amount, // minus old amount
                },
              },
            });
          }
        }

        // 2. Update transaction
        const updatedTransaction = await tx.transaction.update({
          where: { id },
          data: { amount, description, date, type, categoryId },
          include: { category: true },
        });

        // 3. Apply new transaction impact
        if (type === 'EXPENSE') {
          const newBudget = await tx.budgets.findFirst({
            where: { categoryId, userId },
          });
          if (!newBudget) {
            throw new NotFoundException(
              `Budget not found for category ${categoryId}`,
            );
          }

          await tx.budgets.update({
            where: { id: newBudget.id },
            data: {
              spent: {
                increment: amount, // plus new amount
              },
            },
          });
        }

        return updatedTransaction;
      });

      // 4. Cache invalidation outside transaction
      await this.invalidateUserTransactionsBudgetsCache(userId);

      return updated;
    } catch (error) {
      console.error('Transaction update error:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException('Database error occurred');
      }
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating transaction',
      );
    }
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    try {
      const existedTransaction = await this.prisma.transaction.findUnique({
        where: { id, userId },
        include: { category: true },
      });

      if (!existedTransaction) {
        throw new NotFoundException(`Transaction with id ${id} not found`);
      }

      await this.prisma.$transaction(async (tx) => {
        // 1. Revert transaction impact on budget
        if (existedTransaction.type === 'EXPENSE') {
          const budget = await tx.budgets.findFirst({
            where: {
              categoryId: existedTransaction.categoryId,
              userId,
            },
          });

          if (budget) {
            await tx.budgets.update({
              where: { id: budget.id },
              data: {
                spent: {
                  decrement: existedTransaction.amount,
                },
              },
            });
          }
        }

        // 2. Delete the transaction
        await tx.transaction.delete({
          where: { id, userId }, // Security: ensure user can only delete their own
        });
      });

      // 3. Invalidate cache
      await this.invalidateUserTransactionsBudgetsCache(userId);

      return {
        message: `Transaction ${id} deleted successfully`,
      };
    } catch (error) {
      console.error('Transaction delete error:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors
        if (error.code === 'P2025') {
          throw new NotFoundException(`Transaction with id ${id} not found`);
        }
        throw new InternalServerErrorException('Database error occurred');
      }

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting transaction',
      );
    }
  }

  private async invalidateUserTransactionsBudgetsCache(userId: string) {
    try {
      await Promise.all([
        this.redisService.del(`budgets:${userId}`),
        this.redisService.del(`transactions:${userId}`),
      ]);
      console.log(`Cache invalidated for user: ${userId}`);
    } catch (error) {
      console.error('Cache invalidation failed:', error);
    }
  }
}
