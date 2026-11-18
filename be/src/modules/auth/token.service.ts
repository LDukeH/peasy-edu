import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TTL_SECONDS, REFRESH_TTL_SECONDS } from './auth.constants.js';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/** Access và refresh dùng hai secret khác nhau nên không thể dùng thay cho nhau. */
@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;

  constructor(
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.accessSecret = config.get<string>('JWT_ACCESS_SECRET') ?? '';
    this.refreshSecret = config.get<string>('JWT_REFRESH_SECRET') ?? '';

    // openapi:export và CI dựng app chỉ để đọc route, không cần secret.
    const hopLe =
      this.accessSecret &&
      this.refreshSecret &&
      this.accessSecret !== this.refreshSecret;
    if (!hopLe && process.env.SKIP_DB_CONNECT !== 'true') {
      throw new Error(
        'Cần đặt JWT_ACCESS_SECRET và JWT_REFRESH_SECRET, hai giá trị phải khác nhau',
      );
    }
  }

  async issue(taiKhoanId: number): Promise<TokenPair> {
    const payload = { sub: String(taiKhoanId) };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.accessSecret,
        expiresIn: ACCESS_TTL_SECONDS,
        algorithm: 'HS256',
      }),
      this.jwt.signAsync(payload, {
        secret: this.refreshSecret,
        expiresIn: REFRESH_TTL_SECONDS,
        algorithm: 'HS256',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  verifyAccess(token: string): Promise<number | null> {
    return this.verify(token, this.accessSecret);
  }

  verifyRefresh(token: string): Promise<number | null> {
    return this.verify(token, this.refreshSecret);
  }

  /** Token sai hoặc hết hạn → null để nơi gọi trả 401. */
  private async verify(token: string, secret: string): Promise<number | null> {
    try {
      const { sub } = await this.jwt.verifyAsync<{ sub: string }>(token, {
        secret,
        algorithms: ['HS256'],
      });
      const taiKhoanId = Number(sub);
      return Number.isInteger(taiKhoanId) && taiKhoanId > 0 ? taiKhoanId : null;
    } catch {
      return null;
    }
  }
}
