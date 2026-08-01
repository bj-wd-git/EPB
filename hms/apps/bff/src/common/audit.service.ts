import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditEvent } from '../entities/audit-event.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditEvent)
    private readonly auditRepo: Repository<AuditEvent>,
  ) {}

  async publish(event: {
    actorId: string;
    action: string;
    resource: string;
    resourceId: string;
    branchId?: string;
  }) {
    return this.auditRepo.save(this.auditRepo.create(event));
  }
}
