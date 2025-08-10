export interface Permission {
  id: string;
  resource: string;
  action: string;
}

export interface RolePermission {
  permission: Permission;
}
