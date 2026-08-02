import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { SecuritySession } from '../entities/security-session.entity';
import { ApiKey } from '../entities/api-key.entity';
import { AccessLog } from '../entities/access-log.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { CreateSessionDto, CreateApiKeyDto, LogAccessDto, generateApiKey } from './dto/security.dto';
import { AuditService } from '../common/audit.service';

const PHI_RESOURCES = ['patient', 'clinical_note', 'emr', 'prescription', 'lab_order'];

@Injectable()
export class SecurityService {
  constructor(
    @InjectRepository(SecuritySession) private readonly sessionRepo: Repository<SecuritySession>,
    @InjectRepository(ApiKey) private readonly keyRepo: Repository<ApiKey>,
    @InjectRepository(AccessLog) private readonly logRepo: Repository<AccessLog>,
    @InjectRepository(AuditEvent) private readonly auditRepo: Repository<AuditEvent>,
    private readonly audit: AuditService,
  ) {}

  async createSession(dto: CreateSessionDto) {
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
    const session = await this.sessionRepo.save(
      this.sessionRepo.create({ actorId: dto.actorId, role: dto.role, status: 'active', expiresAt }),
    );
    return { sessionId: session.id, actorId: session.actorId, role: session.role, expiresAt: session.expiresAt };
  }

  async validateSession(sessionId: string) {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId, status: 'active', expiresAt: MoreThan(new Date()) },
    });
    if (!session) throw new UnauthorizedException('Invalid or expired session');
    return { sessionId: session.id, actorId: session.actorId, role: session.role, valid: true };
  }

  async createApiKey(dto: CreateApiKeyDto, actorId: string) {
    const { token, prefix, hash } = generateApiKey();
    const key = await this.keyRepo.save(
      this.keyRepo.create({ name: dto.name, role: dto.role, keyPrefix: prefix, keyHash: hash, status: 'active' }),
    );
    await this.audit.publish({ actorId, action: 'security.apikey', resource: 'api_key', resourceId: key.id });
    return { keyId: key.id, name: key.name, role: key.role, token, keyPrefix: prefix };
  }

  listApiKeys() {
    return this.keyRepo.find({ select: ['id', 'name', 'keyPrefix', 'role', 'status', 'createdAt'], order: { createdAt: 'DESC' } });
  }

  async logAccess(dto: LogAccessDto) {
    const log = await this.logRepo.save(this.logRepo.create(dto));
    return { logId: log.id };
  }

  listAccessLogs() {
    return this.logRepo.find({ order: { timestamp: 'DESC' }, take: 100 });
  }

  async phiAudit() {
    const events = await this.auditRepo.find({ order: { timestamp: 'DESC' }, take: 100 });
    return events.filter((e) => PHI_RESOURCES.some((r) => e.resource.includes(r)));
  }
}
