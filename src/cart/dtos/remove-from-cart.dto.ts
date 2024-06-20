import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class RemoveFromCartDto {
  @ApiProperty({ minimum: 1 })
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty({ minimum: 1 })
  @IsInt()
  @IsPositive()
  productId: number;
}
