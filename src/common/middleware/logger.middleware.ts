import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const green = '\x1b[32m'; // 设置文本颜色为绿色
    const reset = '\x1b[0m'; // 重置文本颜色
    const logMessage = `${green}${req.method} ${req.url} - ${req.ip} - ${new Date().toISOString()}${reset}`;

    if (req.method === 'POST') {
      // 检查是否为登录接口
      const blackList = ['/api/auth/login', '/api/auth/register'];
      if (blackList.includes(req.originalUrl)) {
        console.log(`${logMessage}\nBody: [REDACTED]`);
      } else {
        console.log(
          `${logMessage}\nBody: ${JSON.stringify(req.body, null, 2)}`,
        );
      }
    } else {
      console.log(logMessage);
    }
    next();
  }
}
