import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// 文件上传
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
// jwt
import { PrismaService } from './common/prisma/prisma.service';
import { AuthModule } from './common/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';

import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ModelMiddleware } from './common/middleware/model.middleware';

import { UsersModule } from './modules/users/users.module';
import { PostModule } from './modules/post/post.module';
import { CategoryModule } from './modules/category/category.module';
import { UploadModule } from './modules/upload/upload.module';
import { RolesModule } from './modules/roles/roles.module';
import { MenuService } from './modules/menu/menu.service';
import { MenuController } from './modules/menu/menu.controller';
import { MenuModule } from './modules/menu/menu.module';
import { GeneralModule } from './common/general/general.module';

@Module({
  imports: [
    UsersModule,
    PostModule,
    CategoryModule,
    AuthModule,
    UploadModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // 文件存储目录
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          callback(null, file.fieldname + '-' + uniqueSuffix + extension);
        },
      }),
    }),
    RolesModule,
    MenuModule,
    GeneralModule,
  ],
  controllers: [AppController, MenuController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    MenuService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
      .apply(ModelMiddleware)
      .forRoutes('api/:model/*'); // 明确指定带model参数的路由;
  }
}
