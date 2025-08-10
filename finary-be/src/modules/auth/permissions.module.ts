import { Module } from '@nestjs/common';
import { PermissionService } from './permissions.service';

@Module({
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
