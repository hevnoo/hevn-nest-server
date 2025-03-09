// 响应拦截，接口返回数据结构拦截器, 处理成功返回的数据结构
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '../dto/api-response.dto';
import { transformBigIntToNumber } from '@/utils/prisma';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        // 先处理 BigInt 转换
        const transformedData = transformBigIntToNumber(data);

        // 然后处理响应格式
        if (transformedData instanceof ApiResponseDto) {
          return transformedData;
        }
        return new ApiResponseDto(200, '操作成功', transformedData);
      }),
    );
  }
}
