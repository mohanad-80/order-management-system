import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, IsDecimal, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;
  
  @ApiProperty()
  @IsString()
  description: string;
  
  @ApiProperty()
  @IsDecimal()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  stock: number;
}
