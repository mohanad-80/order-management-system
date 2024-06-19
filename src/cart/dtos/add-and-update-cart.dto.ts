import { ApiProperty } from "@nestjs/swagger";

export class AddAndUpdateCartDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  productId: number;
  
  @ApiProperty()
  quantity: number;
}
