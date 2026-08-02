import { Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { SecurityService } from './security.service';
import { CreateSessionDto, CreateApiKeyDto, LogAccessDto } from './dto/security.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('security')
@UseGuards(RolesGuard)
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('sessions')
  createSession(@Body() dto: CreateSessionDto) {
    return this.securityService.createSession(dto);
  }

  @Get('sessions/:id/validate')
  validateSession(@Param('id') id: string) {
    return this.securityService.validateSession(id);
  }

  @Post('api-keys')
  @RequirePermission('security:write')
  createApiKey(@Body() dto: CreateApiKeyDto, @Headers('x-actor-id') actorId = 'admin') {
    return this.securityService.createApiKey(dto, actorId);
  }

  @Get('api-keys')
  @RequirePermission('security:read')
  listApiKeys() {
    return this.securityService.listApiKeys();
  }

  @Post('access-logs')
  @RequirePermission('security:write')
  logAccess(@Body() dto: LogAccessDto) {
    return this.securityService.logAccess(dto);
  }

  @Get('access-logs')
  @RequirePermission('security:read')
  listAccessLogs() {
    return this.securityService.listAccessLogs();
  }

  @Get('phi-audit')
  @RequirePermission('security:read')
  phiAudit() {
    return this.securityService.phiAudit();
  }
}
