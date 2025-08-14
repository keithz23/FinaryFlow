import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}
  async create(userId: string, createCategoryDto: CreateCategoryDto) {
    const { name, description } = createCategoryDto;
    try {
      const existed = await this.prisma.category.findUnique({
        where: { name },
      });
      if (existed) {
        throw new ConflictException('Category name already exists');
      }

      await this.prisma.category.create({
        data: {
          userId,
          name,
          description,
        },
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating category',
      );
    }
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
