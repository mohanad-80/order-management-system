import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User with the specified ID not found.',
  })
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(+id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully.',
  })
  async createUser(@Body() userData: CreateUserDto) {
    return this.usersService.createUser(userData);
  }

  @Put(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User with the specified ID not found.',
  })
  async updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
    const user = await this.usersService.updateUser(+id, updateData);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User with the specified ID not found.',
  })
  async deleteUser(@Param('id') id: string) {
    const result = await this.usersService.deleteUser(+id);
    if (!result) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'User deleted successfully' };
  }
}
