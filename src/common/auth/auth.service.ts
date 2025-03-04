import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/common/prisma/prisma.service';
import * as bcryptjs from 'bcryptjs';
import { handlePrismaError } from '@/utils/prisma';
import { UsernameField } from '@/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserByIdentifier(identifier: string): Promise<any> {
    const user = await this.prismaService.users.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
          { phone: identifier },
        ],
        is_delete: 0,
      },
    });

    if (user) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const { id, username, email } = user;
    try {
      const userInfo = await this.prismaService.users.findUnique({
        where: {
          id,
          is_delete: 0,
        },
        // where: {
        //   username_is_delete: {
        //     username,
        //     is_delete: 0,
        //   },
        // },
        select: {
          id: true,
          username: true,
          email: true,
          nickname: true,
          head_img: true,
          roles: {
            select: {
              id: true,
              name: true,
              value: true,
              description: true,
            },
          },
        },
      });
      if (!userInfo) {
        return { code: 404, msg: '该账号不存在' };
      }
      const token = this.jwtService.sign({
        [UsernameField]: user[UsernameField], // identifier
        sub: user.id,
      });
      return {
        code: 200,
        msg: '登录成功',
        token,
        userInfo,
      };
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  async register(payload: any): Promise<any> {
    const { username, password, email, phone, nickname } = payload;
    try {
      let where: any = {};
      if (username) {
        where['username_is_delete'] = {
          username,
          is_delete: 0,
        };
      } else if (email) {
        where['email_is_delete'] = {
          email,
          is_delete: 0,
        };
      } else if (phone) {
        where['phone_is_delete'] = {
          phone,
          is_delete: 0,
        };
      }
      if (!Object.keys(where).length) {
        return { code: 404, msg: '用户名、邮箱或手机号必须提供其中一个' };
      }
      const hasUser = await this.prismaService.users.findUnique({
        where,
      });
      if (hasUser) {
        return { code: 404, msg: '该账号已注册' };
      }

      if (!password) {
        return { code: 404, msg: '密码不能为空' };
      }
      const hashedPassword = await bcryptjs.hash(password, 10); // 加密

      let createData = {
        username,
        password: hashedPassword,
        email,
        nickname,
      };
      let rolesData = null;
      if (username === 'admin') {
        rolesData = await this.prismaService.roles.findMany({
          where: {
            OR: [{ value: 'admin' }, { value: 'editor' }],
            is_delete: 0,
          },
        });
      } else {
        rolesData = await this.prismaService.roles.findFirst({
          where: {
            value: 'user',
            is_delete: 0,
          },
        });
      }
      if (Array.isArray(rolesData)) {
        createData['roles'] = {
          connect: rolesData.map((item) => ({ id: item.id })),
        };
      } else if (rolesData) {
        createData['roles'] = {
          connect: [{ id: rolesData.id }], // 多对多roles，创建时关联角色
        };
      }
      const data = await this.prismaService.users.create({
        data: createData,
        include: {
          roles: true, // 多对多roles
        },
      });
      return { code: 200, msg: '注册成功', data };
    } catch (e) {
      return handlePrismaError(e);
    }
  }
}
