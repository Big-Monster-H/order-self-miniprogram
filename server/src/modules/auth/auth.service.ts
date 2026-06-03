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
      user = this.userRepo.create({ openid, unionid: unionid || '', nickname: nickname || '微信用户', avatar: avatar || '', session_key });
      await this.userRepo.save(user);
    } else {
      user.session_key = session_key;
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

    const token = this.jwtService.sign({ sub: admin.id, username: admin.username, role: admin.role, admin: true });
    return { token, admin: { id: admin.id, username: admin.username, display_name: admin.display_name, role: admin.role } };
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({ sub: user.id, openid: user.openid, role: user.role });
  }

  private sanitizeUser(user: User) {
    const { session_key, ...safe } = user;
    return safe;
  }
}