import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive } from 'class-validator';

export class RemoveFromCartDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  userId: number;
  
  @ApiProperty()
  @IsInt()
  @IsPositive()
  productId: number;
}
