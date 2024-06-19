import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  name: string;
  
  @ApiProperty()
  email: string;
  
  @ApiProperty()
  password: string;

  @ApiPropertyOptional()
  address?: string;
}
