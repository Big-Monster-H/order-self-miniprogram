import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findAll(query?: { page?: number; pageSize?: number; keyword?: string }) {
    const { page = 1, pageSize = 20, keyword } = query || {};
    const qb = this.userRepo.createQueryBuilder("u")
      .select(["u.id", "u.nickname", "u.avatar", "u.role", "u.status", "u.created_at", "u.updated_at"]);

    if (keyword) {
      qb.where("u.nickname LIKE :kw OR u.phone LIKE :kw OR u.real_name LIKE :kw", { kw: `%${keyword}%` });
    }

    qb.orderBy("u.created_at", "DESC")
      .skip((+page - 1) * +pageSize)
      .take(+pageSize);

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page: +page, pageSize: +pageSize };
  }

  async findById(id: number): Promise<Partial<User>> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException("用户不存在");
    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: User) {
    const { session_key, id_card, ...rest } = user as any;
    if (rest.phone) rest.phone = rest.phone.slice(0, 3) + '****' + rest.phone.slice(-4);
    if (rest.real_name) rest.real_name = rest.real_name.slice(0, 1) + '**';
    return rest;
  }

  async updateProfile(id: number, data: { nickname?: string; avatar?: string; phone?: string }) {
    await this.userRepo.update(id, data);
    return this.findById(id);
  }

  async verifyIdentity(id: number, real_name: string, id_card: string) {
    await this.userRepo.update(id, { real_name, id_card });
    return this.findById(id);
  }
}
