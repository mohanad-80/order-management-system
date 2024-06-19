import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        Cart: true,
        Order: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    delete user.password;
    return user;
  }

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    address?: string;
  }) {
    const user = await this.prisma.user.findFirst({
      where: { email: userData.email },
    });

    if (user) {
      throw new HttpException('Email already in use.', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    delete newUser.password;
    return newUser;
  }

  async updateUser(
    id: number,
    updateData: {
      name?: string;
      email?: string;
      password: string;
      address?: string;
    },
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(updateData.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials.', HttpStatus.UNAUTHORIZED);
    }

    const newUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    delete newUser.password;
    return newUser;
  }

  async deleteUser(id: number, password: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials.', HttpStatus.UNAUTHORIZED);
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}
