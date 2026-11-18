import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';

/**
 * Đăng nhập được đếm theo tên đăng nhập: FE đi qua Next rewrites nên nhiều người
 * dùng có thể chung một IP, đếm theo IP sẽ khóa nhầm cả hệ thống.
 */
@Injectable()
export class AuthThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Request): Promise<string> {
    const { tenDangNhap } = (req.body ?? {}) as { tenDangNhap?: unknown };
    const tracker =
      typeof tenDangNhap === 'string' && tenDangNhap.trim()
        ? `login:${tenDangNhap.trim().toLowerCase()}`
        : (req.ip ?? 'unknown');
    return Promise.resolve(tracker);
  }
}
