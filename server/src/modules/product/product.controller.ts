import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { AdminAuthGuard } from "../../common/guards/admin-auth.guard";

@Controller("products")
export class ProductController {
  constructor(private service: ProductService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get("hot")
  findHot(@Query("limit") limit?: string) {
    return this.service.findHot(limit ? +limit : 6);
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
