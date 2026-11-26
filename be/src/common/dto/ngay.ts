/**
 * Ngày dạng YYYY-MM-DD cho các trường `format: 'date'`.
 * Dùng kèm IsISO8601({ strict: true }): IsISO8601 kiểm tra ngày có thật
 * nhưng vẫn nhận chuỗi có giờ (2000-08-15T10:00:00Z).
 */
export const NGAY_YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;
