import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min } from 'class-validator';

export class AddAndUpdateCartDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;
}
