import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
      // Input validation
      if (!userId || typeof userId !== 'string') {
        throw new BadRequestException('Invalid userId');
      }

      // Check if category already exists for this user
      const existed = await this.prisma.category.findFirst({
        where: {
          userId,
          name: name.trim(), // Trim whitespace
        },
      });

      if (existed) {
        throw new ConflictException(
          'Category name already exists for this user',
        );
      }

      // Create new category
      const category = await this.prisma.category.create({
        data: {
          userId,
          name: name.trim(),
          description: description?.trim() || null,
        },
      });

      // Invalidate cache after succesful creation
      await this.invalidateUserCategoriesCache(userId);

      return category;
    } catch (error: any) {
      // Handle Prisma unique constraint error (if exists at DB level)
      if (error?.code === 'P2002') {
        throw new ConflictException(
          'Category name already exists for this user',
        );
      }

      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // Generic error
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating category',
      );
    }
  }

  async findAll(userId: string) {
    const cacheKey = `categories:${userId}`;
    try {
      if (!userId || typeof userId !== 'string') {
        throw new BadRequestException('Invalid userID');
      }
      const cache = await this.redisService.get(cacheKey);
      if (cache) {
        return JSON.parse(cache);
      }
      const category = await this.prisma.category.findMany({
        where: { userId },
        include: {
          budgets: true,
          goals: true,
          transactions: true,
        },
      });

      await this.redisService.setWithExpire(
        cacheKey,
        JSON.stringify(category),
        3600,
      );

      return category;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'An unexpected error occurred while fetching all categories data',
      );
    }
  }

  async findOne(id: string) {
    try {
      if (!id || typeof id !== 'string') {
        throw new BadRequestException('Invalid category id');
      }

      const category = await this.prisma.category.findUnique({
        where: { id },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return category;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while fetching category',
      );
    }
  }

  async update(
    id: string,
    userId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const { name, description } = updateCategoryDto;

    try {
      // Input validation
      if (!id || typeof id !== 'string') {
        throw new BadRequestException('Invalid category id');
      }
      if (!userId || typeof userId !== 'string') {
        throw new BadRequestException('Invalid user id');
      }

      // Find existing category - use findFirst for composite condition
      const existed = await this.prisma.category.findFirst({
        where: { id, userId },
      });

      if (!existed) {
        throw new NotFoundException('Category not found');
      }

      // Only check for name conflict if name is being changed
      if (name && name.trim() !== existed.name) {
        const duplicate = await this.prisma.category.findFirst({
          where: {
            userId,
            name: name.trim(),
            NOT: { id },
          },
        });

        if (duplicate) {
          throw new ConflictException('Category name already exists');
        }
      }

      // Update category with only changed fields
      const updated = await this.prisma.category.update({
        where: { id },
        data: {
          ...(name !== undefined && { name: name.trim() }),
          ...(description !== undefined && {
            description: description ? description.trim() : description,
          }),
        },
      });

      // Invalidate cache after successful update
      await this.invalidateUserCategoriesCache(userId);

      return updated;
    } catch (error: any) {
      // Handle Prisma errors
      if (error?.code === 'P2025') {
        throw new NotFoundException('Category not found');
      }
      if (error?.code === 'P2002') {
        throw new ConflictException('Category name already exists');
      }

      // Re-throw known exceptions
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // Generic error
      throw new InternalServerErrorException(
        'An unexpected error occurred while updating category',
      );
    }
  }

  async remove(id: string) {
    try {
      if (!id || typeof id !== 'string') {
        throw new BadRequestException('Invalid categoryID');
      }
      const categoryToDelete = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!categoryToDelete) {
        throw new NotFoundException('Category not found');
      }

      const deletedCategory = await this.prisma.category.delete({
        where: { id },
      });

      // Invalidate cache after successful deletion
      return deletedCategory;
    } catch (error) {
      if (error?.code === 'P2025') {
        throw new NotFoundException('Category not found');
      }
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while deleting category',
      );
    }
  }

  private async invalidateUserCategoriesCache(userId: string) {
    await this.redisService.del(`categories:${userId}`);
  }
}
