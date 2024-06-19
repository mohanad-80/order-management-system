import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApplyCouponDto } from "./dtos/apply-coupon.dto";
import { ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Post()
  async createOrder(@Body() body: { userId: number }) {
    return this.orderService.createOrder(body.userId);
  }

  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string) {
    return this.orderService.getOrderById(parseInt(orderId));
  }

  @Put(':orderId/status')
  async updateOrderStatus(@Param('orderId') orderId: string, @Body() body: { status: string }) {
    return this.orderService.updateOrderStatus(parseInt(orderId), body.status);
  }

  @Get('/user/:userId')
  async getUserOrders(@Param('userId') userId: string) {
    return this.orderService.getUserOrders(parseInt(userId));
  }

  @Post('/apply-coupon')
  async applyCoupon(@Body() body: ApplyCouponDto) {
    return this.orderService.applyCoupon(body.orderId, body.discount);
  }
}
