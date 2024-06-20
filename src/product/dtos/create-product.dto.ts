import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDecimal, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Test Product' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'A test product description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 19.99 })
  @IsDecimal()
  @Min(0)
  price: number;

  @ApiProperty({ example: 25 })
  @IsInt()
  @Min(0)
  stock: number;
}
