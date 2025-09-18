import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) =>
        new Redis({
          host: cfg.get('config.redis.host'),
          port: Number(cfg.get('config.redis.port')),
          maxRetriesPerRequest: 3,
        }),
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
