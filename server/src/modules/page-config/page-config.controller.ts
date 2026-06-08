import { Controller, Get, Put, Param, Body, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "../../common/guards/admin-auth.guard";
import { PageConfigService } from "./page-config.service";

@Controller("page-config")
export class PageConfigController {
  constructor(private service: PageConfigService) {}

  @Get(":pageKey")
  getConfig(@Param("pageKey") pageKey: string) {
    return this.service.getConfig(pageKey);
  }

  @Put(":pageKey")
  @UseGuards(AdminAuthGuard)
  updateConfig(@Param("pageKey") pageKey: string, @Body() body: any) {
    return this.service.updateConfig(pageKey, body.config || body);
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  getAllKeys() {
    return this.service.getAllKeys();
  }
}
