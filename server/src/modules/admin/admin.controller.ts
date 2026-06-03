import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "../../common/guards/admin-auth.guard";
import { AdminService } from "./admin.service";

@Controller("admins")
@UseGuards(AdminAuthGuard)
export class AdminController {
  constructor(private service: AdminService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findById(+id);
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: any) {
    return this.service.update(+id, body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(+id);
  }
}
