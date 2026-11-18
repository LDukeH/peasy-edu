import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { VaiTro } from '../enums/tai-khoan.enum.js';
import type { AuthenticatedRequest } from './auth-user.js';
import { CUA_MINH_KEY, type CuaMinhMetadata } from './auth.decorators.js';
import { OwnershipService } from './ownership.service.js';

const KHONG_PHAI_CUA_MINH = 'Bạn không có quyền truy cập dữ liệu này';

/**
 * Kiểm tra @CuaMinh() ở phía server. Bản ghi không tồn tại cũng trả 403
 * để người dùng không dò được id nào đang có dữ liệu.
 */
@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly ownership: OwnershipService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const cuaMinh = this.reflector.getAllAndOverride<
      CuaMinhMetadata | undefined
    >(CUA_MINH_KEY, [context.getHandler(), context.getClass()]);
    if (!cuaMinh) return true;

    const { user, params } = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    if (!user) throw new ForbiddenException(KHONG_PHAI_CUA_MINH);
    if (user.vaiTro === VaiTro.QUAN_LY || user.vaiTro === VaiTro.DIEU_PHOI) {
      return true;
    }

    const banGhiId = Number(params[cuaMinh.thamSo]);
    const laCuaMinh =
      Number.isInteger(banGhiId) &&
      banGhiId > 0 &&
      (await this.ownership.laCuaMinh(user, cuaMinh.taiNguyen, banGhiId));
    if (!laCuaMinh) throw new ForbiddenException(KHONG_PHAI_CUA_MINH);
    return true;
  }
}
