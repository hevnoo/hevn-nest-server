import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { handlePrismaError } from '@/utils/prisma';

const model = 'users';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserList(params: any): Promise<any | null> {
    const { page = 1, pageSize = 10, name } = params;
    const where = { is_delete: 0 };
    if (name) {
      where['username'] = { contains: name };
    }
    // 计算分页参数
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    try {
      const [total = 0, data] = await Promise.all([
        this.prisma[model].count({ where }),
        this.prisma[model].findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: {
            createtime: 'desc',
          },
          include: {
            roles: true, // 显式包含角色信息，查出多对多关系
          },
        }),
      ]);
      return {
        code: 200,
        msg: 'Success',
        data,
        total,
      };
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  async updateUser(id, payload): Promise<any> {
    try {
      if (!id) {
        return { code: 404, msg: 'id不能为空' };
      }
      // const myUserInfo = await prisma.users.findUnique({
      //   where: {
      //     username_is_delete: {
      //       username: req.auth.username,
      //       is_delete: 0
      //     }
      //   }
      // })
      // if (myUserInfo?.role !== "admin") {
      //   return res.status(401).json({ msg: "暂无权限，请联系管理员" });
      // }
      const updateData = {
        ...payload,
        // password: await bcryptjs.hash(password, 10),
      };
      if (payload?.roles?.length && Array.isArray(payload.roles)) {
        updateData['roles'] = {
          set: payload.roles.map((id) => ({ id })),
        };
      }
      const data = await this.prisma[model].update({
        where: { id },
        data: updateData,
        include: {
          roles: true,
        },
      });
      return { code: 200, msg: '更新成功', data };
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  async delete(id): Promise<any> {
    try {
      if (!id) {
        return { code: 200, msg: '参数错误', data: null };
      }
      const data = await this.prisma[model].update({
        where: { id },
        data: { is_delete: 1 },
      });
      return { code: 200, msg: '删除成功', data };
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  async deleteMany(ids): Promise<any> {
    try {
      if (!Array.isArray(ids)) {
        return { code: 200, msg: '参数错误', data: null };
      }
      const data = await this.prisma[model].updateMany({
        where: {
          id: {
            in: ids,
          },
          is_delete: 0,
        },
        data: { is_delete: 1 },
      });
      return {
        code: 200,
        msg: '批量删除成功',
        data,
      };
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  async hardDelete(id): Promise<any> {
    try {
      if (!id) {
        return { code: 200, msg: '参数错误', data: null };
      }
      const data = await this.prisma[model].delete({
        where: { id },
      });
      return { code: 200, msg: '删除成功', data };
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  async hardDeleteMany(ids): Promise<any> {
    try {
      if (!Array.isArray(ids)) {
        return { code: 200, msg: '参数错误', data: null };
      }
      const data = await this.prisma[model].deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
      return { code: 200, msg: '批量删除成功', data };
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  // async getData(params: {
  //   skip?: number;
  //   take?: number;
  //   cursor?: Prisma.UserWhereUniqueInput;
  //   where?: Prisma.UserWhereInput;
  //   orderBy?: Prisma.UserOrderByWithRelationInput;
  // }): Promise<users[]> {
  //   const { skip, take, cursor, where, orderBy } = params;
  //   return this.prisma.user.findMany({
  //     skip,
  //     take,
  //     cursor,
  //     where,
  //     orderBy,
  //   });
  // }
}
