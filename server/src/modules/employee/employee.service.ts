import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EmployeeProfile, EmployeeStatus } from "./employee-profile.entity";
import { User, UserRole } from "../user/user.entity";

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeProfile) private repo: Repository<EmployeeProfile>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  /** Admin: 全部员工列表 */
  async findAll(query?: { status?: string; page?: number; pageSize?: number }) {
    const { status, page = 1, pageSize = 20 } = query || {};
    const where: any = {};
    if (status) where.status = status;

    const [list, total] = await this.repo.findAndCount({
      where,
      relations: ["user"],
      order: { created_at: "DESC" },
      skip: (+page - 1) * +pageSize,
      take: +pageSize,
    });
    return { list, total, page: +page, pageSize: +pageSize };
  }

  /** Admin: 审批员工认证 */
  async approveEmployee(id: number, approved: boolean, remark?: string) {
    const profile = await this.repo.findOne({ where: { id }, relations: ["user"] });
    if (!profile) throw new NotFoundException("员工资料不存在");

    if (approved) {
      profile.status = EmployeeStatus.APPROVED;
      await this.userRepo.update(profile.user_id, { role: UserRole.BOTH });
    } else {
      profile.status = EmployeeStatus.REJECTED;
    }
    profile.audit_remark = remark || "";
    await this.repo.save(profile);
    return this.repo.findOne({ where: { id }, relations: ["user"] });
  }

  async getOrCreateProfile(userId: number) {
    let profile = await this.repo.findOne({ where: { user_id: userId } });
    if (!profile) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException("用户不存在");
      if (!user.real_name || !user.id_card) throw new BadRequestException("请先完成实名认证");

      profile = this.repo.create({
        user_id: userId,
        deposit: 0,
        deposit_paid: 0,
        status: EmployeeStatus.PENDING,
      });
      await this.repo.save(profile);
    }
    const result = await this.repo.findOne({ where: { user_id: userId }, relations: ["user"] });
    if (!result) throw new NotFoundException("员工资料获取失败");
    return result;
  }

  async submitAuth(userId: number, data: { skills: string; skill_tags: string[]; cert_images: string }) {
    const profile = await this.getOrCreateProfile(userId);
    profile.skills = data.skills;
    profile.skill_tags = data.skill_tags;
    profile.cert_images = data.cert_images;
    profile.status = EmployeeStatus.PENDING;
    return this.repo.save(profile);
  }

  async payDeposit(userId: number) {
    const profile = await this.getOrCreateProfile(userId);
    if (profile.deposit_paid) throw new BadRequestException("保证金已缴纳");

    const depositAmount = 50000; // 50000分 = 500元
    profile.deposit = depositAmount;
    profile.deposit_paid = 1;
    if (profile.status === EmployeeStatus.PENDING) {
      profile.status = EmployeeStatus.APPROVED;
    }
    await this.repo.save(profile);

    await this.userRepo.update(userId, { role: UserRole.BOTH });
    return profile;
  }

  async getTopEmployees(limit = 10) {
    return this.repo.find({
      where: { status: EmployeeStatus.APPROVED },
      order: { rating: "DESC", completed_orders: "DESC" },
      take: limit,
      relations: ["user"],
    });
  }

  async getStats(userId: number) {
    const profile = await this.repo.findOne({ where: { user_id: userId } });
    if (!profile) throw new NotFoundException("请先完成员工认证");
    return {
      completed_orders: profile.completed_orders,
      total_income: profile.total_income,
      rating: profile.rating,
      active_orders: profile.active_orders,
      status: profile.status,
      deposit: profile.deposit,
      deposit_paid: profile.deposit_paid,
    };
  }
}
