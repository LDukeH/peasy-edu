import type { Request } from 'express';
import type { VaiTro } from '../enums/tai-khoan.enum.js';

/** Người dùng đã xác thực, do JwtAuthGuard gắn vào request. */
export interface AuthUser {
  id: number;
  vaiTro: VaiTro;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
