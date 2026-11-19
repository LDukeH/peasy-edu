/**
 * Định nghĩa 7 loại vai trò người dùng + Khách vãng lai
 * Chuẩn hóa trực tiếp theo Bảng 9 và Mục 3 của Báo cáo SE100.R12
 */
export type UserRole =
  | "CHU_TRUNG_TAM" // Chủ trung tâm (quản lý toàn diện, báo cáo, phê duyệt ngoại lệ)
  | "DIEU_PHOI"    // Nhân viên tư vấn - điều phối (quản lý yêu cầu, gia sư, lớp, lịch)
  | "KE_TOAN"      // Kế toán (học phí, thù lao, thanh toán, công nợ)
  | "QUAN_TRI_VIEN"// Quản trị viên hệ thống (tài khoản, phân quyền, nhật ký audit)
  | "GIA_SU"       // Gia sư (nhận lớp, lịch dạy, điểm danh, xem thù lao)
  | "PHU_HUYNH"    // Phụ huynh (tạo yêu cầu, chọn gia sư, xác nhận buổi, thanh toán)
  | "HOC_VIEN"     // Học viên (xem lịch học, tài liệu, đánh giá gia sư)
  | "KHACH";       // Khách vãng lai (xem dịch vụ, bảng giá, nộp form đăng ký)

export const ROLE_LABELS: Record<UserRole, string> = {
  CHU_TRUNG_TAM: "Chủ trung tâm",
  DIEU_PHOI: "NV Điều phối",
  KE_TOAN: "Kế toán",
  QUAN_TRI_VIEN: "Quản trị viên",
  GIA_SU: "Gia sư",
  PHU_HUYNH: "Phụ huynh",
  HOC_VIEN: "Học viên",
  KHACH: "Khách vãng lai",
};

export interface UserProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: UserRole;
  avatarUrl?: string;
}
