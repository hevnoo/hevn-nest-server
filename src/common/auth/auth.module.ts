import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { PrismaService } from '@/common/prisma/prisma.service';
import { SECRET_KEY, EXPIRESD } from '@/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: SECRET_KEY,
      signOptions: { expiresIn: EXPIRESD }, // 设置 token 过期时间
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
