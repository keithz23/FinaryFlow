import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async assignPermissions(roleId: string, permissionsId: string[]) {
    try {
      if (!roleId || !permissionsId || permissionsId.length === 0) {
        throw new NotFoundException(`Role ID or permissions not found`);
      }

      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
      });

      if (!role) {
        throw new NotFoundException(`Role with id ${roleId} not found`);
      }

      await this.prisma.rolePermission.deleteMany({
        where: { roleId },
      });

      const data = permissionsId.map((permissionId) => ({
        roleId,
        permissionId,
      }));

      await this.prisma.rolePermission.createMany({ data });

      return { message: 'Permissions assigned successfully' };
    } catch (error) {
      console.error('Error while assigning permissions to role:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred while assigning permissions to the role.',
      );
    }
  }

  async findAllPermission(page: number, limit: number, all = false) {
    const safePage = Math.max(1, page);
    const safeLitmit = Math.min(Math.max(1, limit), 100);

    const skip = (safePage - 1) * safeLitmit;

    try {
      if (all || limit === -1) {
        const permissionsData = await this.prisma.permission.findMany({
          orderBy: { createdAt: 'desc' },
          include: { rolePermissions: true },
        });
        return {
          message: 'All permission group fetched successfully',
          currentPage: 1,
          totalPage: 1,
          totalItems: permissionsData.length,
          data: permissionsData,
        };
      }

      const [permissionData, total] = await Promise.all([
        this.prisma.permission.findMany({
          skip,
          take: safeLitmit,
          orderBy: { createdAt: 'desc' },
          include: {
            rolePermissions: true,
          },
        }),
        this.prisma.permission.count(),
      ]);

      return {
        message: 'Permissions fetched successfully',
        currentPage: safePage,
        totalPages: Math.ceil(total / safeLitmit),
        totalItems: total,
        data: permissionData,
      };
    } catch (error) {
      console.error('Error while fetching permissions data:', error);
      throw new InternalServerErrorException(
        'Error while fetching permissions data',
      );
    }
  }

  async findOnePermission(id: string) {
    try {
      const permission = await this.prisma.permission.findUnique({
        where: { id },
      });

      if (!permission.id) {
        throw new NotFoundException(`Permission with ${id} not found`);
      }

      return permission;
    } catch (error) {
      console.error('Error while fetching permission data:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'An unexpected error occured while fetching permission data',
      );
    }
  }

  async findAllPermissionGroup(page: number, limit: number, all = false) {
    const safePage = Math.max(1, page);
    const safeLitmit = Math.min(Math.max(1, limit), 100);

    const skip = (safePage - 1) * safeLitmit;

    try {
      if (all || limit === -1) {
        const permissionsData = await this.prisma.permissionGroup.findMany({
          orderBy: { createdAt: 'desc' },
          include: { permissions: true },
        });
        return {
          message: 'All permisionss fetched successfully',
          currentPage: 1,
          totalPage: 1,
          totalItems: permissionsData.length,
          data: permissionsData,
        };
      }

      const [permissionData, total] = await Promise.all([
        this.prisma.permissionGroup.findMany({
          skip,
          take: safeLitmit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.permission.count(),
      ]);

      return {
        message: 'Permission group fetched successfully',
        currentPage: safePage,
        totalPages: Math.ceil(total / safeLitmit),
        totalItems: total,
        data: permissionData,
      };
    } catch (error) {
      console.error('Error while fetching permissions group data:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'An unexpected error occured while fetching all permissions data',
      );
    }
  }
}
