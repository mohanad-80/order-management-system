import { ApiProperty } from "@nestjs/swagger";

export class ApplyCouponDto {
  @ApiProperty()
  orderId: number;
  
  @ApiProperty()
  discount: number;
}
