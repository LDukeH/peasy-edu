import {
  Injectable,
  type NestMiddleware,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

/**
 * API chỉ nhận application/json (kế hoạch nhóm, mục Bảo mật tối thiểu).
 * Tự xét có body hay không vì req.is() coi `Content-Length: 0` là có body,
 * trong khi FE gọi refresh, logout bằng POST rỗng với header đó.
 */
@Injectable()
export class JsonOnlyMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const coBody =
      req.headers['transfer-encoding'] !== undefined ||
      Number(req.headers['content-length'] ?? 0) > 0;
    if (coBody && !req.is('application/json')) {
      throw new UnsupportedMediaTypeException(
        'Chỉ chấp nhận dữ liệu application/json',
      );
    }
    next();
  }
}
