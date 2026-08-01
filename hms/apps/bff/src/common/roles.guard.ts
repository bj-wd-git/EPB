import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['*'],
  clerk: ['patients:read', 'patients:write', 'appointments:write', 'emr:read'],
  doctor: ['patients:read', 'emr:read', 'emr:write', 'appointments:read'],
  nurse: ['patients:read', 'emr:read', 'emr:write'],
};

export function hasPermission(role: string, perm: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes('*') || perms.includes(perm);
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required) return true;

    const req = context.switchToHttp().getRequest();
    const role = (req.headers['x-role'] as string) || 'clerk';
    if (!hasPermission(role, required)) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
