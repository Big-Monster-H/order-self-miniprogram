import { Controller, Get, Put, Body, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { AdminAuthGuard } from "../../common/guards/admin-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UserService } from "./user.service";

@Controller(["user", "users"])
export class UserController {
  constructor(private userService: UserService) {}

  // Admin: 用户列表
  @Get()
  @UseGuards(AdminAuthGuard)
  findAll(@Query() query: any) {
    return this.userService.findAll(query);
  }

  // 用户自己的 profile
  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async profile(@CurrentUser() user: any) {
    return this.userService.findById(user.id);
  }

  @Put("profile")
  @UseGuards(JwtAuthGuard)
  async updateProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.userService.updateProfile(user.id, body);
  }

  @Put("verify-identity")
  @UseGuards(JwtAuthGuard)
  async verifyIdentity(@CurrentUser() user: any, @Body() body: { real_name: string; id_card: string }) {
    return this.userService.verifyIdentity(user.id, body.real_name, body.id_card);
  }
}
