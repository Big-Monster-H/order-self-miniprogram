import { Injectable, NotFoundException } from "@nestjs/common";

function sanitizeHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/<a\s+href\s*=\s*"javascript:[^"]*"[^>]*>/gi, '<a>')
    .replace(/<a\s+href\s*=\s*'javascript:[^']*'[^>]*>/gi, '<a>');
}
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CmsArticle } from "./cms-article.entity";

@Injectable()
export class CmsService {
  constructor(
    @InjectRepository(CmsArticle) private repo: Repository<CmsArticle>,
  ) {}

  async findAll(query: { type?: string; page?: number; pageSize?: number }) {
    const { type, page = 1, pageSize = 20 } = query;
    const where: any = {};
    if (type) where.type = type;

    const [list, total] = await this.repo.findAndCount({
      where,
      order: { sort: "ASC", created_at: "DESC" },
      skip: (+page - 1) * +pageSize,
      take: +pageSize,
    });
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async findByType(type: string) {
    return this.repo.find({
      where: { type, status: 1 },
      order: { sort: "ASC", created_at: "DESC" },
    });
  }

  async findOne(id: number) {
    const article = await this.repo.findOne({ where: { id } });
    if (!article) throw new NotFoundException("文章不存在");
    article.views += 1;
    await this.repo.save(article);
    return article;
  }

  async create(data: any) {
    const article = this.repo.create({
      title: data.title,
      type: data.type || "notice",
      content: sanitizeHtml(data.content || ""),
      cover: data.cover || "",
      summary: data.summary || "",
      link: data.link || "",
      status: data.status ?? 1,
      sort: data.sort || 0,
    });
    return this.repo.save(article);
  }

  async update(id: number, data: any) {
    const article = await this.repo.findOne({ where: { id } });
    if (!article) throw new NotFoundException("文章不存在");
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const article = await this.repo.findOne({ where: { id } });
    if (!article) throw new NotFoundException("文章不存在");
    await this.repo.delete(id);
    return { message: "删除成功" };
  }
}
