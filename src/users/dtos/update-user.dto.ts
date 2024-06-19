import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiPropertyOptional()
  name?: string;
  
  @ApiPropertyOptional()
  email?: string;
  
  @ApiPropertyOptional()
  password?: string;

  @ApiPropertyOptional()
  address?: string;
}
