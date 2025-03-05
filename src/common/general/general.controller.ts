import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { GeneralService } from './general.service';
import { Model } from '../decorators/model.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { SensitiveModelGuard } from '../guard/sensitive-model.guard';

import {
  BaseResponse,
  QueryParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
  HardDeleteParams,
} from './general.interface';

// @Controller('api/:model') // api/general
@Controller('api')
// @UseGuards(SensitiveModelGuard) // 添加黑名单限制的路由守卫
export class GeneralController {
  constructor(private readonly service: GeneralService) {}

  // 获取数据
  // 参数：model: 模型名称，params: 查询参数（prisma语法）
  // 注意：如果需要获取外表关联数据，则需要使用include参数，如：{ include: ["menu"] }
  // @Public()
  @Get(':model/getList')
  async getList(
    @Model() model: string,
    @Query() body: QueryParams,
    @Request() req,
  ): Promise<BaseResponse> {
    return await this.service.getList(model, body, req.user);
  }

  // 创建数据
  // body参数支持对象或数组对象：
  // 对象：{ id: 1, name: "test", menu: [1, 2], include: ["menu"] }
  // 数组：[{ id: 1, name: "test", menu: [1, 2], include: ["menu"] }, { id: 2, name: "test2", menu: [1, 2], include: ["menu"] }]
  @Post(':model/create')
  async create(
    @Model() model: string,
    @Body() body: CreateParams,
    @Request() req,
  ): Promise<BaseResponse> {
    return await this.service.create(model, body, req.user);
  }

  // 更新数据
  // body参数支持对象或数组对象：
  // 对象：{ id: 1, name: "test", menu: [1, 2], include: ["menu"] }
  // 数组：[{ id: 1, name: "test", menu: [1, 2], include: ["menu"] }, { id: 2, name: "test2", menu: [1, 2], include: ["menu"] }]
  @Put(':model/update')
  async update(
    @Model() model: string,
    @Body() body: UpdateParams,
    @Request() req,
  ): Promise<BaseResponse> {
    return await this.service.update(model, body, req.user);
  }

  // 软删除
  // body参数支持对象或数组对象：
  // 对象：{ id: 1 }
  // 对象: {ids: [1, 2]}
  // 字符串: "1"
  // 数组：[1, 2]
  // 数组对象：[{ id: 1 }, { id: 2 }]
  @Delete(':model/delete/:id?')
  async delete(
    @Model() model: string,
    @Request() req,
    @Param('id') paramId?: string | number,
    @Body() body?: DeleteParams,
  ): Promise<BaseResponse> {
    if (
      typeof body === 'object' &&
      !Array.isArray(body) &&
      'id' in body &&
      !body?.id &&
      paramId
    ) {
      body['id'] = paramId;
    }
    return await this.service.delete(model, body, req.user);
  }

  // 硬删除
  // body参数支持对象或数组对象：
  // 对象：{ id: 1 }
  // 对象: {ids: [1, 2]}
  // 字符串: "1"
  // 数组：[1, 2]
  // 数组对象：[{ id: 1 }, { id: 2 }]
  @Delete(':model/hardDelete/:id?')
  async hardDelete(
    @Param('model') model: string,
    @Request() req,
    @Param('id') paramId?: string | number, // 注意：这里改为 string 类型，以便支持空值
    @Body() body?: HardDeleteParams,
  ): Promise<BaseResponse> {
    if (
      typeof body === 'object' &&
      !Array.isArray(body) &&
      'id' in body &&
      !body?.id &&
      paramId
    ) {
      body['id'] = paramId;
    }
    return await this.service.hardDelete(model, body, req.user);
  }
}

/*
Tip：
1. 传include和时，支持数组和逗号字符串形式。例如：include: ['users', 'menu'] 和 include: 'users,menu'
2. 传多对多外表id时，支持数组形式。例如：users: [1, 2, 3] 和 menu: [1, 2, 3]
*/
