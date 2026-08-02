import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePolicyDto {
  @IsString()
  patientUhid: string;

  @IsString()
  provider: string;

  @IsString()
  policyNumber: string;

  @IsNumber()
  coverageLimit: number;
}

export class CreatePreAuthDto {
  @IsString()
  patientUhid: string;

  @IsString()
  policyId: string;

  @IsNumber()
  estimatedAmount: number;

  @IsString()
  procedure: string;
}

export class CreateClaimDto {
  @IsString()
  patientUhid: string;

  @IsString()
  policyId: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  invoiceId?: string;
}
