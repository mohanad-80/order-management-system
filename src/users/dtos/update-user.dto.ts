import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;
  
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;
  
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;
}
