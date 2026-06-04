import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { Admin } from '../admin/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Admin)
    private adminRepo: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async wxLogin(code: string, nickname?: string, avatar?: string) {
    const wxConfig = {
      appId: process.env.WX_APPID || '',
      secret: process.env.WX_SECRET || '',
    };

    const { data } = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: { appid: wxConfig.appId, secret: wxConfig.secret, js_code: code, grant_type: 'authorization_code' },
    });

    if (data.errcode) throw new UnauthorizedException('微信登录失败: ' + data.errmsg);

    const { openid, unionid, session_key } = data;

    let user = await this.userRepo.findOne({ where: { openid } });
    if (!user) {
      user = this.userRepo.create({ openid, unionid: unionid || '', nickname: nickname || '微信用户', avatar: avatar || '' });
      await this.userRepo.save(user);
    } else {
      if (nickname) user.nickname = nickname;
      if (avatar) user.avatar = avatar;
      await this.userRepo.save(user);
    }

    const token = this.generateToken(user);
    return { token, user: this.sanitizeUser(user) };
  }

  async adminLogin(username: string, password: string) {
    const admin = await this.adminRepo.findOne({ where: { username, status: 1 } });
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    admin.last_login_at = new Date();
    await this.adminRepo.save(admin);

    const token = this.jwtService.sign({ sub: admin.id, username: admin.username, role: admin.role, admin: true }, { expiresIn: '7d' });
    return { token, admin: { id: admin.id, username: admin.username, display_name: admin.display_name, role: admin.role } };
  }

  /** 微信一键获取手机号（新版API） */
  async getPhoneNumber(code: string): Promise<{ phone: string }> {
    const wxConfig = {
      appId: process.env.WX_APPID || '',
      secret: process.env.WX_SECRET || '',
    };

    // 1. 获取 access_token
    const tokenRes = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
      params: { grant_type: 'client_credential', appid: wxConfig.appId, secret: wxConfig.secret },
    });
    if (tokenRes.data.errcode) {
      throw new UnauthorizedException('获取微信token失败: ' + tokenRes.data.errmsg);
    }
    const accessToken = tokenRes.data.access_token;

    // 2. 用 code 换取手机号
    const phoneRes = await axios.post(
      `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`,
      { code }
    );
    if (phoneRes.data.errcode !== 0) {
      throw new UnauthorizedException('获取手机号失败: ' + phoneRes.data.errmsg);
    }

    return { phone: phoneRes.data.phone_info.purePhoneNumber };
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({ sub: user.id, openid: user.openid, role: user.role }, { expiresIn: '30d' });
  }

  private sanitizeUser(user: User) {
    const { session_key, ...safe } = user;
    return safe;
  }
}