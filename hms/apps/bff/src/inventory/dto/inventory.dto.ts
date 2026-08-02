import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  sku: string;

  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  reorderLevel?: number;
}

export class StockMovementDto {
  @IsString()
  itemId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  reference?: string;
}
