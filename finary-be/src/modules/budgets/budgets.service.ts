import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class BudgetsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}
  async create(userId: string, createBudgetDto: CreateBudgetDto) {
    const { categoryId, amount, period } = createBudgetDto;
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

      await this.prisma.budgets.create({
        data: { userId, categoryId, amount, period },
      });
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

  findAll() {
    return `This action returns all budgets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} budget`;
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto) {
    const { categoryId, amount, period } = updateBudgetDto;
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
          ...(amount !== undefined && { amount }),
          ...(period !== undefined && { period }),
        },
      });
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

  remove(id: number) {
    return `This action removes a #${id} budget`;
  }
}
