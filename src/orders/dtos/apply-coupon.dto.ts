import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min, IsDecimal, Max } from 'class-validator';

export class ApplyCouponDto {
  @ApiProperty({ minimum: 1 })
  @IsInt()
  @IsPositive()
  orderId: number;

  @ApiProperty({ example: 15.5, minimum: 0, maximum: 1 })
  @IsDecimal()
  @Min(0)
  @Max(100)
  discount: number;
}
