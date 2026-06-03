import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { ChatModule } from './modules/chat/chat.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { PaymentModule } from './modules/payment/payment.module';
import { RefundModule } from './modules/refund/refund.module';
import { UploadModule } from './modules/upload/upload.module';
import { AdminModule } from './modules/admin/admin.module';
import { PageConfigModule } from './modules/page-config/page-config.module';
import { CmsModule } from './modules/cms/cms.module';

@Module({
  imports: [
    // TypeORM 数据库连接
    TypeOrmModule.forRootAsync(databaseConfig),
    // 配置模块
    ConfigModule,
    // 业务模块
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    ChatModule,
    EmployeeModule,
    PaymentModule,
    RefundModule,
    UploadModule,
    AdminModule,
    CmsModule,
    PageConfigModule,
  ],
})
export class AppModule {}