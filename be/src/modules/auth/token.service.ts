import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TTL_SECONDS, REFRESH_TTL_SECONDS } from './auth.constants.js';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenPayload {
  taiKhoanId: number;
  persistent: boolean;
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

  async issue(taiKhoanId: number, persistent = true): Promise<TokenPair> {
    const accessPayload = { sub: String(taiKhoanId) };
    const refreshPayload = { sub: String(taiKhoanId), rem: persistent };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(accessPayload, {
        secret: this.accessSecret,
        expiresIn: ACCESS_TTL_SECONDS,
        algorithm: 'HS256',
      }),
      this.jwt.signAsync(refreshPayload, {
        secret: this.refreshSecret,
        expiresIn: REFRESH_TTL_SECONDS,
        algorithm: 'HS256',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async verifyAccess(token: string): Promise<number | null> {
    const payload = await this.verify<{ sub: string }>(
      token,
      this.accessSecret,
    );
    return payload ? this.parseSub(payload.sub) : null;
  }

  async verifyRefresh(token: string): Promise<RefreshTokenPayload | null> {
    const payload = await this.verify<{ sub: string; rem?: boolean }>(
      token,
      this.refreshSecret,
    );
    if (!payload) return null;
    const taiKhoanId = this.parseSub(payload.sub);
    if (taiKhoanId === null) return null;
    return { taiKhoanId, persistent: payload.rem !== false };
  }

  private parseSub(sub: string): number | null {
    const taiKhoanId = Number(sub);
    return Number.isInteger(taiKhoanId) && taiKhoanId > 0 ? taiKhoanId : null;
  }

  /** Token sai hoặc hết hạn → null để nơi gọi trả 401. */
  private async verify<T extends object>(
    token: string,
    secret: string,
  ): Promise<T | null> {
    try {
      return await this.jwt.verifyAsync<T>(token, {
        secret,
        algorithms: ['HS256'],
      });
    } catch {
      return null;
    }
  }
}
