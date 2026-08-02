import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { SecuritySession } from '../entities/security-session.entity';
import { ApiKey } from '../entities/api-key.entity';
import { AccessLog } from '../entities/access-log.entity';
import { AuditEvent } from '../entities/audit-event.entity';
import { AuditService } from '../common/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([SecuritySession, ApiKey, AccessLog, AuditEvent])],
  controllers: [SecurityController],
  providers: [SecurityService, AuditService],
})
export class SecurityModule {}
