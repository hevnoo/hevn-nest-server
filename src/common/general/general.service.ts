import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import {
  handlePrismaError,
  parseInclude,
  formatRelations,
} from '@/utils/prisma';
import {
  BaseResponse,
  QueryParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
  HardDeleteParams,
} from './general.interface';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class GeneralService {
  constructor(protected prisma: PrismaService) {}

  // 添加权限检查方法，非管理员账户不能修改数据
  private async checkUserPermission(
    model: string,
    action: 'read' | 'write',
    user: any,
  ): Promise<boolean> {
    // 如果不是 users 表，则不需要权限检查
    if (model !== 'users') {
      return true;
    }
    // 如果用户未登录，拒绝访问
    if (!user) {
      throw new UnauthorizedException('请先登录');
    }

    // 检查用户是否有管理员角色
    const userWithRoles = await this.prisma.users.findUnique({
      where: { id: user.id },
      include: { roles: true },
    });

    const isAdmin = userWithRoles?.roles?.some((role) =>
      ['super_admin', 'admin'].includes(role.value),
    );

    // 如果是读操作，所有用户都可以访问
    if (action === 'read') {
      return true;
    }

    // 如果是写操作，只有管理员可以访问
    return isAdmin;
  }

  // 获取列表
  async getList(
    model: string,
    params: QueryParams,
    user?: any,
  ): Promise<BaseResponse> {
    // 权限检查
    const hasPermission = await this.checkUserPermission(model, 'read', user);
    if (!hasPermission) {
      throw new UnauthorizedException('没有权限执行此操作');
    }
    // 验证model是否合法
    // this.validateModel(model);
    try {
      const {
        page,
        pageSize,
        where = {},
        orderBy = { createtime: 'desc' },
        include,
        select,
        distinct,
        cursor,
        ...rest
      } = params;

      // 构建基础查询条件
      // 构建基础查询条件，并处理类型转换
      const baseWhere = {
        deletetime: BigInt(0),
        ...Object.entries(where).reduce((acc, [key, value]) => {
          // 处理布尔值
          if (typeof value === 'string' && ['true', 'false'].includes(value)) {
            acc[key] = value === 'true';
          }
          // 处理数字
          else if (typeof value === 'string' && !isNaN(Number(value))) {
            acc[key] = Number(value);
          }
          // 其他类型保持不变
          else {
            acc[key] = value;
          }
          return acc;
        }, {}),
      };
      // if (rest.name) {
      //   baseWhere['name'] = { contains: rest.name };
      // }
      // if (model === 'menu') {
      //   const userInfo = await this.prisma.users.findUnique({
      //     where: { id: user.id },
      //     include: { roles: true },
      //   });
      //   const userRoles = userInfo?.roles?.map((role) => role.value);
      //   // 返回用户拥有的菜单
      //   baseWhere['roles'] = { some: { value: { in: userRoles } } };
      // }

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
      if (!cursor && page && pageSize) {
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

  // 创建
  async create(
    model: string,
    payload: CreateParams,
    user?: any,
  ): Promise<BaseResponse> {
    // 权限检查
    const hasPermission = await this.checkUserPermission(model, 'write', user);
    if (!hasPermission) {
      throw new UnauthorizedException('没有权限执行此操作');
    }
    try {
      let data;

      // 处理单个对象创建
      if (!Array.isArray(payload)) {
        const { include, ...rest } = payload;

        // 支持创建用户时的密码加密
        if (model === 'users' && rest?.password) {
          rest.password = await bcryptjs.hash(rest.password, 10); // 加密
        }

        data = await this.prisma[model].create({
          data: formatRelations(rest, true),
          include: parseInclude(include),
        });

        return { code: 200, msg: '创建成功', data };
      } else {
        // 处理批量创建
        if (!payload.length) {
          return { code: 400, msg: '创建数据不能为空', data: null };
        }

        // 使用事务处理批量创建
        data = await this.prisma.$transaction(
          payload.map((item) => {
            const { include, ...rest } = item;
            return this.prisma[model].create({
              data: formatRelations(rest, true),
              include: parseInclude(include),
            });
          }),
        );

        return {
          code: 200,
          msg: '批量创建成功',
          data,
          total: data.length,
        };
      }
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  // 更新
  async update(
    model: string,
    payload: UpdateParams,
    user?: any,
    paramId: string | number = '',
  ): Promise<BaseResponse> {
    // 权限检查
    const hasPermission = await this.checkUserPermission(model, 'write', user);
    if (!hasPermission) {
      throw new UnauthorizedException('没有权限执行此操作');
    }
    try {
      let data;

      // 处理单个对象更新
      if (!Array.isArray(payload)) {
        if (!payload.id && !paramId) {
          return { code: 400, msg: 'id不能为空', data: null };
        }
        const { id, include, ...rest } = payload;

        // 支持创建用户时的密码加密
        if (model === 'users' && rest?.password) {
          rest.password = await bcryptjs.hash(rest.password, 10); // 加密
        }

        data = await this.prisma[model].update({
          where: { id: paramId || id },
          data: formatRelations(rest, false),
          include: parseInclude(include),
        });

        return { code: 200, msg: '更新成功', data };
      } else {
        // 处理批量更新
        // 验证每个对象都有id
        if (payload.some((item) => !item.id)) {
          return {
            code: 400,
            msg: '批量更新时每条数据都必须包含id',
            data: null,
          };
        }

        // 使用事务处理批量更新
        data = await this.prisma.$transaction(
          payload.map((item) => {
            const { id, include, ...rest } = item;
            return this.prisma[model].update({
              where: { id },
              data: formatRelations(rest, false),
              include: parseInclude(include),
            });
          }),
        );

        return {
          code: 200,
          msg: '批量更新成功',
          data,
          total: data.length,
        };
      }
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  // 删除(软删除)
  async delete(
    model: string,
    body: DeleteParams,
    user?: any,
  ): Promise<BaseResponse> {
    // 权限检查
    const hasPermission = await this.checkUserPermission(model, 'write', user);
    if (!hasPermission) {
      throw new UnauthorizedException('没有权限执行此操作');
    }
    try {
      let data;
      let result = { code: 400, msg: '参数错误', data: null };

      // 单个删除处理
      if (
        typeof body === 'string' ||
        typeof body === 'number' ||
        (typeof body === 'object' && 'id' in body)
      ) {
        const id = typeof body === 'object' ? body.id : body;

        // 使用事务确保原子性
        data = await this.prisma.$transaction(async (tx) => {
          // 查询并锁定记录
          const record = await tx[model].findFirst({
            where: {
              id,
              deletetime: BigInt(0),
            },
            select: { id: true },
          });

          if (!record) {
            throw new Error('记录不存在或已删除');
          }
          // 执行软删除
          return await tx[model].update({
            where: { id },
            data: {
              deletetime: new Date().getTime(),
            },
          });
        });

        result = { code: 200, msg: '删除成功', data };
      }
      // 批量删除处理
      else if (
        Array.isArray(body) ||
        (typeof body === 'object' && 'ids' in body)
      ) {
        const ids = Array.isArray(body)
          ? typeof body[0] === 'object'
            ? body.map((item) => item.id)
            : body
          : body.ids;

        // 使用事务处理批量删除
        data = await this.prisma.$transaction(async (tx) => {
          // 查询并锁定所有记录
          const records = await tx[model].findMany({
            where: {
              id: { in: ids },
              deletetime: BigInt(0),
            },
            select: { id: true },
          });

          if (!records.length) {
            throw new Error('没有找到可删除的记录');
          }

          // 执行批量软删除
          return await tx[model].updateMany({
            where: {
              id: { in: records.map((r) => r.id) },
              deletetime: BigInt(0),
            },
            data: {
              deletetime: new Date().getTime(),
            },
          });
        });

        result = { code: 200, msg: '批量删除成功', data };
      }

      return result;
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  // 删除(硬删除)
  async hardDelete(
    model: string,
    body: HardDeleteParams,
    user?: any,
  ): Promise<BaseResponse> {
    // 权限检查
    const hasPermission = await this.checkUserPermission(model, 'write', user);
    if (!hasPermission) {
      throw new UnauthorizedException('没有权限执行此操作');
    }
    try {
      let data;
      let result = { code: 400, msg: '参数错误', data: null };

      if (typeof body === 'string' || typeof body === 'number') {
        data = await this.prisma[model].delete({
          where: { id: body },
        });
        result = { code: 200, msg: '删除成功', data };
      } else if (Array.isArray(body)) {
        if (body.length === 0) return result;

        // 处理数组对象格式 [{ id: 1 }, { id: 2 }]
        if (typeof body[0] === 'object' && 'id' in body[0]) {
          const ids = body.map((item) => item.id);
          data = await this.prisma[model].deleteMany({
            where: { id: { in: ids } },
          });
          result = { code: 200, msg: '批量删除成功', data };
        } else {
          // 处理ID数组的情况
          data = await this.prisma[model].deleteMany({
            where: { id: { in: body } },
          });
          result = { code: 200, msg: '批量删除成功', data };
        }
      } else if (
        typeof body === 'object' &&
        'id' in body &&
        (typeof body.id === 'string' || typeof body.id === 'number')
      ) {
        data = await this.prisma[model].delete({
          where: { id: body.id },
          include: parseInclude(body?.include),
        });
        result = { code: 200, msg: '删除成功', data };
      } else if (
        typeof body === 'object' &&
        'ids' in body &&
        Array.isArray(body.ids)
      ) {
        data = await this.prisma[model].deleteMany({
          where: { id: { in: body.ids } },
        });
        result = { code: 200, msg: '批量删除成功', data };
      }

      return result;
    } catch (e) {
      return handlePrismaError(e);
    }
  }

  // 字支持符串条件查询
  async getDataByQuery(
    model: string,
    params: QueryParams,
  ): Promise<BaseResponse> {
    try {
      const { page = 1, pageSize = 10, include, ...restParams } = params;

      // 构建查询条件
      const whereConditions: any = {
        deletetime: BigInt(0),
      };

      // 处理查询参数
      Object.keys(restParams).forEach((key) => {
        if (key.includes('__')) {
          const [field, operator] = key.split('__');
          const value = restParams[key];

          switch (operator) {
            case 'in':
              whereConditions[field] = {
                in: Array.isArray(value) ? value : value.split(','),
              };
              break;
            case 'like':
            case 'contains':
              whereConditions[field] = { contains: value };
              break;
            case 'gt':
              whereConditions[field] = { gt: Number(value) };
              break;
            case 'gte':
              whereConditions[field] = { gte: Number(value) };
              break;
            case 'lt':
              whereConditions[field] = { lt: Number(value) };
              break;
            case 'lte':
              whereConditions[field] = { lte: Number(value) };
              break;
            case 'between':
              const [start, end] = value.split(',');
              whereConditions[field] = {
                gte: Number(start),
                lte: Number(end),
              };
              break;
            case 'isnull':
              whereConditions[field] =
                value === 'true'
                  ? null
                  : {
                      not: null,
                    };
              break;
            case 'orderby':
              options.orderBy = { [field]: value };
              break;
          }
        } else {
          // 没有操作符的情况下默认精确匹配
          whereConditions[key] = restParams[key];
        }
      });

      const options: any = {
        where: whereConditions,
        orderBy: { createtime: 'desc' },
        include: parseInclude(include),
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
      };

      // 执行查询
      const [total, data] = await Promise.all([
        this.prisma[model].count({ where: whereConditions }),
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

  // 自定义扩展方法的钩子
  protected async beforeCreate(data: any): Promise<any> {
    return data;
  }

  protected async afterCreate(data: any): Promise<any> {
    return data;
  }

  // 验证model是否合法
  private validateModel(model: string) {
    const validModels = ['users', 'roles', 'menu', 'dict']; // 可用的model列表
    if (!validModels.includes(model)) {
      throw new Error(`Invalid model: ${model}`);
    }
  }
}
