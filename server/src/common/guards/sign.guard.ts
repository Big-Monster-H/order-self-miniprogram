import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

@Injectable()
export class SignGuard implements CanActivate {
  private readonly SECRET = process.env.SIGN_SECRET || 'default-sign-secret-change-in-production';
  private readonly WINDOW_MS = 5 * 60 * 1000; // 5分钟时间窗口

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { sign, timestamp, nonce } = request.headers;
    
    if (!sign || !timestamp || !nonce) {
      throw new UnauthorizedException('缺少签名参数');
    }

    // 防重放攻击：时间戳过期
    const now = Date.now();
    if (Math.abs(now - parseInt(timestamp)) > this.WINDOW_MS) {
      throw new UnauthorizedException('请求已过期');
    }

    // 构建签名字符串
    const params = JSON.stringify({
      method: request.method,
      path: request.path,
      timestamp,
      nonce,
      body: request.body,
    });

    // HMAC-SHA256 验签
    const expected = createHmac('sha256', this.SECRET)
      .update(params)
      .digest('hex');

    try {
      const bufExpected = Buffer.from(expected);
      const bufReceived = Buffer.from(sign as string);
      if (
        bufExpected.length !== bufReceived.length ||
        !timingSafeEqual(bufExpected, bufReceived)
      ) {
        throw new UnauthorizedException('签名验证失败');
      }
    } catch {
      throw new UnauthorizedException('签名验证失败');
    }

    return true;
  }
}
