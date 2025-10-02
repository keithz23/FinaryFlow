import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { Goals } from '@prisma/client';

@Injectable()
export class GoalsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}
  async create(createGoalDto: CreateGoalDto, userId: string): Promise<Goals> {
    const { name, categoryId, amount, date } = createGoalDto;

    try {
      // Check if goal already exists
      const existingGoal = await this.prisma.goals.findFirst({
        where: {
          name,
          categoryId,
          userId,
        },
      });

      if (existingGoal) {
        throw new ConflictException('Goal name already exists for this user');
      }

      // Create new goal
      const goal = await this.prisma.goals.create({
        data: {
          name,
          categoryId,
          amount: Number(amount),
          date,
          userId,
        },
      });

      // Invalidate cache after successful creation
      await this.invalidateUserGoalsCache(userId);

      return goal;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating goal',
      );
    }
  }

  async findAll(userId: string): Promise<Goals[]> {
    const cacheKey = `goals:${userId}`;
    try {
      const cache = await this.redisService.get(cacheKey);
      if (cache) {
        const cachedData = JSON.parse(cache);
        return cachedData;
      }

      const goals = this.prisma.goals.findMany({
        where: {
          userId,
        },
        include: {
          category: true,
        },
      });

      await this.redisService.setWithExpire(
        cacheKey,
        JSON.stringify(goals),
        600,
      );

      return goals;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
    }

    throw new InternalServerErrorException(
      'An unexpected error while fetching all goals data',
    );
  }

  async findOne(id: string) {
    try {
      const goal = this.prisma.goals.findUnique({
        where: { id },
        include: {
          category: true,
          user: true,
        },
      });

      if (!goal) {
        throw new NotFoundException('Goal not found');
      }

      return goal;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error while fetching goal',
      );
    }
  }

  async update(id: string, updateGoalDto: UpdateGoalDto) {
    const { name, categoryId, amount, date } = updateGoalDto;

    try {
      // Find existing goal
      const existedGoal = await this.prisma.goals.findUnique({
        where: { id },
      });

      if (!existedGoal) {
        throw new NotFoundException('Goal not found');
      }

      // Validate amount if provided
      if (
        amount !== undefined &&
        (isNaN(Number(amount)) || Number(amount) <= 0)
      ) {
        throw new BadRequestException('Amount must be a positive number');
      }

      // Check for duplicates (assuming name + category should be unique)
      const targetCategoryId = categoryId ?? existedGoal.categoryId;
      const targetName = name ?? existedGoal.name;

      const duplicate = await this.prisma.goals.findFirst({
        where: {
          userId: existedGoal.userId,
          name: targetName,
          categoryId: targetCategoryId,
          NOT: { id },
        },
        select: { id: true },
      });

      if (duplicate) {
        throw new ConflictException(
          'Goal with this name and category already exists',
        );
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (amount !== undefined) updateData.amount = Number(amount);
      if (date !== undefined) updateData.date = date;

      const updatedGoal = await this.prisma.goals.update({
        where: { id },
        data: updateData,
      });

      await this.invalidateUserGoalsCache(existedGoal.userId);

      return updatedGoal;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating goal',
      );
    }
  }
  async remove(id: string) {
    try {
      const goalToDelete = await this.prisma.goals.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!goalToDelete) {
        throw new NotFoundException('Goal not found');
      }

      const deletedGoal = await this.prisma.goals.delete({
        where: { id },
      });

      await this.invalidateUserGoalsCache(goalToDelete.userId);

      return deletedGoal;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Goal not found');
      }

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting goal',
      );
    }
  }

  private async invalidateUserGoalsCache(userId: string) {
    try {
      this.redisService.del(`goals:${userId}`);
      console.log(`Cache invalidated for user: ${userId}`);
    } catch (error) {
      console.error('Cache invalidation failed:', error);
    }
  }
}
