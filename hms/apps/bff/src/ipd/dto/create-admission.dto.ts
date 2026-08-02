import { IsString } from 'class-validator';

export class CreateAdmissionDto {
  @IsString()
  patientUhid: string;

  @IsString()
  bedId: string;
}
