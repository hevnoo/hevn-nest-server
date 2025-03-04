import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '@/common/decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }
  // async register(
  //   @Body()
  //   body: { username: string; email?: string; password: string; nickname?: string },
  // ) {
  //   return this.authService.register(body);
  // }
}
