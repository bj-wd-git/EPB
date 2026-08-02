import { Body, Controller, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OtService } from './ot.service';
import { CreateOtBookingDto } from './dto/create-ot-booking.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('ot')
@UseGuards(RolesGuard)
export class OtController {
  constructor(private readonly otService: OtService) {}

  @Post('bookings')
  @RequirePermission('ot:write')
  book(@Body() dto: CreateOtBookingDto, @Headers('x-actor-id') actorId = 'system') {
    return this.otService.book(dto, actorId);
  }

  @Get('bookings/:id')
  @RequirePermission('ot:read')
  get(@Param('id') id: string) {
    return this.otService.get(id);
  }

  @Patch('bookings/:id/complete')
  @RequirePermission('ot:write')
  complete(@Param('id') id: string, @Headers('x-actor-id') actorId = 'system') {
    return this.otService.complete(id, actorId);
  }
}
