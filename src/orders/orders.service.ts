import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number) {
    const cartItems = await this.prisma.cart.findMany({
      where: { userId },
    });

    if (cartItems.length === 0) {
      throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
    }

    let totalPrice = 0;

    for (let item of cartItems) {
      const product = await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
      totalPrice += item.quantity * product.price;
    }

    const order = await this.prisma.order.create({
      data: {
        userId,
        status: 'PENDING',
        total: totalPrice,
        OrderItem: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    await this.prisma.cart.deleteMany({
      where: { userId },
    });

    return order;
  }

  async getOrderById(orderId: number) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { OrderItem: true },
    });
  }

  async updateOrderStatus(orderId: number, status: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async applyCoupon(orderId: number, code: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: {
        code: code,
      },
    });

    if (!coupon) {
      throw new HttpException('Coupon not found.', HttpStatus.NOT_FOUND);
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        OrderItem: {
          include: {
            Product: true,
          },
        },
      },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    if (order.discountApplied) {
      throw new HttpException(
        'There is already a discount applied.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const total = order.total;

    const discountedTotal = total * ((100 - coupon.discount) / 100);

    return this.prisma.order.update({
      where: { id: orderId },
      data: { total: discountedTotal, discountApplied: true },
    });
  }
}
