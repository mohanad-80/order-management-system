import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddAndUpdateCartDto } from './dtos/add-and-update-cart.dto';
import { RemoveFromCartDto } from './dtos/remove-from-cart.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add')
  async addToCart(@Body() body: AddAndUpdateCartDto) {
    return this.cartService.addToCart(
      body.userId,
      body.productId,
      body.quantity,
    );
  }

  @Get(':userId')
  async viewCart(@Param('userId') userId: string) {
    return this.cartService.viewCart(parseInt(userId));
  }

  @Put('update')
  async updateCart(@Body() body: AddAndUpdateCartDto) {
    return this.cartService.updateCart(
      body.userId,
      body.productId,
      body.quantity,
    );
  }

  @Delete('remove')
  async removeFromCart(@Body() body: RemoveFromCartDto) {
    return this.cartService.removeFromCart(body.userId, body.productId);
  }
}
