import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateErVisitDto {
  @IsOptional()
  @IsString()
  patientUhid?: string;

  @IsOptional()
  @IsString()
  walkInName?: string;

  @IsOptional()
  @IsString()
  chiefComplaint?: string;
}

export class TriageErDto {
  @IsIn(['1', '2', '3', '4', '5'])
  triageLevel: string;
}
