import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Public } from '@/common/decorators/public.decorator';

@Controller('api/roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  // @Public()
  @Get('getList')
  async getData(@Query() payload): Promise<any[]> {
    return await this.service.getData(payload);
  }

  @Post('create')
  async create(@Body() payload: any): Promise<any> {
    return await this.service.create(payload);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string | number,
    @Body() payload: { payload: any },
  ): Promise<any> {
    return await this.service.update(id, payload);
  }

  @Delete('delete')
  async delete(
    @Body('id') id: string | number | string[] | number[],
  ): Promise<any> {
    return await this.service.delete(id);
  }

  @Delete('realDelete/:id')
  async realDelete(@Param('id') id: string): Promise<any> {
    return await this.service.realDelete(id);
  }
}
