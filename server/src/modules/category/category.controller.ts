import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { AdminAuthGuard } from "../../common/guards/admin-auth.guard";

@Controller("categories")
export class CategoryController {
  constructor(private service: CategoryService) {}

  @Get()
  findAll(@Query("all") all?: string) {
    return this.service.findAll(all === "1");
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Put(":id")
  @UseGuards(AdminAuthGuard)
  update(@Param("id") id: string, @Body() body: any) {
    return this.service.update(+id, body);
  }

  @Delete(":id")
  @UseGuards(AdminAuthGuard)
  remove(@Param("id") id: string) {
    return this.service.remove(+id);
  }
}
