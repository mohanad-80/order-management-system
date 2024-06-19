import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully.',
  })
  async createProduct(@Body() data: CreateProductDto) {
    return this.productService.createProduct(data);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product with the specified ID not found.',
  })
  async getProductById(@Param('id') id: number) {
    return this.productService.getProductById(+id);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of products retrieved successfully.',
  })
  async getProducts() {
    return this.productService.getProducts();
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product with the specified ID not found.',
  })
  async updateProduct(@Param('id') id: number, @Body() data: UpdateProductDto) {
    return this.productService.updateProduct(+id, data);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product with the specified ID not found.',
  })
  async deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(+id);
  }
}
