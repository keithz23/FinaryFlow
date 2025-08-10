import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationQueryDto } from './dto/pagination.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}
  async create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAllRoles(page: number, limit: number, all = false) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (safePage - 1) * safeLimit;

    try {
      if (all || limit === -1) {
        const rolesData = await this.prisma.role.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        });

        return {
          message: 'All roles fetched successfully',
          currentPage: 1,
          totalPages: 1,
          totalItems: rolesData.length,
          data: rolesData,
        };
      }

      const [rolesData, total] = await Promise.all([
        this.prisma.role.findMany({
          skip,
          take: safeLimit,
          orderBy: { createdAt: 'desc' },
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        }),
        this.prisma.role.count(),
      ]);

      return {
        message: 'Roles fetched successfully',
        currentPage: safePage,
        totalPages: Math.ceil(total / safeLimit),
        totalItems: total,
        data: rolesData,
      };
    } catch (error) {
      console.error('Error while fetching roles data:', error);
      throw new InternalServerErrorException('Error while fetching roles data');
    }
  }

  async findOneRole(id: string) {
    return this.prisma.$transaction(async (prisma) => {
      const role = await prisma.role.findUnique({
        where: { id },
        include: { rolePermissions: true },
      });

      if (!role) {
        throw new NotFoundException(`Role with id ${id} not found`);
      }

      const permissionIds = role.rolePermissions.map((rp) => rp.permissionId);

      const permissions = await prisma.permission.findMany({
        where: {
          id: { in: permissionIds },
        },
      });

      return {
        role,
        permissions,
      };
    });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
