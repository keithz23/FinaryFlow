import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '../auth/dto';
import { AuthResponse, UserEntity } from 'src/common/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    const refreshTokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshTokenDto.refreshToken },
      include: {
        user: {
          include: {
            userRoles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!refreshTokenRecord || refreshTokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Delete old refresh token
    await this.prisma.refreshToken.delete({
      where: { id: refreshTokenRecord.id },
    });

    return this.generateTokens(refreshTokenRecord.user);
  }

  async generateTokens(
    user: UserEntity,
    message?: string,
  ): Promise<AuthResponse> {
    const roles = user.userRoles?.map((ur) => ur.role.name) || [];
    const permissions =
      user.userRoles
        ?.flatMap((ur) => ur.role.rolePermissions || [])
        .map((rp) => `${rp.permission.resource}:${rp.permission.action}`) || [];

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.fullName,
      roles,
      permissions,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: roles,
        permissions: permissions,
      },
      {
        secret: this.configService.get('config.jwt.refreshSecret'),
        expiresIn: this.configService.get('config.jwt.refreshExpiresIn'),
      },
    );

    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles,
        permissions,
      },
    };
  }
}
