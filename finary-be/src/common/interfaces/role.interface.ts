import { RolePermission } from './permission.interface';

export interface Role {
  id: string;
  name: string;
  rolePermissions: RolePermission[];
}

export interface UserRole {
  role: Role;
}
