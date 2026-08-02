import { Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { DoctorPortalService } from './doctor-portal.service';
import { DoctorNoteDto } from './dto/doctor-portal.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('portal/doctor')
@UseGuards(RolesGuard)
export class DoctorPortalController {
  constructor(private readonly portalService: DoctorPortalService) {}

  @Get(':doctorId/schedule')
  @RequirePermission('portal:doctor:read')
  schedule(@Param('doctorId') doctorId: string) {
    return this.portalService.schedule(doctorId);
  }

  @Get(':doctorId/lab-queue')
  @RequirePermission('portal:doctor:read')
  labQueue(@Param('doctorId') doctorId: string) {
    return this.portalService.labQueue(doctorId);
  }

  @Post(':doctorId/notes')
  @RequirePermission('portal:doctor:write')
  addNote(@Param('doctorId') doctorId: string, @Body() dto: DoctorNoteDto) {
    return this.portalService.addNote(doctorId, dto);
  }
}
