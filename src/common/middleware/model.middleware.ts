// src/common/middlewares/model.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ModelMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 使用正则表达式匹配 /api/{model}/ 格式的URL
    const modelRegex = /^\/api\/([^\/]+)/;
    const matches = req.originalUrl.match(modelRegex);

    let model = null;
    if (matches && matches[1]) {
      // 移除查询参数
      model = matches[1].split('?')[0];
    }

    // console.log('ModelMiddleware:', {
    //   originalUrl: req.originalUrl,
    //   url: req.url,
    //   model,
    //   matches,
    // });

    if (model) {
      req['currentModel'] = model;
    }
    next();
  }
}
