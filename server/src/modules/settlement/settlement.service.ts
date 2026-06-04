import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Order, OrderStatus } from '../order/order.entity';
import { EmployeeProfile } from '../employee/employee-profile.entity';
import { Settlement, SettlementStatus } from './settlement.entity';

@Injectable()
export class SettlementService {
  private readonly logger = new Logger(SettlementService.name);

  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(EmployeeProfile) private empRepo: Repository<EmployeeProfile>,
    @InjectRepository(Settlement) private settlementRepo: Repository<Settlement>,
  ) {}

  /** 每天凌晨2点自动结算 */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async autoSettle() {
    this.logger.log('开始每日佣金结算...');
    const completedOrders = await this.orderRepo.find({
      where: { status: OrderStatus.COMPLETED },
    });

    let settled = 0;
    for (const order of completedOrders) {
      // 检查是否已结算
      const exists = await this.settlementRepo.findOne({ where: { order_id: order.id } });
      if (exists || !order.employee_id) continue;

      const earnings = order.total_amount - order.commission;
      await this.settlementRepo.save({
        employee_id: order.employee_id,
        order_id: order.id,
        amount: earnings,
        commission: order.commission,
        status: SettlementStatus.COMPLETED,
      });

      // 更新员工余额
      const emp = await this.empRepo.findOne({ where: { user_id: order.employee_id } });
      if (emp) {
        emp.total_income += earnings;
        await this.empRepo.save(emp);
      }
      settled++;
    }
    this.logger.log(`结算完成，共处理 ${settled} 笔`);
  }

  /** 手动触发结算（管理后台调用） */
  async manualSettle() {
    await this.autoSettle();
    return { message: '结算任务已执行' };
  }

  /** 查询结算记录 */
  async findAll(employeeId?: number) {
    const where: any = {};
    if (employeeId) where.employee_id = employeeId;
    return this.settlementRepo.find({ where, order: { settled_at: 'DESC' } });
  }
}
