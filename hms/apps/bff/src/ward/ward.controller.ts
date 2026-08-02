import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { WardService } from './ward.service';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('wards')
@UseGuards(RolesGuard)
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Get()
  @RequirePermission('ward:read')
  list() {
    return this.wardService.listWards();
  }

  @Get('occupancy')
  @RequirePermission('ward:read')
  occupancy() {
    return this.wardService.occupancy();
  }

  @Get(':wardId/beds')
  @RequirePermission('ward:read')
  beds(@Param('wardId') wardId: string) {
    return this.wardService.listBeds(wardId);
  }
}
