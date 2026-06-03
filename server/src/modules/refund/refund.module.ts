import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Refund } from './refund.entity';
import { Order } from '../order/order.entity';
import { Product } from '../product/product.entity';
import { Category } from '../category/category.entity';
import { RefundService } from './refund.service';
import { RefundController } from './refund.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Refund, Order, Product, Category])],
  controllers: [RefundController],
  providers: [RefundService],
})
export class RefundModule {}