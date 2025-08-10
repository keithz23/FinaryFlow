import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from '../token/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { RefreshJwtStrategy } from './strategies/jwt-refresh.strategy';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { MailService } from '../mail/mail.service';
import { PermissionService } from './permissions.service';
import { PermissionModule } from './permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PermissionModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get('config.jwt.secret');
        return {
          secret,
          signOptions: {
            expiresIn: configService.get('config.jwt.expiresIn') || '1h',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    MailService,
    TokenService,
    JwtStrategy,
    JwtAuthGuard,
    GoogleStrategy,
    PermissionService,
    RefreshJwtStrategy,
    RefreshTokenGuard,
  ],
})
export class AuthModule {}
