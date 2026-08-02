import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { CommunicationsService } from './communications.service';
import { SendMessageDto, AppointmentReminderDto } from './dto/communications.dto';
import { RolesGuard } from '../common/roles.guard';
import { RequirePermission } from '../common/roles.decorator';

@Controller('communications')
@UseGuards(RolesGuard)
export class CommunicationsController {
  constructor(private readonly commsService: CommunicationsService) {}

  @Post('messages')
  @RequirePermission('communications:write')
  send(@Body() dto: SendMessageDto, @Headers('x-actor-id') actorId = 'system') {
    return this.commsService.send(dto, actorId);
  }

  @Get('messages')
  @RequirePermission('communications:read')
  list() {
    return this.commsService.listRecent();
  }

  @Post('reminders/appointment')
  @RequirePermission('communications:write')
  appointmentReminder(@Body() dto: AppointmentReminderDto, @Headers('x-actor-id') actorId = 'system') {
    return this.commsService.appointmentReminder(dto, actorId);
  }
}
