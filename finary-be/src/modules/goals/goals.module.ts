import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [GoalsController],
  providers: [GoalsService, PrismaService, RedisService],
})
export class GoalsModule {}
