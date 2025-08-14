import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { RedisService } from 'src/redis/redis.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService, PrismaService, RedisService],
})
export class BudgetsModule {}
