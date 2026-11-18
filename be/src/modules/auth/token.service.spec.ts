import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service.js';

const taoConfig = (access?: string, refresh?: string) =>
  ({
    get: (key: string) =>
      key === 'JWT_ACCESS_SECRET' ? access : refresh,
  }) as never;

describe('TokenService', () => {
  const jwt = new JwtService({});
  const service = new TokenService(jwt, taoConfig('secret-a', 'secret-r'));

  it('cấp cặp token đọc lại được đúng id tài khoản', async () => {
    const { accessToken, refreshToken } = await service.issue(7);

    await expect(service.verifyAccess(accessToken)).resolves.toBe(7);
    await expect(service.verifyRefresh(refreshToken)).resolves.toBe(7);
  });

  it('không cho dùng refresh token thay access token và ngược lại', async () => {
    const { accessToken, refreshToken } = await service.issue(7);

    await expect(service.verifyAccess(refreshToken)).resolves.toBeNull();
    await expect(service.verifyRefresh(accessToken)).resolves.toBeNull();
  });

  it('trả null với token hết hạn hoặc sai định dạng', async () => {
    const hetHan = await jwt.signAsync(
      { sub: '7' },
      { secret: 'secret-a', expiresIn: -1 },
    );

    await expect(service.verifyAccess(hetHan)).resolves.toBeNull();
    await expect(service.verifyAccess('khong-phai-jwt')).resolves.toBeNull();
  });

  it('từ chối khởi động khi thiếu secret hoặc hai secret trùng nhau', () => {
    expect(() => new TokenService(jwt, taoConfig())).toThrow();
    expect(() => new TokenService(jwt, taoConfig('a', 'a'))).toThrow();
  });
});
