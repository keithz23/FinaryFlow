import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService, RedisService],
})
export class TransactionsModule {}
