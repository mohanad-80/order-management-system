import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCouponDto } from './dtos/create-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async createCoupon(createCouponDto: CreateCouponDto) {
    return this.prisma.coupon.create({
      data: createCouponDto,
    });
  }
}
