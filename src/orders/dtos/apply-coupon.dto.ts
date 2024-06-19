import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive, Min, IsDecimal } from 'class-validator';

export class ApplyCouponDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  orderId: number;
  
  @ApiProperty()
  @IsDecimal()
  @Min(0)
  discount: number;
}
