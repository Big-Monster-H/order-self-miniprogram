import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AdminAuthGuard } from "../../common/guards/admin-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { OrderService } from "./order.service";

@Controller("orders")
export class OrderController {
  constructor(private service: OrderService) {}

  // Admin: 全部订单
  @Get()
  @UseGuards(AdminAuthGuard)
  adminFindAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  // 用户: 创建订单
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.service.create(user.id, body);
  }

  // 用户: 我的订单
  @Get("my")
  @UseGuards(JwtAuthGuard)
  myOrders(@CurrentUser() user: any, @Query() query: any) {
    return this.service.findByUser(user.id, query.status, query.page, query.pageSize);
  }

  // 员工: 我的接单
  @Get("employee")
  @UseGuards(JwtAuthGuard)
  employeeOrders(@CurrentUser() user: any, @Query() query: any) {
    return this.service.findEmployeeOrders(user.id, query.status, query.page, query.pageSize);
  }

  // 任务池
  @Get("pool")
  @UseGuards(JwtAuthGuard)
  taskPool(@Query() query: any) {
    return this.service.findTaskPool(query.category_id, query.page, query.pageSize);
  }

  // 管理员: 订单详情
  @Get("admin/:id")
  @UseGuards(AdminAuthGuard)
  adminDetail(@Param("id") id: string) {
    return this.service.findOne(+id);
  }

  // 用户/员工: 订单详情（验证所有权）
  @Get(":id")
  @UseGuards(JwtAuthGuard)
  detail(@Param("id") id: string, @CurrentUser() user: any) {
    return this.service.findUserOrder(+id, user.id);
  }

  @Post(":id/accept")
  @UseGuards(JwtAuthGuard)
  accept(@Param("id") id: string, @CurrentUser() user: any) {
    return this.service.acceptOrder(+id, user.id);
  }

  @Post(":id/complete")
  @UseGuards(JwtAuthGuard)
  complete(@Param("id") id: string, @CurrentUser() user: any) {
    return this.service.completeOrder(+id, user.id);
  }

  @Put(":id/status")
  @UseGuards(AdminAuthGuard)
  updateStatus(@Param("id") id: string, @Body() body: { status: string }) {
    return this.service.updateStatus(+id, body.status as any);
  }
}

