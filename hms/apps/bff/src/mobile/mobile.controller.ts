import { Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { MobileService } from './mobile.service';
import { RegisterDeviceDto } from './dto/mobile.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('mobile')
@UseGuards(RolesGuard)
export class MobileController {
  constructor(private readonly mobileService: MobileService) {}

  @Post('devices')
  @RequirePermission('mobile:write')
  registerDevice(@Body() dto: RegisterDeviceDto, @Headers('x-actor-id') actorId = 'system') {
    return this.mobileService.registerDevice(dto, actorId);
  }

  @Get('devices')
  @RequirePermission('mobile:read')
  listDevices() {
    return this.mobileService.listDevices();
  }

  @Get('patient/:uhid/sync')
  @RequirePermission('mobile:read')
  patientSync(@Param('uhid') uhid: string) {
    return this.mobileService.patientSync(uhid);
  }

  @Get('doctor/:doctorId/sync')
  @RequirePermission('mobile:read')
  doctorSync(@Param('doctorId') doctorId: string) {
    return this.mobileService.doctorSync(doctorId);
  }

  @Get('nurse/sync')
  @RequirePermission('mobile:read')
  nurseSync() {
    return this.mobileService.nurseSync();
  }
}
