import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;
  
  @ApiProperty()
  @IsEmail()
  email: string;
  
  @ApiProperty()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;
}
