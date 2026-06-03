import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Category } from './modules/category/category.entity';
import { Product } from './modules/product/product.entity';
import { CmsArticle } from './modules/cms/cms-article.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const ds = app.get(DataSource);

  console.log('🌱 开始播种测试数据...');

  // 分类
  const cats = await ds.getRepository(Category).save([
    { name: '设计', icon: '', sort: 1, status: 1 },
    { name: '开发', icon: '', sort: 2, status: 1 },
    { name: '翻译', icon: '', sort: 3, status: 1 },
    { name: '剪辑', icon: '', sort: 4, status: 1 },
    { name: '营销', icon: '', sort: 5, status: 1 },
    { name: '写作', icon: '', sort: 6, status: 1 },
    { name: '配音', icon: '', sort: 7, status: 1 },
    { name: '咨询', icon: '', sort: 8, status: 1 },
  ]);
  console.log(cats.length + ' 个分类');

  // 商品 (价格单位：分)
  const products = await ds.getRepository(Product).save([
    { category_id: cats[0].id, title: 'Logo设计 — 高端品牌VI', description: '专业Logo设计+品牌VI手册', cover: '', price: 29900, original_price: 49900, sold_count: 1286, delivery_days: '3-5天', tags: ['热销'], status: 1, sort: 1 },
    { category_id: cats[0].id, title: '海报设计 — 商业宣传', description: '商业海报/电商banner设计', cover: '', price: 19900, sold_count: 892, delivery_days: '1-2天', tags: [], status: 1, sort: 2 },
    { category_id: cats[1].id, title: '小程序开发 — 电商/预约', description: '微信小程序定制开发', cover: '', price: 299900, sold_count: 356, delivery_days: '15-30天', tags: ['热销'], status: 1, sort: 3 },
    { category_id: cats[1].id, title: '企业官网开发', description: '响应式企业官网 Vue3+Node', cover: '', price: 350000, sold_count: 218, delivery_days: '10-20天', tags: [], status: 1, sort: 4 },
    { category_id: cats[2].id, title: '英中翻译 — 技术文档', description: '专业IT文档翻译', cover: '', price: 12000, sold_count: 567, delivery_days: '3-5天', tags: [], status: 1, sort: 5 },
    { category_id: cats[3].id, title: '短视频剪辑 — 15-60秒', description: '抖音/快手剪辑+字幕+特效', cover: '', price: 8000, sold_count: 2130, delivery_days: '1天', tags: ['热销'], status: 1, sort: 6 },
    { category_id: cats[4].id, title: '小红书推广方案', description: 'KOL营销+内容策划', cover: '', price: 50000, sold_count: 432, delivery_days: '7天', tags: [], status: 1, sort: 7 },
    { category_id: cats[5].id, title: '商业计划书撰写', description: '专业BP撰写', cover: '', price: 150000, sold_count: 89, delivery_days: '7-14天', tags: [], status: 1, sort: 8 },
  ]);
  console.log(products.length + ' 个商品');

  // CMS公告
  await ds.getRepository(CmsArticle).save([
    { title: '平台全新升级！接单者需完成实名认证方可接单', type: 'notice', content: '<p>为保证服务质量，平台要求所有接单者完成实名认证并缴纳保证金后方可接单。</p>', status: 1, sort: 1 },
    { title: '新用户首单立减10元，快来体验！', type: 'notice', content: '<p>新用户注册后首次下单可享受10元优惠。</p>', status: 1, sort: 2 },
  ]);
  console.log('CMS公告已创建');

  console.log('🎉 种子数据播种完成！');
  await app.close();
}

seed().catch(e => {
  console.error('播种失败:', e.message);
  process.exit(1);
});