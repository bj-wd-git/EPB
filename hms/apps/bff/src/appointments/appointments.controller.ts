import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('appointments')
@UseGuards(RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @RequirePermission('appointments:write')
  create(@Body() dto: CreateAppointmentDto, @Headers('x-actor-id') actorId = 'system') {
    return this.appointmentsService.book(dto, actorId);
  }
}
