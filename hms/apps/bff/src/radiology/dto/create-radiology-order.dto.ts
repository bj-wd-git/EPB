import { IsIn, IsString } from 'class-validator';

export class CreateRadiologyOrderDto {
  @IsString()
  patientUhid: string;

  @IsIn(['xray', 'ct', 'mri', 'ultrasound'])
  modality: string;
}

export class UpdateRadiologyReportDto {
  @IsString()
  report: string;
}
