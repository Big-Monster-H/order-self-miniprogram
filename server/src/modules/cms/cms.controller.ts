import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { CmsService } from "./cms.service";
import { AdminAuthGuard } from "../../common/guards/admin-auth.guard";

@Controller("cms")
export class CmsController {
  constructor(private service: CmsService) {}

  // Admin: 获取全部文章列表（含禁用）
  @Get("articles")
  findByType(@Query("type") type: string) {
    return this.service.findByType(type || "notice");
  }

  // Admin: 分页列表
  @Get("articles/all")
  @UseGuards(AdminAuthGuard)
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get("articles/:id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(+id);
  }

  @Post("articles")
  @UseGuards(AdminAuthGuard)
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Put("articles/:id")
  @UseGuards(AdminAuthGuard)
  update(@Param("id") id: string, @Body() body: any) {
    return this.service.update(+id, body);
  }

  @Delete("articles/:id")
  @UseGuards(AdminAuthGuard)
  remove(@Param("id") id: string) {
    return this.service.remove(+id);
  }
}
