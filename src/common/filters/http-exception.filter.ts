// 全局异常过滤器，处理 HttpException 异常
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    console.log('exceptionResponse:', exceptionResponse);

    let responseBody: ApiResponseDto;

    // 检查异常响应是否已经符合 ApiResponseDto 格式
    if (
      typeof exceptionResponse === 'object' &&
      'code' in exceptionResponse &&
      'msg' in exceptionResponse
    ) {
      // 如果已经符合格式，直接使用
      responseBody = exceptionResponse as ApiResponseDto;
    } else {
      // 否则，构造一个新的 ApiResponseDto
      let code: any = status;
      let msg: string | null | undefined = '操作失败';

      if (typeof exceptionResponse === 'string') {
        msg = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        if ('message' in exceptionResponse) {
          msg = Array.isArray(exceptionResponse.message)
            ? exceptionResponse.message[0]
            : exceptionResponse.message;
        }
        if ('statusCode' in exceptionResponse) {
          code = exceptionResponse.statusCode;
        }
      }

      // 对于 401 错误，设置特定的消息
      if (status === HttpStatus.UNAUTHORIZED) {
        code = 401;
        msg = msg === '操作失败' ? 'Unauthorized' : msg;
      }

      responseBody = new ApiResponseDto(code, msg);
    }

    response.status(status).json(responseBody);
  }
}
