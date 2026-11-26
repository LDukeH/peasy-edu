import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';

/** 20 lần xin URL upload / 10 phút cho mỗi ứng viên. */
export const UPLOAD_URL_SO_LAN_TOI_DA = 20;
export const UPLOAD_URL_KHOANG_THOI_GIAN_MS = 10 * 60_000;

/**
 * FE gọi qua Next rewrites (Vercel) và BE đặt trust proxy = 1 nên req.ip là
 * IP máy chủ Vercel. Đếm theo IP đầu tiên trong X-Forwarded-For để không
 * chặn nhầm nhiều người ứng tuyển cùng lúc (giữ nguyên contract không cần SĐT).
 */
@Injectable()
export class StorageUploadThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Request): Promise<string> {
    const xff = req.headers['x-forwarded-for'];
    const chuoiXff = Array.isArray(xff) ? xff[0] : xff;
    const ipDauTien = chuoiXff?.split(',')[0]?.trim();
    const ip = ipDauTien || req.ip || 'unknown';
    return Promise.resolve(`storage-upload:${ip}`);
  }
}
