import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";
import { Refund, RefundStatus } from "./refund.entity";
import { Order, OrderStatus } from "../order/order.entity";

@Injectable()
export class RefundService {
  constructor(
    @InjectRepository(Refund) private repo: Repository<Refund>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {}

  async findAll() {
    return this.repo.find({
      relations: ["order", "order.product"],
      order: { created_at: "DESC" },
    });
  }

  async apply(userId: number, orderId: number, reason: string, images?: string[]) {
    // 幂等检查：同一订单已有退款申请则拒绝
    const existing = await this.repo.findOne({ where: { order_id: orderId } });
    if (existing) throw new BadRequestException("该订单已提交退款申请，请勿重复申请");
    
    const order = await this.orderRepo.findOne({ where: { id: orderId, user_id: userId } });
    if (!order) throw new NotFoundException("订单不存在");
    if ([OrderStatus.COMPLETED, OrderStatus.REFUNDING, OrderStatus.REFUNDED].includes(order.status)) {
      throw new BadRequestException("订单状态不可申请退款");
    }

    const refund = this.repo.create({
      refund_no: "RF" + Date.now() + uuid().slice(0, 6).toUpperCase(),
      order_id: orderId,
      user_id: userId,
      amount: order.total_amount,
      reason,
      images: images || [],
    });
    await this.repo.save(refund);

    order.status = OrderStatus.REFUNDING;
    await this.orderRepo.save(order);

    return refund;
  }

  async findByUser(userId: number) {
    return this.repo.find({
      where: { user_id: userId },
      relations: ["order", "order.product"],
      order: { created_at: "DESC" },
    });
  }

  async findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ["order", "order.product"] });
  }

  async approve(id: number, adminId: number, remark?: string) {
    const refund = await this.repo.findOne({ where: { id } });
    if (!refund) throw new NotFoundException("退款申请不存在");
    if (refund.status !== RefundStatus.PENDING) throw new BadRequestException("退款状态不允许审批");

    refund.status = RefundStatus.APPROVED;
    refund.admin_id = adminId;
    refund.admin_remark = remark || "";
    refund.audited_at = new Date();
    await this.repo.save(refund);

    await this.orderRepo.update(refund.order_id, { status: OrderStatus.REFUNDED });

    return refund;
  }

  async reject(id: number, adminId: number, remark: string) {
    const refund = await this.repo.findOne({ where: { id } });
    if (!refund) throw new NotFoundException("退款申请不存在");

    refund.status = RefundStatus.REJECTED;
    refund.admin_id = adminId;
    refund.admin_remark = remark;
    refund.audited_at = new Date();
    await this.repo.save(refund);

    await this.orderRepo.update(refund.order_id, { status: OrderStatus.PAID });

    return refund;
  }
}

