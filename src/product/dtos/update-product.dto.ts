import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsDecimal, Min, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Test Product' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'A test product description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 19.99 })
  @IsDecimal()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 25 })
  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;
}
