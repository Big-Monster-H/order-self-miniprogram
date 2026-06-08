import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-codes';

export class BizException extends HttpException {
  public readonly errCode: number;

  constructor(errorCode: { code: number; msg: string }, httpStatus: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(errorCode.msg, httpStatus);
    this.errCode = errorCode.code;
  }
}
