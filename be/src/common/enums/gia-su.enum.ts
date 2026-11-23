/** Giới tính (báo cáo Mục 4.2.3; dùng chung cho gia sư và học viên). */
export enum GioiTinh {
  NAM = 'NAM',
  NU = 'NU',
}

/** Hình thức nhận dạy của gia sư (Mục 4.2.3) – khớp enum Prisma HinhThucDay. */
export enum HinhThucDay {
  TAI_NHA = 'TAI_NHA',
  ONLINE = 'ONLINE',
  CA_HAI = 'CA_HAI',
}

/** Trạng thái gia sư (Bảng 15) – khớp enum Prisma TrangThaiGiaSu. */
export enum TrangThaiGiaSu {
  CHO_DUYET = 'CHO_DUYET',
  DANG_HOAT_DONG = 'DANG_HOAT_DONG',
  TAM_NGUNG = 'TAM_NGUNG',
  NGUNG_HOP_TAC = 'NGUNG_HOP_TAC',
  BI_TU_CHOI = 'BI_TU_CHOI',
}

/** Trạng thái xác minh giấy tờ (Mục 4.2.4) – khớp enum Prisma TrangThaiHoSoNangLuc. */
export enum TrangThaiHoSoNangLuc {
  CHUA_XAC_MINH = 'CHUA_XAC_MINH',
  DA_XAC_MINH = 'DA_XAC_MINH',
  KHONG_HOP_LE = 'KHONG_HOP_LE',
}

/**
 * Loại giấy tờ trong hồ sơ năng lực (Mục 4.2.4, 6.2).
 * Bắt buộc có THE_SINH_VIEN hoặc BANG_TOT_NGHIEP; giáo viên thêm
 * CHUNG_CHI_SU_PHAM hoặc XAC_NHAN_NOI_CONG_TAC.
 */
export enum LoaiHoSoNangLuc {
  THE_SINH_VIEN = 'THE_SINH_VIEN',
  BANG_TOT_NGHIEP = 'BANG_TOT_NGHIEP',
  CHUNG_CHI_SU_PHAM = 'CHUNG_CHI_SU_PHAM',
  XAC_NHAN_NOI_CONG_TAC = 'XAC_NHAN_NOI_CONG_TAC',
  CHUNG_CHI_NGOAI_NGU = 'CHUNG_CHI_NGOAI_NGU',
  CHUNG_CHI_KHAC = 'CHUNG_CHI_KHAC',
}

/** Kết quả NV duyệt hồ sơ ứng tuyển (Mục 6.2, bước 5). */
export enum KetQuaDuyetGiaSu {
  DUYET = 'DUYET',
  TU_CHOI = 'TU_CHOI',
}
