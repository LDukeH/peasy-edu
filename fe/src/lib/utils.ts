import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Hợp nhất class name Tailwind CSS an toàn và chống xung đột.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Định dạng số tiền sang định dạng VNĐ chuẩn Việt Nam.
 * Theo quy ước nghiệp vụ SE100.R12: Mọi số tiền lưu trữ là số nguyên (Int).
 * @param amount Số nguyên VNĐ (ví dụ: 200000)
 * @returns Chuỗi tiền tệ (ví dụ: "200.000 ₫")
 */
export function formatVND(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0 ₫";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.floor(amount));
}

/**
 * Tính toán 50% số tiền theo quy định làm tròn chuẩn trong Báo cáo SE100.R12 (Mục A.1):
 * Thống nhất dùng Math.floor(soTien * 0.5) để tránh số lẻ thập phân.
 */
export function roundVND50Percent(amount: number): number {
  return Math.floor(amount * 0.5);
}

/**
 * Định dạng ngày theo múi giờ Việt Nam (Asia/Ho_Chi_Minh): DD/MM/YYYY
 */
export function formatDateVN(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "--/--/----";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "--/--/----";

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/**
 * Định dạng ngày giờ theo múi giờ Việt Nam: HH:mm DD/MM/YYYY
 */
export function formatDateTimeVN(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "--:-- --/--/----";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "--:-- --/--/----";

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  }).format(date);
}
