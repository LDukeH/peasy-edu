import {
  createParamDecorator,
  type ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import type { VaiTro } from '../enums/tai-khoan.enum.js';
import type { AuthenticatedRequest, AuthUser } from './auth-user.js';
import type { TaiNguyenCuaMinh } from './ownership.service.js';

export const IS_PUBLIC_KEY = 'auth:isPublic';
export const ROLES_KEY = 'auth:roles';
export const CUA_MINH_KEY = 'auth:cuaMinh';

export interface CuaMinhMetadata {
  taiNguyen: TaiNguyenCuaMinh;
  thamSo: string;
}

/** Mọi route đều cần đăng nhập, trừ route gắn @Public(). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/** Chỉ các vai trò được liệt kê mới gọi được route. */
export const Roles = (...vaiTro: VaiTro[]) => SetMetadata(ROLES_KEY, vaiTro);

/**
 * Quyền "Của mình" (Bảng 9): GS/PH chỉ truy cập bản ghi của chính họ.
 * QUAN_LY và DIEU_PHOI được bỏ qua; giới hạn của họ đặt bằng @Roles().
 *
 * @param thamSo tên route param chứa id bản ghi, mặc định `id`
 */
export const CuaMinh = (taiNguyen: TaiNguyenCuaMinh, thamSo = 'id') =>
  SetMetadata(CUA_MINH_KEY, { taiNguyen, thamSo } satisfies CuaMinhMetadata);

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser | undefined =>
    ctx.switchToHttp().getRequest<AuthenticatedRequest>().user,
);
