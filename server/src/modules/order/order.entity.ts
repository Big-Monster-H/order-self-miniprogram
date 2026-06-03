import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { OrderLog } from './order-log.entity';

export enum OrderStatus { PENDING = 'pending', PAID = 'paid', ACCEPTED = 'accepted', DELIVERING = 'delivering', COMPLETED = 'completed', CANCELLED = 'cancelled', REFUNDING = 'refunding', REFUNDED = 'refunded' }

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) order_no: string;
  @Column() user_id: number;
  @ManyToOne(() => User) @JoinColumn({ name: 'user_id' }) user: User;
  @Column() product_id: number;
  @ManyToOne(() => Product) @JoinColumn({ name: 'product_id' }) product: Product;
  @Column({ nullable: true }) employee_id: number;
  @Column({ default: 1 }) quantity: number;
  @Column() unit_price: number;
  @Column() total_amount: number;
  @Column({ default: 0 }) commission: number;
  @Column({ type: 'text', nullable: true }) remark: string;
  @Column({ type: 'varchar', default: OrderStatus.PENDING }) status: OrderStatus;
  @Column({ nullable: true }) paid_at: Date;
  @Column({ nullable: true }) accepted_at: Date;
  @Column({ nullable: true }) completed_at: Date;
  @Column({ nullable: true }) wx_transaction_id: string;
  @OneToMany(() => OrderLog, (log: OrderLog) => log.order) logs: OrderLog[];
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}