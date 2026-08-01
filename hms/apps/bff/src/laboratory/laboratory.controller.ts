import { Body, Controller, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { CreateLabOrderDto, UpdateLabResultsDto } from './dto/create-lab-order.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('lab')
@UseGuards(RolesGuard)
export class LaboratoryController {
  constructor(private readonly labService: LaboratoryService) {}

  @Get('tests')
  @RequirePermission('lab:read')
  listTests() {
    return this.labService.listTests();
  }

  @Post('orders')
  @RequirePermission('lab:write')
  create(@Body() dto: CreateLabOrderDto, @Headers('x-actor-id') actorId = 'system') {
    return this.labService.createOrder(dto, actorId);
  }

  @Get('orders/:id')
  @RequirePermission('lab:read')
  get(@Param('id') id: string) {
    return this.labService.getOrder(id);
  }

  @Patch('orders/:id/results')
  @RequirePermission('lab:write')
  results(@Param('id') id: string, @Body() dto: UpdateLabResultsDto, @Headers('x-actor-id') actorId = 'system') {
    return this.labService.updateResults(id, dto, actorId);
  }
}
