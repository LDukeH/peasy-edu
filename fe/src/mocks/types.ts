export type RoleCode =
  | "CHU_TRUNG_TAM"
  | "QUAN_TRI_VIEN"
  | "DIEU_PHOI"
  | "KE_TOAN"
  | "GIA_SU"
  | "PHU_HUYNH"
  | "HOC_VIEN";

export const ROLE_LABEL: Record<RoleCode, string> = {
  CHU_TRUNG_TAM: "Chủ trung tâm",
  QUAN_TRI_VIEN: "Quản trị viên",
  DIEU_PHOI: "Điều phối",
  KE_TOAN: "Kế toán",
  GIA_SU: "Gia sư",
  PHU_HUYNH: "Phụ huynh",
  HOC_VIEN: "Học viên",
};

// Quản trị viên không được tự cấp quyền Chủ trung tâm (theo Figma).
export const ASSIGNABLE_ROLES: RoleCode[] = [
  "QUAN_TRI_VIEN",
  "DIEU_PHOI",
  "KE_TOAN",
  "GIA_SU",
  "PHU_HUYNH",
  "HOC_VIEN",
];

export const ROLE_SCOPE: Record<RoleCode, string> = {
  CHU_TRUNG_TAM: "Phạm vi: xem toàn bộ và phê duyệt quyền.",
  QUAN_TRI_VIEN: "Phạm vi: quản lý tài khoản và truy cập, không đổi khung giá.",
  DIEU_PHOI: "Phạm vi: vận hành, ghép lớp, lịch học và phản hồi.",
  KE_TOAN: "Phạm vi: học phí, công nợ và thù lao gia sư.",
  GIA_SU: "Phạm vi: hồ sơ, lời mời và các lớp của chính gia sư.",
  PHU_HUYNH: "Phạm vi: yêu cầu, học phí và lịch học của con mình.",
  HOC_VIEN: "Phạm vi: lịch học và bài tập riêng.",
};

export type AccountStatus = "HOAT_DONG" | "BI_KHOA" | "CHO_KICH_HOAT";

export const STATUS_LABEL: Record<AccountStatus, string> = {
  HOAT_DONG: "Hoạt động",
  BI_KHOA: "Bị khóa",
  CHO_KICH_HOAT: "Chờ kích hoạt",
};

export interface Account {
  id: string;
  code: string; // TK-0001
  fullName: string;
  phone: string; // chỉ gồm chữ số, ví dụ 0901234567
  email?: string;
  role: RoleCode;
  status: AccountStatus;
  password: string; // CHỈ DÙNG CHO MOCK
}

export interface RoleRequest {
  id: string;
  accountId: string;
  requestedRole: RoleCode;
  reason: string;
  createdAt: string;
}

export type CategoryGroup = "SUBJECT" | "GRADE" | "AREA";

export interface CategoryItem {
  id: string;
  group: CategoryGroup;
  name: string;
  description: string;
  active: boolean;
}

export interface CenterInfo {
  displayName: string;
  supportEmail: string;
  phone: string;
}

export interface DbState {
  accounts: Account[];
  roleRequests: RoleRequest[];
  categories: CategoryItem[];
  center: CenterInfo;
}
