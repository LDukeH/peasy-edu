import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';

/** 5 lần gửi hồ sơ / 10 phút cho mỗi số điện thoại. */
export const UNG_TUYEN_SO_LAN_TOI_DA = 5;
export const UNG_TUYEN_KHOANG_THOI_GIAN_MS = 10 * 60_000;

/**
 * Đếm theo số điện thoại giống AuthThrottlerGuard: FE đi qua Next rewrites
 * nên nhiều người có thể chung một IP, đếm theo IP sẽ chặn nhầm cả trung tâm.
 */
@Injectable()
export class TutorApplyThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Request): Promise<string> {
    const { soDienThoai } = (req.body ?? {}) as { soDienThoai?: unknown };
    const tracker =
      typeof soDienThoai === 'string' && soDienThoai.trim()
        ? `tutor-apply:${soDienThoai.trim()}`
        : (req.ip ?? 'unknown');
    return Promise.resolve(tracker);
  }
}
