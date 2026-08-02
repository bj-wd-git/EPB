import { Body, Controller, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { CreateIncidentDto, CreateConsentDto, CreateCapaDto } from './dto/compliance.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('compliance')
@UseGuards(RolesGuard)
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post('incidents')
  @RequirePermission('compliance:write')
  report(@Body() dto: CreateIncidentDto, @Headers('x-actor-id') actorId = 'system') {
    return this.complianceService.reportIncident(dto, actorId);
  }

  @Get('incidents')
  @RequirePermission('compliance:read')
  listIncidents() {
    return this.complianceService.listIncidents();
  }

  @Patch('incidents/:id/resolve')
  @RequirePermission('compliance:write')
  resolve(@Param('id') id: string, @Headers('x-actor-id') actorId = 'system') {
    return this.complianceService.resolveIncident(id, actorId);
  }

  @Post('consents')
  @RequirePermission('compliance:write')
  consent(@Body() dto: CreateConsentDto, @Headers('x-actor-id') actorId = 'system') {
    return this.complianceService.recordConsent(dto, actorId);
  }

  @Get('consents/patient/:uhid')
  @RequirePermission('compliance:read')
  listConsents(@Param('uhid') uhid: string) {
    return this.complianceService.listConsents(uhid);
  }

  @Post('capa')
  @RequirePermission('compliance:write')
  capa(@Body() dto: CreateCapaDto, @Headers('x-actor-id') actorId = 'system') {
    return this.complianceService.createCapa(dto, actorId);
  }

  @Get('audit-summary')
  @RequirePermission('compliance:read')
  auditSummary() {
    return this.complianceService.auditSummary();
  }
}
