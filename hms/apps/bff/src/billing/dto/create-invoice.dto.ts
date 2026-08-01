import { IsArray, IsOptional, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class InvoiceLineDto {
  @IsString()
  description: string;

  amount: number;

  @IsOptional()
  @IsString()
  source?: string;
}

export class CreateInvoiceDto {
  @IsString()
  patientUhid: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineDto)
  lines: InvoiceLineDto[];
}
