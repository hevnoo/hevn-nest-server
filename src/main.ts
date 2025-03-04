import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { PORT } from '@/config';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  // 使用全局管道
  app.useGlobalPipes(new ValidationPipe());
  // 使用格式化响应体 全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 使用全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });
  // 启用 CORS
  // app.enableCors({
  //   origin: ['http://localhost:5173', 'http://localhost:8090'], // 允许的前端地址
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许的 HTTP 方法
  //   credentials: true, // 允许携带凭证（如 Cookie）
  // });

  // 使用 console.log 打印实际路径，帮助调试
  const uploadPath = join(__dirname, '..', 'uploads');
  console.log('Static files path:', uploadPath);
  // 配置静态文件服务
  app.useStaticAssets(uploadPath, {
    prefix: '/uploads/',
  });

  await app.listen(PORT ?? 3000);
}
bootstrap();
