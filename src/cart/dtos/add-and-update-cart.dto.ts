import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min } from 'class-validator';

export class AddAndUpdateCartDto {
  @ApiProperty({ minimum: 1 })
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty({ minimum: 1 })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}
