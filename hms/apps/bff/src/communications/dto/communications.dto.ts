import { IsIn, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsIn(['sms', 'email', 'whatsapp', 'push'])
  channel: string;

  @IsString()
  recipient: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  referenceId?: string;
}

export class AppointmentReminderDto {
  @IsString()
  appointmentId: string;
}
