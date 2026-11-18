import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACCESS_COOKIE } from '../../modules/auth/auth.constants.js';
import { TokenService } from '../../modules/auth/token.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { TrangThaiTaiKhoan, type VaiTro } from '../enums/tai-khoan.enum.js';
import type { AuthenticatedRequest } from './auth-user.js';
import { IS_PUBLIC_KEY } from './auth.decorators.js';

/**
 * Xác thực bằng cookie access_token. Mọi lỗi đều trả 401 để FE tự gọi
 * /auth/refresh. Đọc lại tài khoản từ DB để khóa tài khoản hoặc đổi vai trò
 * có hiệu lực ngay, không phải chờ access token hết hạn.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokens: TokenService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = (request.cookies as Record<string, unknown> | undefined)?.[
      ACCESS_COOKIE
    ];
    const taiKhoanId =
      typeof token === 'string' ? await this.tokens.verifyAccess(token) : null;
    if (taiKhoanId === null) {
      throw new UnauthorizedException('Chưa đăng nhập hoặc phiên đã hết hạn');
    }

    const taiKhoan = await this.prisma.taiKhoan.findUnique({
      where: { id: taiKhoanId },
      select: { id: true, trangThai: true, vaiTro: { select: { ma: true } } },
    });
    if (taiKhoan?.trangThai !== TrangThaiTaiKhoan.HOAT_DONG) {
      throw new UnauthorizedException('Chưa đăng nhập hoặc phiên đã hết hạn');
    }

    request.user = { id: taiKhoan.id, vaiTro: taiKhoan.vaiTro.ma as VaiTro };
    return true;
  }
}
