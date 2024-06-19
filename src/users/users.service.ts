import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        Cart: true,
        Order: true,
      },
    });
  }

  async createUser(userData: { name: string; email: string; password: string; address?: string }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  async updateUser(id: number, updateData: { name?: string; email?: string; password?: string; address?: string }) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      return null;
    }
    await this.prisma.user.delete({
      where: { id },
    });
    return true;
  }
}
