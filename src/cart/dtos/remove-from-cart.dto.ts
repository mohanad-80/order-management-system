import { ApiProperty } from "@nestjs/swagger";

export class RemoveFromCartDto {
  @ApiProperty()
  userId: number;
  
  @ApiProperty()
  productId: number;
}
