import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { Admin } from "./admin.entity";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private repo: Repository<Admin>,
  ) {}

  async findAll() {
    return this.repo.find({
      select: ["id", "username", "display_name", "role", "avatar", "status", "last_login_at", "last_login_ip", "created_at", "updated_at"],
      order: { created_at: "DESC" },
    });
  }

  async findById(id: number) {
    const admin = await this.repo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException("管理员不存在");
    const { password, ...rest } = admin;
    return rest;
  }

  async create(data: { username: string; password: string; display_name: string; role?: string }) {
    const exists = await this.repo.findOne({ where: { username: data.username } });
    if (exists) throw new ConflictException("用户名已存在");

    const admin = this.repo.create({
      username: data.username,
      password: bcrypt.hashSync(data.password, 10),
      display_name: data.display_name,
      role: (data.role || "admin") as any,
    });
    await this.repo.save(admin);
    const { password, ...rest } = admin;
    return rest;
  }

  async update(id: number, data: { username?: string; password?: string; display_name?: string; role?: string; status?: number }) {
    const admin = await this.repo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException("管理员不存在");

    if (data.username && data.username !== admin.username) {
      const exists = await this.repo.findOne({ where: { username: data.username } });
      if (exists) throw new ConflictException("用户名已存在");
    }

    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    } else {
      delete data.password;
    }

    await this.repo.update(id, data as any);
    return this.findById(id);
  }

  async remove(id: number) {
    const admin = await this.repo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException("管理员不存在");
    if (admin.role === "super") throw new ConflictException("不能删除超级管理员");
    await this.repo.delete(id);
    return { message: "删除成功" };
  }

  /** 初始化超级管理员 (首次运行) */
  async initSuperAdmin() {
    const exists = await this.repo.findOne({ where: { username: "admin" } });
    if (!exists) {
      const admin = this.repo.create({
        username: "admin",
        password: bcrypt.hashSync("admin123", 10),
        display_name: "超级管理员",
        role: "super" as any,
      });
      await this.repo.save(admin);
      console.log("✓ 超级管理员已创建: admin / admin123");
    }
  }
}
