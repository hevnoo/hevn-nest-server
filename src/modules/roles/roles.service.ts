import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { handlePrismaError } from '@/utils/prisma';

const model = 'roles';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async getData(params: any): Promise<any | null> {
    const { page = 1, pageSize = 10, name } = params;
    const where = { deletetime: BigInt(0) };
    if (name) {
      where['name'] = { contains: name };
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
            users: true, // 多对多
          },
        }),
      ]);
      return {
        code: 200,
        msg: '操作成功',
        data,
        total,
      };
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  async create(payload: any): Promise<any> {
    try {
      let createData = {
        ...payload,
      };
      if (payload?.users?.length && Array.isArray(payload.users)) {
        createData['users'] = {
          connect: payload.users.map((item) => ({ id: item })),
        };
      }
      const data = await this.prisma[model].create({
        data: createData,
        include: {
          users: true, // 关联
        },
      });
      return { code: 200, msg: '操作成功', data };
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  async update(id, payload): Promise<any> {
    if (!id) {
      return { code: 404, msg: 'id不能为空' };
    }
    try {
      const updateData = {
        ...payload,
      };
      if (payload?.users?.length && Array.isArray(payload.users)) {
        updateData['users'] = {
          set: payload.users.map((item) => ({ id: item })),
        };
      }
      const data = await this.prisma[model].update({
        where: { id },
        data: updateData,
        include: {
          users: true,
        },
      });
      return { code: 200, msg: '操作成功', data };
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  async delete(id): Promise<any> {
    try {
      if (Array.isArray(id)) {
        const ids = id;
        const data = await this.prisma[model].updateMany({
          where: {
            id: {
              in: ids,
            },
            deletetime: BigInt(0),
          },
          data: { deletetime: new Date().getTime() },
        });
        return {
          code: 200,
          msg: '批量删除成功',
          data,
        };
      }
      const data = await this.prisma[model].update({
        where: { id },
        data: { deletetime: new Date().getTime() },
      });
      return { code: 200, msg: '删除成功', data };
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  async realDelete(id): Promise<any> {
    try {
      const data = await this.prisma[model].delete({
        where: { id },
      });
      return { code: 200, msg: '删除成功', data };
    } catch (e) {
      return handlePrismaError(e);
    }
  }
}
