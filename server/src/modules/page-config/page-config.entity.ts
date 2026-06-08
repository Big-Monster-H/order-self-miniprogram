import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("page_configs")
export class PageConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  page_key: string; // "home", "category", "my" 等

  @Column({ type: "text" })
  config_json: string; // JSON 配置

  @Column({ default: "published" })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
