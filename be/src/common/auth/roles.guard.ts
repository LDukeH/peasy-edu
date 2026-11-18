import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { VaiTro } from '../enums/tai-khoan.enum.js';
import type { AuthenticatedRequest } from './auth-user.js';
import { ROLES_KEY } from './auth.decorators.js';

/** Đã đăng nhập nhưng sai vai trò → 403 (không phải 401, tránh vòng refresh). */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const vaiTroDuocPhep = this.reflector.getAllAndOverride<
      VaiTro[] | undefined
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!vaiTroDuocPhep?.length) return true;

    const { user } = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    if (!user || !vaiTroDuocPhep.includes(user.vaiTro)) {
      throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này');
    }
    return true;
  }
}
