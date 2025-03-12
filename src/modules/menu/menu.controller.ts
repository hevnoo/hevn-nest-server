import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { Public } from '@/common/decorators/public.decorator';
import { BaseResponse, QueryParams } from '@/common/general/general.interface';

@Controller('api/menu')
export class MenuController {
  constructor(private readonly service: MenuService) {}

  // @Public()
  @Get('getMenuList')
  async getMenuList(
    @Query() payload: QueryParams,
    @Request() req?,
  ): Promise<BaseResponse> {
    return await this.service.getMenuList(payload, req.user);
  }

  // @Post('create')
  // async create(@Body() payload: any, @Request() req?): Promise<any> {
  //   return await this.service.create(payload, req.user);
  // }

  // @Put('update/:id')
  // async update(
  //   @Param('id') id: string | number,
  //   @Body() payload: { payload: any },
  // ): Promise<any> {
  //   return await this.service.update(id, payload);
  // }

  // @Delete('delete')
  // async delete(
  //   @Body('id') id: string | number | string[] | number[],
  // ): Promise<any> {
  //   return await this.service.delete(id);
  // }

  // @Delete('realDelete/:id')
  // async realDelete(@Param('id') id: string): Promise<any> {
  //   return await this.service.realDelete(id);
  // }
}
