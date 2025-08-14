import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto';
import { AuthResponse } from 'src/common/interfaces';
import { TokenService } from '../token/token.service';
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private prisma: PrismaService,
    private configService: ConfigService,
    private mailService: MailService,
    private redisService: RedisService,
  ) {}
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const saltRounds = this.configService.get(
      'config.security.bcryptSaltRounds',
    );
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        fullName: registerDto.fullName,
        email: registerDto.email,
        password: hashedPassword,
      },
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
    });

    return this.tokenService.generateTokens(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
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
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Cache user info in Redis
    await this.redisService.setWithExpire(
      `user:${user.id}`,
      JSON.stringify(user),
      900,
    );

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return this.tokenService.generateTokens(user);
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      const resetToken = randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 5 * 60 * 1000);

      await this.prisma.user.update({
        where: { email },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpiry: resetTokenExpiry,
        },
      });

      await this.mailService.sendForgotPasswordEmail(
        email,
        resetToken,
        existingUser.fullName,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while sending email',
      );
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const { token, newPassword, confirmPassword } = resetPasswordDto;

      const existingUser = await this.prisma.user.findFirst({
        where: { passwordResetToken: token },
      });

      if (!existingUser || existingUser.passwordResetExpiry < new Date()) {
        throw new BadRequestException('Invalid or expired token');
      }

      if (newPassword != confirmPassword) {
        throw new BadRequestException('Password do not match');
      }

      const saltRounds = this.configService.get(
        'config.security.bcryptSaltRounds',
      );

      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpiry: null,
          updatedAt: new Date(),
        },
      });

      await this.mailService.sendPasswordResetConfirmation(
        existingUser.email,
        existingUser.fullName,
      );

      return {
        message: 'Password reset successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while sending email',
      );
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
    const { oldPassword, newPassword, confirmPassword } = changePasswordDto;

    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const isOldPasswordValid = await bcrypt.compareSync(
        oldPassword,
        user.password,
      );
      if (!isOldPasswordValid) {
        throw new BadRequestException('Old password is incorrect');
      }

      if (newPassword !== confirmPassword) {
        throw new BadRequestException(
          'New password and confirm password do not match',
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while changing password',
      );
    }
  }

  async me(userId: string) {
    try {
      const cached = await this.redisService.get(`user:${userId}`);
      if (cached) {
        return {
          user: JSON.parse(cached),
        };
      }
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.redisService.setWithExpire(
        `user:${user.id}`,
        JSON.stringify(user),
        900,
      );

      return {
        user: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      console.error('Error fetching user profile:', error);

      throw new InternalServerErrorException(
        'An unexpected error occurred while fetching user data',
      );
    }
  }
}
