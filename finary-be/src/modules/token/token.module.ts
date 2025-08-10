import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
 imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
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
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
