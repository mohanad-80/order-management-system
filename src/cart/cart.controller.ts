import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddAndUpdateCartDto } from './dtos/add-and-update-cart.dto';
import { RemoveFromCartDto } from './dtos/remove-from-cart.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('add')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product successfully added to cart.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request: Please check the following issues:',
    content: {
      'application/json': {
        example: {
          errors: [
            'Invalid request body data.',
            'Invalid Product ID.',
            'Invalid quantity. Quantity cannot be bigger than stock.',
          ],
        },
      },
    },
  })
  async addToCart(@Body() body: AddAndUpdateCartDto) {
    return this.cartService.addToCart(
      body.userId,
      body.productId,
      body.quantity,
    );
  }

  @Get(':userId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cart items retrieved successfully.',
  })
  async viewCart(@Param('userId') userId: string) {
    return this.cartService.viewCart(parseInt(userId));
  }

  @Put('update')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product quantity in cart updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request: Please check the following issues:',
    content: {
      'application/json': {
        example: {
          errors: [
            'Invalid request body data.',
            'Invalid Product ID.',
            'Invalid quantity. Quantity cannot be bigger than stock.',
          ],
        },
      },
    },
  })
  async updateCart(@Body() body: AddAndUpdateCartDto) {
    return this.cartService.updateCart(
      body.userId,
      body.productId,
      body.quantity,
    );
  }

  @Delete('remove')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product removed from cart successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request body data.',
  })
  async removeFromCart(@Body() body: RemoveFromCartDto) {
    return this.cartService.removeFromCart(body.userId, body.productId);
  }
}
