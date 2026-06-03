import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole { USER = "user", EMPLOYEE = "employee", BOTH = "both" }

@Entity("users")
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) openid: string;
  @Column({ nullable: true }) unionid: string;
  @Column() nickname: string;
  @Column({ nullable: true }) avatar: string;
  @Column({ nullable: true }) phone: string;
  @Column({ nullable: true }) real_name: string;
  @Column({ nullable: true }) id_card: string;
  @Column({ type: "varchar", default: UserRole.USER }) role: UserRole;
  @Column({ default: 1 }) status: number;
  @Column({ nullable: true }) session_key: string;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
