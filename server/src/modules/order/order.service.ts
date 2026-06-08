import { Injectable } from "@nestjs/common";
import { BizException } from "../../common/exceptions/biz.exception";
import { ErrorCode } from "../../common/exceptions/error-codes";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Order, OrderStatus } from "./order.entity";
import { OrderLog } from "./order-log.entity";
import { Product } from "../product/product.entity";
import { EmployeeProfile } from "../employee/employee-profile.entity";
import { v4 as uuid } from "uuid";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderLog) private logRepo: Repository<OrderLog>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(EmployeeProfile) private empRepo: Repository<EmployeeProfile>,
  ) {}

  /** Admin: 所有订单列表 */
  async findAll(query?: { status?: string; page?: number; pageSize?: number }) {
    const { status, page = 1, pageSize = 20 } = query || {};
    const qb = this.orderRepo.createQueryBuilder("o")
      .leftJoinAndSelect("o.product", "p")
      .leftJoinAndSelect("o.user", "u");

    if (status) qb.andWhere("o.status = :st", { st: status });
    qb.orderBy("o.created_at", "DESC")
      .skip((+page - 1) * +pageSize)
      .take(+pageSize);

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async create(userId: number, dto: { product_id: number; quantity: number; remark?: string }) {
    // 悲观锁查询商品，防止超卖
    const product = await this.productRepo.findOne({
      where: { id: dto.product_id },
      lock: { mode: 'pessimistic_write' },
    });
    if (!product || product.status !== 1) throw new BizException(ErrorCode.PRODUCT_OFFLINE);
    const qty = dto.quantity || 1;
    // 库存校验（-1=无限库存）
    if (product.stock !== -1 && product.stock < qty) {
      throw new BizException(ErrorCode.ORDER_STOCK_OUT);
    }
    const total = product.price * qty;
    const commission = Math.floor(total * 8 / 100);
    const no = this.genNo();
    // 扣减库存
    if (product.stock !== -1) {
      product.stock -= qty;
      await this.productRepo.save(product);
    }
    const data: any = {
      order_no: no, user_id: userId, product_id: product.id, quantity: qty,
      unit_price: product.price, total_amount: total, commission,
      remark: dto.remark || "", status: OrderStatus.PENDING,
    };
    const saved = await this.orderRepo.save(data);
    await this.logRepo.save({ order_id: saved.id, action: "create", description: "用户创建订单" });
    return this.findOne(saved.id);
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id }, relations: ["product", "product.category", "user", "logs"] as any,
    });
    if (!order) throw new BizException(ErrorCode.ORDER_NOT_FOUND);
    return order;
  }

  async findByUser(userId: number, status?: string, page = 1, pageSize = 10) {
    const qb = this.orderRepo.createQueryBuilder("o")
      .leftJoinAndSelect("o.product", "p")
      .where("o.user_id = :uid", { uid: userId });
    if (status) qb.andWhere("o.status = :st", { st: status });
    qb.orderBy("o.created_at", "DESC").skip((+page - 1) * +pageSize).take(+pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async findEmployeeOrders(employeeId: number, status?: string, page = 1, pageSize = 10) {
    const qb = this.orderRepo.createQueryBuilder("o")
      .leftJoinAndSelect("o.product", "p")
      .leftJoinAndSelect("o.user", "u")
      .where("o.employee_id = :eid", { eid: employeeId });
    if (status) qb.andWhere("o.status = :st", { st: status });
    qb.orderBy("o.created_at", "DESC").skip((+page - 1) * +pageSize).take(+pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async findTaskPool(categoryId?: number, page = 1, pageSize = 10) {
    const qb = this.orderRepo.createQueryBuilder("o")
      .leftJoinAndSelect("o.product", "p")
      .where("o.status = :st AND o.employee_id IS NULL", { st: OrderStatus.PAID });
    if (categoryId) qb.andWhere("p.category_id = :cid", { cid: categoryId });
    qb.orderBy("o.created_at", "DESC").skip((+page - 1) * +pageSize).take(+pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async acceptOrder(orderId: number, employeeId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new BizException(ErrorCode.ORDER_NOT_FOUND);
    if (order.status !== OrderStatus.PAID || order.employee_id)
      throw new BizException(ErrorCode.ORDER_STATUS_ERR, 400);
    order.employee_id = employeeId;
    order.status = OrderStatus.ACCEPTED;
    order.accepted_at = new Date();
    await this.orderRepo.save(order as any);
    await this.logRepo.save({ order_id: order.id, action: "accept", description: "员工" + employeeId + "接单" });
    return this.findOne(orderId);
  }

  async completeOrder(orderId: number, userId: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId, user_id: userId } });
    if (!order) throw new BizException(ErrorCode.ORDER_NOT_FOUND);
    if (order.status !== OrderStatus.DELIVERING && order.status !== OrderStatus.ACCEPTED)
      throw new BizException(ErrorCode.ORDER_STATUS_ERR, 400);
    order.status = OrderStatus.COMPLETED;
    order.completed_at = new Date();
    await this.orderRepo.save(order as any);
    await this.logRepo.save({ order_id: order.id, action: "complete", description: "订单已完成" });
    if (order.employee_id) {
      const emp = await this.empRepo.findOne({ where: { user_id: order.employee_id } });
      if (emp) {
        emp.completed_orders += 1;
        emp.total_income += order.total_amount - order.commission;
        emp.active_orders -= 1;
        await this.empRepo.save(emp as any);
      }
    }
    return this.findOne(orderId);
  }

  async updateStatus(orderId: number, status: OrderStatus) {
    const order = await this.orderRepo.findOne({ where: { id: orderId }, relations: ["product"] as any });
    if (!order) throw new BizException(ErrorCode.ORDER_NOT_FOUND);
    // 取消/退款时恢复库存
    if ([OrderStatus.CANCELLED, OrderStatus.REFUNDED].includes(status)) {
      const product = order.product as any;
      if (product && product.stock !== -1) {
        product.stock += order.quantity;
        await this.productRepo.save(product);
      }
    }
    await this.orderRepo.update(orderId, { status } as any);
    await this.logRepo.save({ order_id: orderId, action: "status_change", description: "状态变更为: " + status });
    return this.findOne(orderId);
  }

  async findUserOrder(orderId: number, userId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId }, relations: ["product", "product.category", "user", "logs"] as any,
    });
    if (!order) throw new BizException(ErrorCode.ORDER_NOT_FOUND);
    if (order.user_id !== userId && order.employee_id !== userId) {
      throw new BizException(ErrorCode.ORDER_NOT_FOUND);
    }
    return order;
  }

  private genNo(): string {
    const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return d + uuid().replace(/-/g, "").slice(0, 16).toUpperCase();
  }
}
