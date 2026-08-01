import { IsDateString, IsIn, IsString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  patientUhid: string;

  @IsUUID()
  doctorId: string;

  @IsDateString()
  slotStart: string;

  @IsDateString()
  slotEnd: string;

  @IsIn(['scheduled', 'walk-in'])
  type: 'scheduled' | 'walk-in';
}
