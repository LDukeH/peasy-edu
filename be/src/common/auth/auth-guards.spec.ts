import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { VaiTro } from '../enums/tai-khoan.enum.js';
import type { AuthUser } from './auth-user.js';
import { CuaMinh, Public, Roles } from './auth.decorators.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { OwnershipGuard } from './ownership.guard.js';
import { RolesGuard } from './roles.guard.js';

type Decorator = (target: object) => unknown;

/** Tạo ExecutionContext giả với route được gắn sẵn decorator cần kiểm tra. */
function taoContext(request: object, ...decorators: Decorator[]) {
  const handler = () => undefined;
  decorators.forEach((decorator) => decorator(handler));
  return {
    getHandler: () => handler,
    getClass: () => class {},
    switchToHttp: () => ({ getRequest: () => request }),
  } as never;
}

const reflector = new Reflector();
const giaSu: AuthUser = { id: 5, vaiTro: VaiTro.GIA_SU };

describe('JwtAuthGuard', () => {
  const tokens = { verifyAccess: vi.fn() };
  const prisma = { taiKhoan: { findUnique: vi.fn() } };
  const guard = new JwtAuthGuard(reflector, tokens as never, prisma as never);

  beforeEach(() => vi.resetAllMocks());

  it('route @Public() không cần cookie', async () => {
    await expect(
      guard.canActivate(taoContext({ cookies: {} }, Public() as Decorator)),
    ).resolves.toBe(true);
  });

  it('thiếu cookie → 401', async () => {
    await expect(
      guard.canActivate(taoContext({ cookies: {} })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('token sai hoặc hết hạn → 401', async () => {
    tokens.verifyAccess.mockResolvedValue(null);

    await expect(
      guard.canActivate(taoContext({ cookies: { access_token: 'sai' } })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('tài khoản bị khóa sau khi cấp token → 401 ngay', async () => {
    tokens.verifyAccess.mockResolvedValue(5);
    prisma.taiKhoan.findUnique.mockResolvedValue({
      id: 5,
      trangThai: 'BI_KHOA',
      vaiTro: { ma: 'GIA_SU' },
    });

    await expect(
      guard.canActivate(taoContext({ cookies: { access_token: 'dung' } })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('hợp lệ → gắn user với vai trò mới nhất trong DB', async () => {
    tokens.verifyAccess.mockResolvedValue(5);
    prisma.taiKhoan.findUnique.mockResolvedValue({
      id: 5,
      trangThai: 'HOAT_DONG',
      vaiTro: { ma: 'GIA_SU' },
    });
    const request: { cookies: object; user?: AuthUser } = {
      cookies: { access_token: 'dung' },
    };

    await expect(guard.canActivate(taoContext(request))).resolves.toBe(true);
    expect(request.user).toEqual(giaSu);
  });
});

describe('RolesGuard', () => {
  const guard = new RolesGuard(reflector);
  const chiQuanLy = Roles(VaiTro.QUAN_LY) as Decorator;

  it('route không gắn @Roles() thì cho qua', () => {
    expect(guard.canActivate(taoContext({ user: giaSu }))).toBe(true);
  });

  it('đúng vai trò thì cho qua', () => {
    const user = { id: 1, vaiTro: VaiTro.QUAN_LY };

    expect(guard.canActivate(taoContext({ user }, chiQuanLy))).toBe(true);
  });

  it('sai vai trò → 403, không phải 401', () => {
    expect(() =>
      guard.canActivate(taoContext({ user: giaSu }, chiQuanLy)),
    ).toThrow(ForbiddenException);
  });
});

describe('OwnershipGuard', () => {
  const ownership = { laCuaMinh: vi.fn() };
  const guard = new OwnershipGuard(reflector, ownership as never);
  const cuaMinhLop = CuaMinh('LOP_HOC') as Decorator;

  beforeEach(() => vi.resetAllMocks());

  it('route không gắn @CuaMinh() thì không truy vấn', async () => {
    await expect(
      guard.canActivate(taoContext({ user: giaSu, params: {} })),
    ).resolves.toBe(true);
    expect(ownership.laCuaMinh).not.toHaveBeenCalled();
  });

  it.each([VaiTro.QUAN_LY, VaiTro.DIEU_PHOI])('%s được bỏ qua', async (vaiTro) => {
    const request = { user: { id: 1, vaiTro }, params: { id: '9' } };

    await expect(
      guard.canActivate(taoContext(request, cuaMinhLop)),
    ).resolves.toBe(true);
    expect(ownership.laCuaMinh).not.toHaveBeenCalled();
  });

  it('bản ghi của mình → cho qua', async () => {
    ownership.laCuaMinh.mockResolvedValue(true);
    const request = { user: giaSu, params: { id: '9' } };

    await expect(
      guard.canActivate(taoContext(request, cuaMinhLop)),
    ).resolves.toBe(true);
    expect(ownership.laCuaMinh).toHaveBeenCalledWith(giaSu, 'LOP_HOC', 9);
  });

  it('bản ghi của người khác → 403', async () => {
    ownership.laCuaMinh.mockResolvedValue(false);
    const request = { user: giaSu, params: { id: '9' } };

    await expect(
      guard.canActivate(taoContext(request, cuaMinhLop)),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it.each(['abc', '0', '-1', '1.5'])('id không hợp lệ "%s" → 403', async (id) => {
    const request = { user: giaSu, params: { id } };

    await expect(
      guard.canActivate(taoContext(request, cuaMinhLop)),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(ownership.laCuaMinh).not.toHaveBeenCalled();
  });
});
