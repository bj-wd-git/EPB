import { IsArray, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class PrescriptionItemDto {
  @IsString()
  drug: string;

  @IsString()
  dose: string;

  @IsString()
  frequency: string;
}

export class CreatePrescriptionDto {
  @IsString()
  patientUhid: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items: PrescriptionItemDto[];
}
