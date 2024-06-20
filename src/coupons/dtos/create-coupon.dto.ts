import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Min, Max, IsInt } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ example: 'HAPPYEID' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 25 })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  discount: number;
}
