import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Settlement } from './settlement.entity';
import { SettlementService } from './settlement.service';
import { Order } from '../order/order.entity';
import { EmployeeProfile } from '../employee/employee-profile.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Settlement, Order, EmployeeProfile]),
  ],
  providers: [SettlementService],
  exports: [SettlementService],
})
export class SettlementModule {}
