import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./product.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,
  ) {}

  async findAll(query: { category_id?: number; keyword?: string; page?: number; pageSize?: number; all?: string }) {
    const { category_id, keyword, page = 1, pageSize = 10, all } = query;
    const qb = this.repo.createQueryBuilder("p")
      .leftJoinAndSelect("p.category", "c");

    if (all !== "1") qb.where("p.status = 1");

    if (category_id) qb.andWhere("p.category_id = :cid", { cid: category_id });
    if (keyword) qb.andWhere("p.title LIKE :kw", { kw: `%${keyword}%` });

    qb.orderBy("p.sort", "ASC").addOrderBy("p.sold_count", "DESC");
    qb.skip((+page - 1) * +pageSize).take(+pageSize);

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async findOne(id: number) {
    const product = await this.repo.findOne({ where: { id }, relations: ["category"] });
    if (!product) throw new NotFoundException("商品不存在");
    return product;
  }

  async findHot(limit = 6) {
    return this.repo.find({
      where: { status: 1 },
      order: { sold_count: "DESC" },
      take: limit,
      relations: ["category"],
    });
  }

  async create(data: any) {
    const product = this.repo.create({
      category_id: data.category_id,
      title: data.title,
      description: data.description || "",
      cover: data.cover || "",
      images: data.images || [],
      price: data.price,
      original_price: data.original_price || 0,
      delivery_days: data.delivery_days || "",
      tags: data.tags || [],
      stock: data.stock ?? -1,
      status: data.status ?? 1,
      sort: data.sort || 0,
    });
    return this.repo.save(product);
  }

  async update(id: number, data: any) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException("商品不存在");
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.repo.findOne({ where: { id } });
    if (!product) throw new NotFoundException("商品不存在");
    await this.repo.update(id, { status: 0 });
    return { message: "下架成功" };
  }
}
