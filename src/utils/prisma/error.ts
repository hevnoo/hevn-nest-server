// src/utils/prisma-error-handler.ts
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaError(error: any): any {
  let payload = { code: 500, msg: '服务器错误', data: null };
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      // 400 Bad Request - 客户端错误
      case 'P2000': // 输入值超过最大长度
        payload = { code: 400, msg: '输入数据过长', data: null };
        break;
      case 'P2005': // 字段值类型错误
      case 'P2006': // 字段值无效
        payload = { code: 400, msg: '字段值无效', data: null };
        break;
      case 'P2007': // 数据验证失败
        payload = { code: 400, msg: '数据验证错误', data: null };
        break;
      case 'P2011': // 空值约束违反
        payload = { code: 400, msg: '必填字段不能为空', data: null };
        break;
      case 'P2012': // 缺少必填字段
        payload = { code: 400, msg: '缺少必填字段', data: null };
        break;
      case 'P2013': // 缺少必需参数
        payload = { code: 400, msg: '缺少必需参数', data: null };
        break;
      case 'P2014': // 关系违反
        payload = { code: 400, msg: '关系约束违反', data: null };
        break;
      case 'P2019': // 输入错误
        payload = { code: 400, msg: '输入数据错误', data: null };
        break;
      case 'P2020': // 值超出范围
        payload = { code: 400, msg: '值超出允许范围', data: null };
        break;

      // 404 Not Found - 资源不存在
      case 'P2001': // 记录不存在
      case 'P2015': // 关系记录不存在
      case 'P2025': // 记录不存在
        payload = { code: 404, msg: '记录不存在', data: null };
        break;

      // 409 Conflict - 资源冲突
      case 'P2002': // 唯一约束违反
        payload = { code: 409, msg: '记录已存在', data: null };
        break;
      case 'P2034': // 事务冲突
        payload = { code: 409, msg: '事务冲突，请重试', data: null };
        break;

      // 500 Internal Server Error - 服务器错误
      case 'P2003': // 外键约束失败
      case 'P2004': // 数据库约束失败
        payload = { code: 500, msg: '数据库约束错误', data: null };
        break;
      case 'P2008': // 查询解析失败
      case 'P2009': // 查询验证失败
      case 'P2010': // 查询执行失败
        payload = { code: 500, msg: '查询执行错误', data: null };
        break;
      case 'P2021': // 表不存在
      case 'P2022': // 列不存在
        payload = { code: 500, msg: '数据库结构错误', data: null };
        break;
      case 'P2023': // 数据不一致
        payload = { code: 500, msg: '数据不一致错误', data: null };
        break;
      case 'P2024': // 连接超时
        payload = { code: 500, msg: '数据库连接超时', data: null };
        break;
      case 'P2026': // 不支持的特性
        payload = { code: 500, msg: '不支持的数据库操作', data: null };
        break;
      case 'P2027': // 多个错误
        payload = { code: 500, msg: '发生多个错误', data: null };
        break;
      case 'P2028': // 事务API错误
        payload = { code: 500, msg: '事务执行错误', data: null };
        break;
      case 'P2030': // 分页错误
        payload = { code: 500, msg: '分页参数错误', data: null };
        break;
      case 'P2033': // 数值溢出
        payload = { code: 500, msg: '数值计算溢出', data: null };
        break;
      default:
        payload = {
          code: 500,
          msg: error.message || '未知错误',
          data: {
            code: error.code,
            meta: error.meta,
            message: error.message,
            target: error?.meta?.target || null,
          },
        };
    }
  } else {
    payload = {
      code: 500,
      msg: '服务器错误',
      data: {
        code: error.code,
        meta: error.meta,
        message: error.message,
        target: error?.meta?.target || null,
      },
    };
  }

  const payloadList = [403, 409];
  if (!payloadList.includes(payload.code)) {
    throw new HttpException(payload, payload.code);
  } else {
    return payload;
  }
  // if (payload.code >= 500) {
  //   throw new HttpException(payload, payload.code);
  // } else {
  //   return payload;
  // }

  // throw new UnauthorizedException({
  //   code: 401,
  //   msg: 'Unauthorized',
  // });
  // UnauthorizedException 固定返回 401
  // ForbiddenException 固定返回 403
  // NotFoundException 固定返回 404
  // ConflictException 固定返回 409
  // BadRequestException 固定返回 400
}
