import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { AdminService } from './modules/admin/admin.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  const bodyParser = require('body-parser');
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use('/api/payment/wxpay/notify', bodyParser.text({ type: 'text/xml' }));

  try {
    const adminService = app.get(AdminService);
    await adminService.initSuperAdmin();
  } catch (e) {
    console.log('数据库未连接，跳过管理员初始化');
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log('========================================');
  console.log('  自主接单平台后端服务');
  console.log('  http://localhost:' + port);
  console.log('  API: http://localhost:' + port + '/api');
  console.log('========================================');
}
bootstrap();