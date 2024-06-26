import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma.module';
import { ProductModule } from './product/product.module';
import { CouponsModule } from './coupons/coupons.module';

@Module({
  imports: [PrismaModule, CartModule, OrdersModule, UsersModule, ProductModule, CouponsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
