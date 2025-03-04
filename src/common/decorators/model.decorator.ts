// src/common/decorators/model.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Model = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentModel;
  },
);
