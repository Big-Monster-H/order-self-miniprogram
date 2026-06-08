import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PageConfig } from "./page-config.entity";

const DEFAULT_CONFIGS = {
  home: {
    banner: { enabled: true, slides: [
      { image: "", title: "欢迎使用{CLIENT_NAME}", link: "" },
      { image: "", title: "海量任务等你来接", link: "" }
    ] },
    quickActions: [
      { icon: "ri-file-list-3-line", name: "全部服务", link: "/subpkg/category/index", color: "#1565C0", bg: "#E3F2FD" },
      { icon: "ri-fire-line", name: "热门推荐", link: "/subpkg/product/list?type=hot", color: "#E65100", bg: "#FFF3E0" },
      { icon: "ri-user-star-line", name: "优秀接单者", link: "/subpkg/employee/task-pool", color: "#2E7D32", bg: "#E8F5E9" },
      { icon: "ri-vip-crown-line", name: "会员中心", link: "/pages/my/index", color: "#6A1B9A", bg: "#F3E5F5" }
    ],
    notice: { enabled: true, text: "平台担保交易，资金安全有保障！认证接单者保证金制度已上线", link: "" },
    sections: [
      { type: "categories", title: "服务分类", enabled: true, showCount: 8 },
      { type: "products", title: "热门服务", enabled: true, tag: "hot", showCount: 4 },
      { type: "employees", title: "推荐接单者", enabled: true, showCount: 4 }
    ]
  },
  category: {
    categories: []
  },
  my: {
    menuItems: [
      { icon: "ri-user-star-line", name: "接单中心", link: "/subpkg/my/employee-center", auth: "employee" },
      { icon: "ri-bill-line", name: "退款记录", link: "/subpkg/my/refund-list" },
      { icon: "ri-settings-3-line", name: "设置", link: "/subpkg/my/settings" },
      { icon: "ri-information-line", name: "关于我们", link: "/subpkg/my/about" }
    ]
  }
};

@Injectable()
export class PageConfigService {
  constructor(@InjectRepository(PageConfig) private repo: Repository<PageConfig>) {}

  async getConfig(pageKey: string) {
    let config = await this.repo.findOne({ where: { page_key: pageKey } });
    if (!config) {
      // Init with defaults
      const defaults = DEFAULT_CONFIGS[pageKey] || {};
      config = this.repo.create({
        page_key: pageKey,
        config_json: JSON.stringify(defaults),
        status: "published",
      });
      await this.repo.save(config);
    }
    return JSON.parse(config.config_json);
  }

  async updateConfig(pageKey: string, config: any) {
    let entity = await this.repo.findOne({ where: { page_key: pageKey } });
    if (!entity) {
      entity = this.repo.create({ page_key: pageKey, config_json: "{}", status: "published" });
    }
    entity.config_json = JSON.stringify(config);
    await this.repo.save(entity);
    return { success: true };
  }

  async publishConfig(pageKey: string) {
    await this.repo.update({ page_key: pageKey }, { status: "published" });
    return { success: true };
  }

  async getAllKeys() {
    const configs = await this.repo.find({ select: ["page_key", "status", "updated_at"] });
    return configs;
  }
}
