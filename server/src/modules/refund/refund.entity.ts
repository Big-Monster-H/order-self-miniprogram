import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../order/order.entity';

export enum RefundStatus { PENDING = 'pending', APPROVED = 'approved', REJECTED = 'rejected', COMPLETED = 'completed' }

@Entity('refunds')
export class Refund {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) refund_no: string;
  @Column() order_id: number;
  @ManyToOne(() => Order) @JoinColumn({ name: 'order_id' }) order: Order;
  @Column() user_id: number;
  @Column() amount: number;
  @Column() reason: string;
  @Column({ type: 'simple-json', nullable: true }) images: string[];
  @Column({ type: 'varchar', default: RefundStatus.PENDING }) status: RefundStatus;
  @Column({ nullable: true }) admin_remark: string;
  @Column({ nullable: true }) admin_id: number;
  @Column({ nullable: true }) audited_at: Date;
  @Column({ nullable: true }) refund_transaction_id: string;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}