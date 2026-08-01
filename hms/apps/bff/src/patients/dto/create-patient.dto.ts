import { IsBoolean, IsDateString, IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsUUID()
  branchId: string;

  @IsOptional()
  @IsBoolean()
  overrideDuplicate?: boolean;
}
