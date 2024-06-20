import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({ example: 'password12345' })
  @IsString()
  password: string;
}
