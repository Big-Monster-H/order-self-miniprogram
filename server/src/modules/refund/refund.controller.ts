import { Controller, Get, Post, Put, Body, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AdminAuthGuard } from "../../common/guards/admin-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RefundService } from "./refund.service";

@Controller("refunds")
export class RefundController {
  constructor(private service: RefundService) {}

  // 用户端：申请退款
  @Post()
  @UseGuards(JwtAuthGuard)
  apply(@CurrentUser() user: any, @Body() body: { order_id: number; reason: string; images?: string[] }) {
    return this.service.apply(user.id, body.order_id, body.reason, body.images);
  }

  // 用户端：我的退款
  @Get("my")
  @UseGuards(JwtAuthGuard)
  myRefunds(@CurrentUser() user: any) {
    return this.service.findByUser(user.id);
  }

  // Admin：全部退款列表
  @Get()
  @UseGuards(AdminAuthGuard)
  findAll() {
    return this.service.findAll();
  }

  // 详情
  @Get(":id")
  @UseGuards(AdminAuthGuard)
  detail(@Param("id") id: string) {
    return this.service.findOne(+id);
  }

  // Admin：审批通过
  @Put(":id/approve")
  @UseGuards(AdminAuthGuard)
  approve(@Param("id") id: string, @CurrentUser() admin: any, @Body() body?: { remark?: string }) {
    return this.service.approve(+id, admin.id, body?.remark);
  }

  // Admin：审批拒绝
  @Put(":id/reject")
  @UseGuards(AdminAuthGuard)
  reject(@Param("id") id: string, @CurrentUser() admin: any, @Body() body: { remark: string }) {
    return this.service.reject(+id, admin.id, body.remark);
  }
}

