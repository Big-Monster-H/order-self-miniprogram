import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: 'APP_CONFIG',
      useFactory: () => ({
        jwt: {
          secret: process.env.JWT_SECRET || 'dev-secret-key',
          expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        },
        wx: {
          appId: process.env.WX_APPID || '',
          secret: process.env.WX_SECRET || '',
          mchId: process.env.WX_MCHID || '',
          payKey: process.env.WX_PAY_KEY || '',
          certPath: process.env.WX_PAY_CERT_PATH || '',
          keyPath: process.env.WX_PAY_KEY_PATH || '',
          notifyUrl: process.env.WX_NOTIFY_URL || '',
        },
        wxTemplate: {
          orderNew: process.env.WX_TEMPLATE_ORDER_NEW || '',
          orderAccept: process.env.WX_TEMPLATE_ORDER_ACCEPT || '',
          orderComplete: process.env.WX_TEMPLATE_ORDER_COMPLETE || '',
          refund: process.env.WX_TEMPLATE_REFUND || '',
        },
        commission: {
          rate: Number(process.env.PLATFORM_COMMISSION_RATE) || 8,
        },
        deposit: {
          amount: Number(process.env.DEPOSIT_AMOUNT) || 50000, // 分
        },
        upload: {
          dir: process.env.UPLOAD_DIR || './uploads',
        },
      }),
    },
  ],
  exports: ['APP_CONFIG'],
})
export class ConfigModule {}