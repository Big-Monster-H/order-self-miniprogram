import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum SettlementStatus { PENDING = 'pending', COMPLETED = 'completed', FAILED = 'failed' }

@Entity('settlements')
export class Settlement {
  @PrimaryGeneratedColumn() id: number;
  @Column() employee_id: number;
  @Column() order_id: number;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) amount: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) commission: number;
  @Column({ type: 'varchar', default: SettlementStatus.PENDING }) status: SettlementStatus;
  @Column({ nullable: true }) remark: string;
  @CreateDateColumn() settled_at: Date;
  @CreateDateColumn() created_at: Date;
}
