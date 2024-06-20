import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
  Min,
  IsDecimal,
  Max,
  IsString,
} from 'class-validator';

export class ApplyCouponDto {
  @ApiProperty({ minimum: 1 })
  @IsInt()
  @IsPositive()
  orderId: number;

  @ApiProperty({ example: 'HAPPYEID', minimum: 0, maximum: 1 })
  @IsString()
  code: string;
}
