import { IsDateString, IsString } from 'class-validator';

export class PortalBookAppointmentDto {
  @IsString()
  doctorId: string;

  @IsDateString()
  slotStart: string;

  @IsDateString()
  slotEnd: string;
}

export class PortalTeleconsultDto {
  @IsString()
  doctorId: string;

  @IsDateString()
  scheduledAt: string;
}
