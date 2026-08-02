import { Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { PatientPortalService } from './patient-portal.service';
import { PortalBookAppointmentDto, PortalTeleconsultDto } from './dto/patient-portal.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('portal/patient')
@UseGuards(RolesGuard)
export class PatientPortalController {
  constructor(private readonly portalService: PatientPortalService) {}

  @Get(':uhid/dashboard')
  @RequirePermission('portal:patient:read')
  dashboard(@Param('uhid') uhid: string) {
    return this.portalService.dashboard(uhid);
  }

  @Get(':uhid/appointments')
  @RequirePermission('portal:patient:read')
  appointments(@Param('uhid') uhid: string) {
    return this.portalService.appointments(uhid);
  }

  @Get(':uhid/bills')
  @RequirePermission('portal:patient:read')
  bills(@Param('uhid') uhid: string) {
    return this.portalService.bills(uhid);
  }

  @Get(':uhid/prescriptions')
  @RequirePermission('portal:patient:read')
  prescriptions(@Param('uhid') uhid: string) {
    return this.portalService.prescriptions(uhid);
  }

  @Get(':uhid/lab-reports')
  @RequirePermission('portal:patient:read')
  labReports(@Param('uhid') uhid: string) {
    return this.portalService.labReports(uhid);
  }

  @Post(':uhid/appointments')
  @RequirePermission('portal:patient:write')
  bookAppointment(@Param('uhid') uhid: string, @Body() dto: PortalBookAppointmentDto, @Headers('x-actor-id') actorId = 'patient') {
    return this.portalService.bookAppointment(uhid, dto, actorId);
  }

  @Post(':uhid/teleconsult')
  @RequirePermission('portal:patient:write')
  bookTeleconsult(@Param('uhid') uhid: string, @Body() dto: PortalTeleconsultDto, @Headers('x-actor-id') actorId = 'patient') {
    return this.portalService.bookTeleconsult(uhid, dto, actorId);
  }
}
