import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: number, productId: number, quantity: number) {
    const cartItem = await this.prisma.cart.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    if (cartItem) {
      return this.prisma.cart.update({
        where: {
          userId_productId: { userId, productId }
        },
        data: {
          quantity: cartItem.quantity + quantity,
        },
      });
    } else {
      return this.prisma.cart.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });
    }
  }

  async viewCart(userId: number) {
    return this.prisma.cart.findMany({
      where: { userId },
      include: { Product: true },
    });
  }

  async updateCart(userId: number, productId: number, quantity: number) {
    return this.prisma.cart.updateMany({
      where: {
        userId,
        productId,
      },
      data: {
        quantity,
      },
    });
  }

  async removeFromCart(userId: number, productId: number) {
    return this.prisma.cart.deleteMany({
      where: {
        userId,
        productId,
      },
    });
  }
}
