import { Body, Controller, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IpdService } from './ipd.service';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('ipd')
@UseGuards(RolesGuard)
export class IpdController {
  constructor(private readonly ipdService: IpdService) {}

  @Post('admissions')
  @RequirePermission('ipd:write')
  admit(@Body() dto: CreateAdmissionDto, @Headers('x-actor-id') actorId = 'system') {
    return this.ipdService.admit(dto, actorId);
  }

  @Get('admissions/:id')
  @RequirePermission('ipd:read')
  get(@Param('id') id: string) {
    return this.ipdService.get(id);
  }

  @Post('admissions/:id/discharge')
  @RequirePermission('ipd:write')
  discharge(@Param('id') id: string, @Headers('x-actor-id') actorId = 'system') {
    return this.ipdService.discharge(id, actorId);
  }

  @Patch('admissions/:id/transfer')
  @RequirePermission('ipd:write')
  transfer(@Param('id') id: string, @Body('bedId') bedId: string, @Headers('x-actor-id') actorId = 'system') {
    return this.ipdService.transfer(id, bedId, actorId);
  }
}
