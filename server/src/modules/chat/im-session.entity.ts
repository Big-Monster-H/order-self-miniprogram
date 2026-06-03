import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('im_sessions')
export class ImSession {
  @PrimaryGeneratedColumn() id: number;
  @Column() user_id: number;
  @Column() target_id: number;
  @Column({ nullable: true }) order_id: number;
  @Column({ nullable: true }) last_message: string;
  @Column({ nullable: true }) last_message_at: Date;
  @Column({ default: 0 }) user_unread: number;
  @Column({ default: 0 }) target_unread: number;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}