import { IsString } from 'class-validator';

export class DoctorNoteDto {
  @IsString()
  patientUhid: string;

  @IsString()
  text: string;
}
