import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

export enum EmployeeStatus { PENDING = 'pending', APPROVED = 'approved', REJECTED = 'rejected', FROZEN = 'frozen' }

@Entity('employee_profiles')
export class EmployeeProfile {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) user_id: number;
  @OneToOne(() => User) @JoinColumn({ name: 'user_id' }) user: User;
  @Column({ nullable: true }) skills: string;
  @Column({ type: 'simple-json', nullable: true }) skill_tags: string[];
  @Column({ nullable: true }) cert_images: string;
  @Column({ default: 0 }) deposit: number;
  @Column({ default: 0 }) deposit_paid: number;
  @Column({ type: 'varchar', default: EmployeeStatus.PENDING }) status: EmployeeStatus;
  @Column({ nullable: true }) audit_remark: string;
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.00 }) rating: number;
  @Column({ default: 0 }) completed_orders: number;
  @Column({ default: 0 }) total_income: number;
  @Column({ default: 0 }) active_orders: number;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}