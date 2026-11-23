import { isAxiosError } from "axios";
import type { ErrorResponseDto } from "@/api/generated/model";

export interface ParsedApiError {
  statusCode?: number;
  message: string;
}

export function extractApiError(
  error: unknown,
  fallback = "Đã có lỗi xảy ra. Vui lòng thử lại.",
): ParsedApiError {
  if (isAxiosError<ErrorResponseDto>(error)) {
    const statusCode = error.response?.status ?? error.response?.data?.statusCode;
    const rawMessage = error.response?.data?.message;

    if (Array.isArray(rawMessage) && rawMessage.length > 0) {
      return { statusCode, message: rawMessage.join(" ") };
    }
    if (typeof rawMessage === "string" && rawMessage.trim()) {
      return { statusCode, message: rawMessage };
    }

    if (statusCode === 401) {
      return { statusCode, message: "Tên đăng nhập hoặc mật khẩu chưa đúng." };
    }
    if (statusCode === 403) {
      return { statusCode, message: "Bạn không có quyền thực hiện thao tác này." };
    }
    if (statusCode === 409) {
      return { statusCode, message: "Dữ liệu đã tồn tại trong hệ thống." };
    }
    return { statusCode, message: fallback };
  }

  if (error instanceof Error && error.message) {
    return { message: error.message };
  }

  return { message: fallback };
}
