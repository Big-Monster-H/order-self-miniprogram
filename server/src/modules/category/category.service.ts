import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private repo: Repository<Category>,
  ) {}

  findAll(includeDisabled = false) {
    const where: any = includeDisabled ? {} : { status: 1 };
    return this.repo.find({ where, order: { sort: "ASC" } });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: { name: string; icon?: string; sort?: number; status?: number }) {
    const category = this.repo.create({
      name: data.name,
      icon: data.icon || "",
      sort: data.sort || 0,
      status: data.status ?? 1,
    });
    return this.repo.save(category);
  }

  async update(id: number, data: { name?: string; icon?: string; sort?: number; status?: number }) {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) throw new NotFoundException("分类不存在");
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) throw new NotFoundException("分类不存在");
    // 软删除
    await this.repo.update(id, { status: 0 });
    return { message: "删除成功" };
  }
}
