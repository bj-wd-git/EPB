import { Body, Controller, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service';
import { CreateEmployeeDto, CreateLeaveDto } from './dto/hr.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('hr')
@UseGuards(RolesGuard)
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @Get('employees')
  @RequirePermission('hr:read')
  listEmployees() {
    return this.hrService.listEmployees();
  }

  @Post('employees')
  @RequirePermission('hr:write')
  createEmployee(@Body() dto: CreateEmployeeDto, @Headers('x-actor-id') actorId = 'system') {
    return this.hrService.createEmployee(dto, actorId);
  }

  @Post('leave')
  @RequirePermission('hr:write')
  requestLeave(@Body() dto: CreateLeaveDto, @Headers('x-actor-id') actorId = 'system') {
    return this.hrService.requestLeave(dto, actorId);
  }

  @Get('leave/pending')
  @RequirePermission('hr:read')
  listPendingLeave() {
    return this.hrService.listPendingLeave();
  }

  @Patch('leave/:id/approve')
  @RequirePermission('hr:write')
  approveLeave(@Param('id') id: string, @Headers('x-actor-id') actorId = 'system') {
    return this.hrService.approveLeave(id, actorId);
  }
}
