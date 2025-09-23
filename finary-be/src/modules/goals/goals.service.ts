import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class GoalsService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}
  async create(createGoalDto: CreateGoalDto) {
    const { goalName, categoryId, amount, date } = createGoalDto;
    try {
      const existed = await this.prisma.goals.findFirst({
        where: { name: goalName },
      });
    } catch (error) {
      if (
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

  findAll() {
    return `This action returns all goals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} goal`;
  }

  update(id: number, updateGoalDto: UpdateGoalDto) {
    return `This action updates a #${id} goal`;
  }

  remove(id: number) {
    return `This action removes a #${id} goal`;
  }
}
