import { Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('pharmacy')
@UseGuards(RolesGuard)
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Post('prescriptions')
  @RequirePermission('pharmacy:write')
  prescribe(@Body() dto: CreatePrescriptionDto, @Headers('x-actor-id') actorId = 'system') {
    return this.pharmacyService.prescribe(dto, actorId);
  }

  @Get('prescriptions/:id')
  @RequirePermission('pharmacy:read')
  get(@Param('id') id: string) {
    return this.pharmacyService.getPrescription(id);
  }

  @Post('prescriptions/:id/dispense')
  @RequirePermission('pharmacy:write')
  dispense(@Param('id') id: string, @Headers('x-actor-id') actorId = 'system') {
    return this.pharmacyService.dispense(id, actorId);
  }
}
