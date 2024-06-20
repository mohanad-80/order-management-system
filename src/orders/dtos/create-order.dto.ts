import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  userId: number;
}
