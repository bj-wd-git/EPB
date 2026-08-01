import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class CreateLabOrderDto {
  @IsString()
  patientUhid: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  testCodes: string[];
}

export class UpdateLabResultsDto {
  results: Record<string, string>;
}
