import { Module } from '@nestjs/common';
import { validationSchema } from './config/validation.schema';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { CacheModule } from './modules/cache/cache.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { MailModule } from './modules/mail/mail.module';
import { PermissionModule } from './modules/auth/permissions.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RedisModule } from './redis/redis.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ReportsModule } from './modules/reports/reports.module';
import { GoalsModule } from './modules/goals/goals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production'],
      load: [configuration],
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    AuthModule,
    CacheModule,
    PermissionModule,
    PermissionsModule,
    RolesModule,
    RedisModule,
    UsersModule,
    MailModule,
    BudgetsModule,
    TransactionsModule,
    CategoriesModule,
    SettingsModule,
    ReportsModule,
    GoalsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
