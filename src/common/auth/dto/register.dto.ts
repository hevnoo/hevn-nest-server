import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ValidatePrimaryDto } from '@/common/decorators/validate-primary-dto';

export class RegisterDto {
  @ValidatePrimaryDto({
    message: '用户名、邮箱或手机号必须提供其中一个',
  })
  dummy: any;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: '用户名至少需要3个字符' })
  @MaxLength(20, { message: '用户名不能超过20个字符' })
  username: string;

  @IsOptional()
  @IsEmail({}, { message: '请提供有效的电子邮件地址' })
  email?: string;

  @IsString()
  @MinLength(6, { message: '密码至少需要6个字符' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(30, { message: '昵称不能超过30个字符' })
  nickname?: string;
}
