// 用于限制general通用接口，不能访问某些敏感表。
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

const SENSITIVE_MODELS = [
  'user',
  'users',
  'role',
  'roles',
  'permission',
  'permissions',
  'menu',
  'buttons',
];

@Injectable()
export class SensitiveModelGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const model = request.params.model?.toLowerCase();

    if (SENSITIVE_MODELS.includes(model)) {
      throw new ForbiddenException(`访问被拒绝：${model} 是受保护的资源`);
    }

    return true;
  }
}
