import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import {
  handlePrismaError,
  parseInclude,
  formatRelations,
} from '@/utils/prisma';
import { BaseResponse, QueryParams } from '@/common/general/general.interface';

const model = 'menu';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // 获取列表
  async getMenuList(params: QueryParams, user?: any): Promise<BaseResponse> {
    // 权限检查
    // const hasPermission = await this.checkUserPermission(model, 'read', user);
    // if (!hasPermission) {
    //   throw new UnauthorizedException('没有权限执行此操作');
    // }
    // 验证model是否合法
    // this.validateModel(model);
    try {
      const {
        page = 1,
        pageSize = 10,
        where = {},
        orderBy = { createtime: 'desc' },
        include,
        select,
        distinct,
        cursor,
        ...rest
      } = params;

      // 构建基础查询条件
      const baseWhere = { deletetime: BigInt(0), ...where };
      if (rest.name) {
        baseWhere['name'] = { contains: rest.name };
      }

      // 构建查询选项
      const options: any = {
        where: baseWhere,
        orderBy, // [{ createtime: 'desc' }, { order: 'asc' }]
        include: parseInclude(include),
      };

      // 添加可选查询参数
      if (select) options.select = select;
      if (distinct) options.distinct = distinct;
      if (cursor) options.cursor = cursor; // 游标分页

      // 处理分页
      if (!cursor) {
        options.skip = (Number(page) - 1) * Number(pageSize); // offset
        options.take = Number(pageSize); // limit
      }

      // 执行查询
      const [total, data] = await Promise.all([
        this.prisma[model].count({ where: baseWhere }),
        this.prisma[model].findMany(options),
      ]);

      return {
        code: 200,
        msg: '操作成功',
        data,
        total,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(total / Number(pageSize)),
      };
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  async create(payload: any, user?: any): Promise<any> {
    try {
      let createData = {
        ...payload,
      };
      if (payload?.roles?.length && Array.isArray(payload.roles)) {
        createData['roles'] = {
          connect: payload.roles.map((item) => ({ id: item })),
        };
      }
      const data = await this.prisma[model].create({
        data: createData,
        include: {
          roles: true, // 关联
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
      if (payload?.roles?.length && Array.isArray(payload.roles)) {
        updateData['roles'] = {
          set: payload.roles.map((item) => ({ id: item })),
        };
      }
      const data = await this.prisma[model].update({
        where: { id },
        data: updateData,
        include: {
          roles: true,
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
