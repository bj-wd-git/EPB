import { IsDateString, IsString } from 'class-validator';

export class CreateOtBookingDto {
  @IsString()
  patientUhid: string;

  @IsString()
  surgeonId: string;

  @IsString()
  procedure: string;

  @IsDateString()
  scheduledAt: string;
}
