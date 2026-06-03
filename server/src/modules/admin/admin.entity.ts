import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AdminRole { SUPER = 'super', ADMIN = 'admin', EDITOR = 'editor', FINANCE = 'finance' }

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) username: string;
  @Column() password: string;
  @Column() display_name: string;
  @Column({ type: 'varchar', default: AdminRole.ADMIN }) role: AdminRole;
  @Column({ nullable: true }) avatar: string;
  @Column({ default: 1 }) status: number;
  @Column({ nullable: true }) last_login_at: Date;
  @Column({ nullable: true }) last_login_ip: string;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}