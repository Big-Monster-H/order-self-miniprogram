import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cms_articles')
export class CmsArticle {
  @PrimaryGeneratedColumn() id: number;
  @Column() title: string;
  @Column() type: string;
  @Column({ type: 'text', nullable: true }) content: string;
  @Column({ nullable: true }) cover: string;
  @Column({ nullable: true }) summary: string;
  @Column({ nullable: true }) link: string;
  @Column({ default: 1 }) status: number;
  @Column({ default: 0 }) sort: number;
  @Column({ default: 0 }) views: number;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}