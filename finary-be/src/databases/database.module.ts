import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}

// 6. CONFIG MODULE - src/config/configuration.ts
import { registerAs } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT ?? '', 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    url: process.env.DATABASE_URL,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  api: {
    prefix: process.env.API_PREFIX || 'api/v1',
  },

  swagger: {
    title: process.env.SWAGGER_TITLE || 'NestJS API',
    description: process.env.SWAGGER_DESCRIPTION || 'API Documentation',
    version: process.env.SWAGGER_VERSION || '1.0',
  },

  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '', 10) || 12,
  },

  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '', 10) || 60,
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '', 10) || 10,
  },

  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
}));
