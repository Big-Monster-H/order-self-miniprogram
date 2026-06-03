import { Controller, Post, Body, UseGuards, Req, RawBodyRequest } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private service: PaymentService) {}

  @Post('wxpay')
  @UseGuards(JwtAuthGuard)
  wxPay(@CurrentUser() user: any, @Body() body: { order_id: number }) {
    return this.service.wxPayOrder(user.id, body.order_id, user.openid);
  }

  @Post('wxpay/notify')
  async wxPayNotify(@Req() req: RawBodyRequest<Request>) {
    const xml = req.body?.toString() || '';
    return this.service.wxPayCallback(xml);
  }
}