import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BizException } from './biz.exception';
import { ErrorCode } from './error-codes';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errCode: number = ErrorCode.UNKNOWN.code;
    let message: string = ErrorCode.UNKNOWN.msg;

    if (exception instanceof BizException) {
      status = exception.getStatus();
      errCode = exception.errCode;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resp = exception.getResponse();
      if (typeof resp === 'object' && resp !== null) {
        const r = resp as any;
        if (r.message) {
          message = Array.isArray(r.message) ? r.message.join('; ') : r.message;
        }
        if (r.error === 'Not Found') errCode = ErrorCode.NOT_FOUND.code;
        else if (r.error === 'Unauthorized') errCode = ErrorCode.UNAUTHORIZED.code;
        else if (r.error === 'Forbidden') errCode = ErrorCode.FORBIDDEN.code;
        else errCode = ErrorCode.PARAM_INVALID.code;
      } else {
        message = exception.message;
      }
    }

    res.status(status).json({
      errCode,
      errMsg: message,
      data: null,
    });
  }
}
