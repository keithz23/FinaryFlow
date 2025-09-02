import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { Budgets, Category } from '@prisma/client';

@Injectable()
export class BudgetsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}
  async create(userId: string, createBudgetDto: CreateBudgetDto) {
    const { categoryId, allocated, period } = createBudgetDto;
    try {
      const existed = await this.prisma.budgets.findUnique({
        where: {
          userId_categoryId_period_unique: { userId, categoryId, period },
        },
      });

      if (existed) {
        throw new ConflictException(
          'Budget already exists for this category & period',
        );
      }

      const budget = await this.prisma.budgets.create({
        data: { userId, categoryId, allocated, period },
        include: { category: true },
      });

      // Invalidate cache afater successful creation
      await this.invalidateUserBudgetsTransactionsCache(userId);

      return budget;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if ((error as any)?.code === 'P2002') {
        throw new ConflictException(
          'Budget already exists for this category & period',
        );
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating budget',
      );
    }
  }

  async findAll(userId: string): Promise<(Budgets & { category: Category })[]> {
    const cacheKey = `budgets:${userId}`;
    try {
      const cache = await this.redisService.get(cacheKey);
      if (cache) {
        try {
          const cachedData = JSON.parse(cache);
          return cachedData;
        } catch (error) {
          console.error('Cache parse error:', error);
          await this.redisService.del(cacheKey);
        }
      }

      const budgets = await this.prisma.budgets.findMany({
        where: { userId },
        include: {
          category: true,
        },
      });

      await this.redisService.setWithExpire(
        cacheKey,
        JSON.stringify(budgets),
        600,
      );

      return budgets;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'An unexpected error occurred while fetching all budgets data',
      );
    }
  }

  async findOne(id: string) {
    try {
      if (!id || typeof id !== 'string') {
        throw new BadRequestException('Invalid budget id');
      }

      const budget = await this.prisma.budgets.findUnique({
        where: { id },
        include: { category: true },
      });

      if (!budget) {
        throw new NotFoundException('Budget not found');
      }

      return budget;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while fetching budget',
      );
    }
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto) {
    const { categoryId, allocated, period } = updateBudgetDto;
    try {
      const existed = await this.prisma.budgets.findUnique({
        where: { id },
        select: { id: true, userId: true, categoryId: true, period: true },
      });
      if (!existed) throw new NotFoundException('Budget not found');

      const nextCategoryId = categoryId ?? existed.categoryId;
      const nextPeriod = period ?? existed.period;

      // Check for duplicates before updating
      const dup = await this.prisma.budgets.findFirst({
        where: {
          userId: existed.userId,
          categoryId: nextCategoryId,
          period: nextPeriod,
          NOT: { id },
        },
        select: { id: true },
      });
      if (dup) {
        throw new ConflictException(
          'Budget with this category & period already exists',
        );
      }

      const updated = await this.prisma.budgets.update({
        where: { id },
        data: {
          ...(categoryId !== undefined && { categoryId }),
          ...(allocated !== undefined && { allocated }),
          ...(period !== undefined && { period }),
        },
        include: { category: true },
      });

      // Invalidate cache after successful update
      await this.invalidateUserBudgetsTransactionsCache(existed.userId);

      return updated;
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Budget not found');
      }
      if (error?.code === 'P2002') {
        throw new ConflictException(
          'Budget with this category & period already exists',
        );
      }
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating budget',
      );
    }
  }

  async remove(id: string) {
    try {
      if (!id || typeof id !== 'string') {
        throw new BadRequestException('Invalid budget id');
      }

      // Get userId before deletion for cache invalidation
      const budgetToDelete = await this.prisma.budgets.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!budgetToDelete) {
        throw new NotFoundException('Budget not found');
      }

      const deletedBudget = await this.prisma.budgets.delete({
        where: { id },
      });

      // Invalidate cache after successful deletion
      await this.invalidateUserBudgetsTransactionsCache(budgetToDelete.userId);

      return deletedBudget;
    } catch (error: any) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Budget not found');
      }

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting budget',
      );
    }
  }

  private async invalidateUserBudgetsTransactionsCache(userId: string) {
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
