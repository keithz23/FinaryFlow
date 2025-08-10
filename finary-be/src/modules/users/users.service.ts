import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from './dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(query: PaginationQueryDto, userId: string) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      role,
      isActive,
    } = query;

    const safePage = Math.max(1, Math.floor(page));
    const safeLimit = Math.min(Math.max(1, Math.floor(limit)), 100);
    const skip = (safePage - 1) * safeLimit;

    const where: Prisma.UserWhereInput = {
      AND: [
        {
          id: { not: userId },
        },
        search
          ? {
              OR: [
                { email: { contains: search, mode: 'insensitive' } },
                { fullName: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        isActive !== undefined ? { isActive } : {},
        role
          ? {
              userRoles: {
                some: {
                  role: {
                    name: role,
                  },
                },
              },
            }
          : {},
      ],
    };

    try {
      const [data, totalItems] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          where,
          skip,
          take: safeLimit,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        }),
        this.prisma.user.count({ where }),
      ]);

      return {
        message: 'Users fetched successfully',
        currentPage: safePage,
        totalPages: Math.ceil(totalItems / safeLimit),
        totalItems,
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error occurred while fetching users',
      );
    }
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { userRoles: { include: { role: {} } } },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Omit password
    // const { password, ...safeUser } = user;
    return user;
  }

  async uploadAvatar(id: string, picture: string) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      await this.prisma.user.update({
        where: { id },
        data: {
          picture,
        },
      });

      return { message: 'Avatar updated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while uploading avatar',
      );
    }
  }
}
