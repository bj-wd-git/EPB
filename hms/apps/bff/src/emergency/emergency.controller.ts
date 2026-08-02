import { Body, Controller, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { CreateErVisitDto, TriageErDto } from './dto/create-er-visit.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('emergency')
@UseGuards(RolesGuard)
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  @Post('visits')
  @RequirePermission('emergency:write')
  register(@Body() dto: CreateErVisitDto, @Headers('x-actor-id') actorId = 'system') {
    return this.emergencyService.register(dto, actorId);
  }

  @Get('visits/active')
  @RequirePermission('emergency:read')
  listActive() {
    return this.emergencyService.listActive();
  }

  @Patch('visits/:id/triage')
  @RequirePermission('emergency:write')
  triage(@Param('id') id: string, @Body() dto: TriageErDto, @Headers('x-actor-id') actorId = 'system') {
    return this.emergencyService.triage(id, dto, actorId);
  }
}
