import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum MessageType { TEXT = 'text', IMAGE = 'image', FILE = 'file', SYSTEM = 'system' }

@Entity('im_messages')
export class ImMessage {
  @PrimaryGeneratedColumn() id: number;
  @Column() session_id: number;
  @Column() sender_id: number;
  @Column() receiver_id: number;
  @Column({ type: 'varchar', default: MessageType.TEXT }) type: MessageType;
  @Column({ type: 'text' }) content: string;
  @Column({ nullable: true }) attachment: string;
  @Column({ default: 0 }) is_read: number;
  @CreateDateColumn() created_at: Date;
}