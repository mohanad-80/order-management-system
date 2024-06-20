import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min, IsDecimal, Max } from 'class-validator';

export class ApplyCouponDto {
  @ApiProperty({ minimum: 1 })
  @IsInt()
  @IsPositive()
  orderId: number;

  @ApiProperty({ example: 0.33, minimum: 0, maximum: 1 })
  @IsDecimal()
  @Min(0)
  @Max(1)
  discount: number;
}
