import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateIncidentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'critical'])
  severity?: string;
}

export class CreateConsentDto {
  @IsString()
  patientUhid: string;

  @IsString()
  formType: string;
}

export class CreateCapaDto {
  @IsString()
  incidentId: string;

  @IsString()
  action: string;

  @IsString()
  assignedTo: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
