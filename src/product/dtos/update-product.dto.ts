import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsDecimal, Min, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsDecimal()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;
}
