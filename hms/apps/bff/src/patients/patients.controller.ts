import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('patients')
@UseGuards(RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @RequirePermission('patients:write')
  create(@Body() dto: CreatePatientDto, @Headers('x-actor-id') actorId = 'system') {
    return this.patientsService.register(dto, actorId);
  }
}
