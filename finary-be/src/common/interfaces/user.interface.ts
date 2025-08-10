import { UserRole } from "./role.interface";

export interface UserEntity {
  id: string;
  email: string;
  fullName: string;
  password?: string;
  isActive?: boolean;
  googleId?:string,
  picture?: string,
  lastLoginAt?: Date;
  userRoles: UserRole[];
}
