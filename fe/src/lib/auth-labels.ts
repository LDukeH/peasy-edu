import {
  CapHoc,
  NhomMon,
  TrangThaiMonHoc,
  TrangThaiTaiKhoan,
  VaiTro,
  type UserDto,
} from "@/api/generated/model";
import type { UserProfile, UserRole } from "@/types/auth";

export const VAI_TRO_LABEL: Record<VaiTro, string> = {
  QUAN_LY: "Quản lý",
  DIEU_PHOI: "Nhân viên điều phối",
  GIA_SU: "Gia sư",
  PHU_HUYNH: "Phụ huynh",
};

export const VAI_TRO_SCOPE: Record<VaiTro, string> = {
  QUAN_LY: "Phạm vi: quản trị tài khoản, phân quyền, danh mục và vận hành trung tâm.",
  DIEU_PHOI: "Phạm vi: tiếp nhận yêu cầu, ghép gia sư, xếp lớp và theo dõi buổi học.",
  GIA_SU: "Phạm vi: nhận lời mời lớp, xem lịch dạy và cập nhật buổi học.",
  PHU_HUYNH: "Phạm vi: gửi yêu cầu tìm gia sư, theo dõi lịch học và học phí.",
};

export const ALL_VAI_TRO: VaiTro[] = [
  VaiTro.QUAN_LY,
  VaiTro.DIEU_PHOI,
  VaiTro.GIA_SU,
  VaiTro.PHU_HUYNH,
];

export const TRANG_THAI_TAI_KHOAN_LABEL: Record<TrangThaiTaiKhoan, string> = {
  HOAT_DONG: "Hoạt động",
  BI_KHOA: "Bị khóa",
};

export const NHOM_MON_LABEL: Record<NhomMon, string> = {
  VAN_HOA: "Văn hóa",
  NGOAI_NGU: "Ngoại ngữ",
  NANG_KHIEU_KY_NANG: "Năng khiếu & Kỹ năng",
  LUYEN_THI: "Luyện thi",
};

export const ALL_NHOM_MON: NhomMon[] = [
  NhomMon.VAN_HOA,
  NhomMon.NGOAI_NGU,
  NhomMon.NANG_KHIEU_KY_NANG,
  NhomMon.LUYEN_THI,
];

export const CAP_HOC_LABEL: Record<CapHoc, string> = {
  TIEU_HOC: "Tiểu học",
  THCS: "THCS",
  THPT: "THPT",
  DAI_HOC: "Đại học",
  NGUOI_DI_LAM: "Người đi làm",
};

export const ALL_CAP_HOC: CapHoc[] = [
  CapHoc.TIEU_HOC,
  CapHoc.THCS,
  CapHoc.THPT,
  CapHoc.DAI_HOC,
  CapHoc.NGUOI_DI_LAM,
];

export const TRANG_THAI_MON_HOC_LABEL: Record<TrangThaiMonHoc, string> = {
  DANG_SU_DUNG: "Đang dùng",
  NGUNG_SU_DUNG: "Ngừng dùng",
};

export function homeForRole(role: VaiTro): string {
  return role === VaiTro.QUAN_LY ? "/admin/settings" : "/welcome";
}

export function mapApiRoleToStoreRole(role: VaiTro): UserRole {
  switch (role) {
    case VaiTro.QUAN_LY:
      return "QUAN_TRI_VIEN";
    case VaiTro.DIEU_PHOI:
      return "DIEU_PHOI";
    case VaiTro.GIA_SU:
      return "GIA_SU";
    case VaiTro.PHU_HUYNH:
      return "PHU_HUYNH";
    default:
      return "KHACH";
  }
}

export function mapUserDtoToProfile(user: UserDto): UserProfile {
  return {
    id: user.maDoiTuong ?? String(user.id),
    name: user.hoTen,
    phone: user.soDienThoai ?? undefined,
    email: user.email ?? undefined,
    role: mapApiRoleToStoreRole(user.vaiTro),
  };
}

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatPhone(digits: string | null | undefined): string {
  if (!digits) return "—";
  const d = normalizePhone(digits);
  if (d.length === 10) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
  return digits;
}

export function isValidPhone(value: string): boolean {
  return /^0\d{9}$/.test(normalizePhone(value));
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}
