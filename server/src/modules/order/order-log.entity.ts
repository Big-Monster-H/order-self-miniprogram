import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_logs')
export class OrderLog {
  @PrimaryGeneratedColumn() id: number;
  @Column() order_id: number;
  @ManyToOne(() => Order) @JoinColumn({ name: 'order_id' }) order: Order;
  @Column() action: string;
  @Column({ nullable: true }) description: string;
  @Column({ nullable: true }) operator: string;
  @CreateDateColumn() created_at: Date;
}