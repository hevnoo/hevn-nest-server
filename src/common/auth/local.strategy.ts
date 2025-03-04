import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import * as bcryptjs from 'bcryptjs';
import { UsernameField } from '@/config';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: UsernameField, // 鉴权的唯一标识，可以是邮箱、用户名、手机号
      passwordField: 'password',
    });
  }

  // 验证本地登录
  async validate(identifier: string, password: string): Promise<any> {
    const user = await this.authService.validateUserByIdentifier(identifier);
    if (!user) {
      throw new HttpException(
        {
          code: 404,
          msg: '用户不存在',
        },
        404,
      );
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        {
          code: 404,
          msg: '密码无效',
        },
        404,
      );
    }
    return user;
  }
}
