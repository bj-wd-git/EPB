import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('reports')
@UseGuards(RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('operational')
  @RequirePermission('reports:read')
  operational() {
    return this.reportsService.operational();
  }

  @Get('financial')
  @RequirePermission('reports:read')
  financial() {
    return this.reportsService.financial();
  }

  @Get('clinical')
  @RequirePermission('reports:read')
  clinical() {
    return this.reportsService.clinical();
  }

  @Get('inventory')
  @RequirePermission('reports:read')
  inventory() {
    return this.reportsService.inventory();
  }
}
