import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApplyCouponDto } from './dtos/apply-coupon.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Order created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cart is empty. Cannot create order.',
  })
  async createOrder(@Body() body: { userId: number }) {
    return this.orderService.createOrder(body.userId);
  }

  @Get(':orderId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order with the specified ID not found.',
  })
  async getOrderById(@Param('orderId') orderId: string) {
    return this.orderService.getOrderById(parseInt(orderId));
  }

  @Put(':orderId/status')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order status updated successfully.',
  })
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() body: { status: string },
  ) {
    return this.orderService.updateOrderStatus(parseInt(orderId), body.status);
  }

  @Get('/user/:userId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User orders retrieved successfully.',
  })
  async getUserOrders(@Param('userId') userId: string) {
    return this.orderService.getUserOrders(parseInt(userId));
  }

  @Post('/apply-coupon')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Coupon applied to order successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Order with the specified ID not found.',
  })
  async applyCoupon(@Body() body: ApplyCouponDto) {
    return this.orderService.applyCoupon(body.orderId, body.discount);
  }
}
