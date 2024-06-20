import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password12345' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: '123 Main St.' })
  @IsString()
  @IsOptional()
  address?: string;
}
