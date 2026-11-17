/** Nhóm môn (báo cáo Mục 4.2.6). */
export enum NhomMon {
  VAN_HOA = 'VAN_HOA',
  NGOAI_NGU = 'NGOAI_NGU',
  NANG_KHIEU_KY_NANG = 'NANG_KHIEU_KY_NANG',
  LUYEN_THI = 'LUYEN_THI',
}

/**
 * Cấp học áp dụng (báo cáo Bảng 8 – đối tượng học viên).
 * TIEU_HOC chỉ dùng cho nhóm NANG_KHIEU_KY_NANG (TT 29/2024).
 */
export enum CapHoc {
  TIEU_HOC = 'TIEU_HOC',
  THCS = 'THCS',
  THPT = 'THPT',
  DAI_HOC = 'DAI_HOC',
  NGUOI_DI_LAM = 'NGUOI_DI_LAM',
}

/** Môn đã có lớp không được xóa, chỉ chuyển NGUNG_SU_DUNG. */
export enum TrangThaiMonHoc {
  DANG_SU_DUNG = 'DANG_SU_DUNG',
  NGUNG_SU_DUNG = 'NGUNG_SU_DUNG',
}
