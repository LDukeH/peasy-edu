/**
 * Vai trò tài khoản – MVP gộp 4 nhóm giao diện (kế hoạch nhóm, mục 1):
 * QUAN_LY = Chủ TT + QTV + Kế toán; DIEU_PHOI = NV điều phối.
 * Khi schema Prisma (W1-BE1) có enum cùng tên thì chuyển sang import từ '@prisma/client'.
 */
export enum VaiTro {
  QUAN_LY = 'QUAN_LY',
  DIEU_PHOI = 'DIEU_PHOI',
  GIA_SU = 'GIA_SU',
  PHU_HUYNH = 'PHU_HUYNH',
}

export enum TrangThaiTaiKhoan {
  HOAT_DONG = 'HOAT_DONG',
  BI_KHOA = 'BI_KHOA',
}
