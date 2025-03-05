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
import { UsersService } from './users.service';
import { Public } from '@/common/decorators/public.decorator';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Public()
  @Get('getUserList')
  async getUserList(@Query() payload): Promise<any[]> {
    return await this.usersService.getUserList(payload);
  }

  @Put('updateUser/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() payload: { nickname?: string; email?: string },
  ): Promise<any> {
    return await this.usersService.updateUser(id, payload);
  }

  @Delete('deleteUser/:id')
  async delete(@Param('id') id: string): Promise<any> {
    return await this.usersService.delete(id);
  }

  @Delete('deleteMany')
  async deleteMany(@Body('ids') ids: string[]): Promise<any> {
    return await this.usersService.deleteMany(ids);
  }

  @Delete('hardDelete/:id')
  async hardDelete(@Param('id') id: string): Promise<any> {
    return await this.usersService.hardDelete(id);
  }

  @Delete('hardDeleteMany')
  async hardDeleteMany(@Body('ids') ids: string[]): Promise<any> {
    return await this.usersService.hardDeleteMany(ids);
  }
}
