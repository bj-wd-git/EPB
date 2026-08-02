import { Body, Controller, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { CreatePolicyDto, CreatePreAuthDto, CreateClaimDto } from './dto/insurance.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('insurance')
@UseGuards(RolesGuard)
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Post('policies')
  @RequirePermission('insurance:write')
  createPolicy(@Body() dto: CreatePolicyDto, @Headers('x-actor-id') actorId = 'system') {
    return this.insuranceService.createPolicy(dto, actorId);
  }

  @Get('policies/patient/:uhid')
  @RequirePermission('insurance:read')
  listPolicies(@Param('uhid') uhid: string) {
    return this.insuranceService.listPolicies(uhid);
  }

  @Post('pre-auth')
  @RequirePermission('insurance:write')
  preAuth(@Body() dto: CreatePreAuthDto, @Headers('x-actor-id') actorId = 'system') {
    return this.insuranceService.preAuth(dto, actorId);
  }

  @Post('claims')
  @RequirePermission('insurance:write')
  submitClaim(@Body() dto: CreateClaimDto, @Headers('x-actor-id') actorId = 'system') {
    return this.insuranceService.submitClaim(dto, actorId);
  }

  @Patch('claims/:id/settle')
  @RequirePermission('insurance:write')
  settle(@Param('id') id: string, @Headers('x-actor-id') actorId = 'system') {
    return this.insuranceService.settleClaim(id, actorId);
  }
}
