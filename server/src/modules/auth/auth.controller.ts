import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private accessToken: string = '';
  private accessTokenExpire: number = 0;
  constructor(private authService: AuthService) {}

  @Post('wx-login')
  async wxLogin(@Body() body: { code: string; nickname?: string; avatar?: string }) {
    return this.authService.wxLogin(body.code, body.nickname, body.avatar);
  }

  @Post('admin-login')
  async adminLogin(@Body() body: { username: string; password: string }) {
    return this.authService.adminLogin(body.username, body.password);
  }

  /** 微信一键获取手机号 */
  @Post('wx-phone')
  async wxGetPhone(@Body() body: { code: string }) {
    return this.authService.getPhoneNumber(body.code);
  }
}