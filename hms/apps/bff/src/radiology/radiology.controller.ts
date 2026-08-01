import { Body, Controller, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { RadiologyService } from './radiology.service';
import { CreateRadiologyOrderDto, UpdateRadiologyReportDto } from './dto/create-radiology-order.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('radiology')
@UseGuards(RolesGuard)
export class RadiologyController {
  constructor(private readonly radiologyService: RadiologyService) {}

  @Post('orders')
  @RequirePermission('radiology:write')
  create(@Body() dto: CreateRadiologyOrderDto, @Headers('x-actor-id') actorId = 'system') {
    return this.radiologyService.createOrder(dto, actorId);
  }

  @Get('orders/:id')
  @RequirePermission('radiology:read')
  get(@Param('id') id: string) {
    return this.radiologyService.getOrder(id);
  }

  @Patch('orders/:id/report')
  @RequirePermission('radiology:write')
  report(@Param('id') id: string, @Body() dto: UpdateRadiologyReportDto, @Headers('x-actor-id') actorId = 'system') {
    return this.radiologyService.updateReport(id, dto, actorId);
  }
}
