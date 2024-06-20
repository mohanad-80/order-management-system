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

    for (let item of cartItems) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const order = await this.prisma.order.create({
      data: {
        userId,
        status: 'PENDING',
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

  async getUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { OrderItem: true },
    });
  }

  async applyCoupon(orderId: number, discount: number) {
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
      throw new Error('Order not found');
    }

    const total = order.OrderItem.reduce(
      (sum, item) => sum + item.quantity * item.Product.price,
      0,
    );

    const discountedTotal = total - discount;

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: `Discounted from ${total} to ${discountedTotal}`, // Assuming status field is used to keep track of discount information
      },
    });
  }
}
