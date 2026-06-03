import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AdminAuthGuard } from "../../common/guards/admin-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { EmployeeService } from "./employee.service";

@Controller("employee")
export class EmployeeController {
  constructor(private service: EmployeeService) {}

  // Admin: 全部员工
  @Get()
  @UseGuards(AdminAuthGuard)
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  // Admin: 审批员工
  @Put(":id/audit")
  @UseGuards(AdminAuthGuard)
  audit(@Param("id") id: string, @Body() body: { approved: boolean; remark?: string }) {
    return this.service.approveEmployee(+id, body.approved, body.remark);
  }

  // 用户: 我的员工资料
  @Get("profile")
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any) {
    return this.service.getOrCreateProfile(user.id);
  }

  @Post("auth")
  @UseGuards(JwtAuthGuard)
  submitAuth(@CurrentUser() user: any, @Body() body: any) {
    return this.service.submitAuth(user.id, body);
  }

  @Post("pay-deposit")
  @UseGuards(JwtAuthGuard)
  payDeposit(@CurrentUser() user: any) {
    return this.service.payDeposit(user.id);
  }

  @Get("stats")
  @UseGuards(JwtAuthGuard)
  getStats(@CurrentUser() user: any) {
    return this.service.getStats(user.id);
  }

  // 公开: 优秀员工
  @Get("top")
  getTop() {
    return this.service.getTopEmployees();
  }
}
