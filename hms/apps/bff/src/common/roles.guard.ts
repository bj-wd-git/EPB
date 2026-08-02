import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['*'],
  clerk: ['patients:read', 'patients:write', 'appointments:write', 'emr:read', 'billing:read', 'billing:write', 'lab:read', 'ward:read', 'ipd:read', 'emergency:read', 'emergency:write', 'insurance:read', 'insurance:write', 'reports:read', 'communications:read', 'communications:write', 'compliance:read'],
  doctor: ['patients:read', 'emr:read', 'emr:write', 'appointments:read', 'lab:write', 'radiology:write', 'pharmacy:write', 'billing:read', 'ward:read', 'ipd:read', 'ipd:write', 'ot:read', 'ot:write', 'emergency:read', 'emergency:write', 'reports:read', 'portal:doctor:read', 'portal:doctor:write', 'mobile:read', 'mobile:write', 'compliance:read', 'compliance:write'],
  nurse: ['patients:read', 'emr:read', 'emr:write', 'lab:read', 'ward:read', 'ward:write', 'ipd:read', 'ipd:write', 'emergency:read', 'emergency:write', 'inventory:read', 'mobile:read', 'mobile:write', 'compliance:read', 'compliance:write'],
  lab: ['lab:read', 'lab:write'],
  pharmacist: ['pharmacy:read', 'pharmacy:write', 'inventory:read', 'inventory:write'],
  hr: ['hr:read', 'hr:write'],
  patient: ['portal:patient:read', 'portal:patient:write', 'mobile:read', 'mobile:write'],
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
