// 验证主键，用户名、邮箱、手机号必须提供其中一个，供dto使用的装饰器
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function ValidatePrimaryDto(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validatePrimaryDto',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          return (
            (obj.username !== undefined && obj.username !== '') ||
            (obj.email !== undefined && obj.email !== '') ||
            (obj.phone !== undefined && obj.phone !== '')
          );
        },
        defaultMessage(args: ValidationArguments) {
          return '用户名、邮箱或手机号必须提供其中一个';
        },
      },
    });
  };
}
