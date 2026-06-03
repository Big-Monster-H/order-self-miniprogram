import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../category/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn() id: number;
  @Column() category_id: number;
  @ManyToOne(() => Category) @JoinColumn({ name: 'category_id' }) category: Category;
  @Column() title: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ nullable: true }) cover: string;
  @Column({ type: 'simple-json', nullable: true }) images: string[];
  @Column() price: number;
  @Column({ default: 0 }) original_price: number;
  @Column({ default: 0 }) sold_count: number;
  @Column({ nullable: true }) delivery_days: string;
  @Column({ type: 'simple-json', nullable: true }) tags: string[];
  @Column({ default: 1 }) status: number;
  @Column({ default: 0 }) sort: number;
  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}