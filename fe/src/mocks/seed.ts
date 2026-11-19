import type { Account, CategoryItem, DbState } from "./types";

export const DEMO_PASSWORD = "Matkhau123";

const acc = (
  n: number,
  fullName: string,
  phone: string,
  role: Account["role"],
  status: Account["status"] = "HOAT_DONG",
): Account => ({
  id: `acc-${n}`,
  code: `TK-${String(n).padStart(4, "0")}`,
  fullName,
  phone,
  role,
  status,
  password: DEMO_PASSWORD,
});

const cat = (
  group: CategoryItem["group"],
  name: string,
  description: string,
): CategoryItem => ({
  id: `${group.toLowerCase()}-${name.toLowerCase().replace(/\s+/g, "-")}`,
  group,
  name,
  description,
  active: true,
});

export function createSeed(): DbState {
  return {
    accounts: [
      acc(1, "Lê Minh Đức", "0908000101", "QUAN_TRI_VIEN"),
      acc(2, "Phạm Ngọc Linh", "0908000102", "DIEU_PHOI"),
      acc(3, "Đặng Hồng Nhung", "0908000103", "KE_TOAN"),
      acc(4, "Nguyễn Minh Anh", "0908000104", "GIA_SU"),
      acc(5, "Trần Thu Hà", "0901234567", "PHU_HUYNH"),
      acc(6, "Trần Gia Huy", "0908000106", "GIA_SU", "BI_KHOA"),
    ],
    roleRequests: [],
    categories: [
      cat("SUBJECT", "Toán", "Văn hóa · Từ Lớp 1"),
      cat("SUBJECT", "Ngữ văn", "Văn hóa · Từ Lớp 1"),
      cat("SUBJECT", "Tiếng Anh", "Ngoại ngữ · Từ Lớp 1"),
      cat("SUBJECT", "Vật lý", "Văn hóa · Từ THCS"),
      cat("SUBJECT", "Hóa học", "Văn hóa · Từ THCS"),
      cat("SUBJECT", "Piano", "Năng khiếu"),
      cat("SUBJECT", "Vẽ", "Năng khiếu"),
      cat("SUBJECT", "Cờ vua", "Năng khiếu"),
      cat("SUBJECT", "Kỹ năng sống", "Kỹ năng"),
      ...Array.from({ length: 12 }, (_, i) =>
        cat("GRADE", `Lớp ${i + 1}`, i < 5 ? "Tiểu học" : i < 9 ? "THCS" : "THPT"),
      ),
      cat("AREA", "Bình Thạnh", "TP. Hồ Chí Minh"),
      cat("AREA", "Phú Nhuận", "TP. Hồ Chí Minh"),
      cat("AREA", "Gò Vấp", "TP. Hồ Chí Minh"),
      cat("AREA", "Thủ Đức", "TP. Hồ Chí Minh"),
      cat("AREA", "Quận 3", "TP. Hồ Chí Minh"),
    ],
    center: {
      displayName: "PeasyEdu",
      supportEmail: "hello@peasyedu.vn",
      phone: "028 3822 0123",
    },
  };
}
