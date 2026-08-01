import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'permission';
export const RequirePermission = (permission: string) => SetMetadata(ROLES_KEY, permission);
