/** Contract enums; không import Prisma vào tầng DTO. */
export enum HinhThucHoc {
  TAI_NHA = 'TAI_NHA',
  ONLINE = 'ONLINE',
}
/** Đủ vòng đời để đọc/lọc; không đồng nghĩa được cập nhật mọi giá trị. */
export enum TrangThaiYeuCau {
  MOI = 'MOI',
  DA_TU_VAN = 'DA_TU_VAN',
  DANG_TIM_GS = 'DANG_TIM_GS',
  DA_DE_XUAT = 'DA_DE_XUAT',
  DANG_HOC_THU = 'DANG_HOC_THU',
  THANH_CONG = 'THANH_CONG',
  HUY = 'HUY',
}
export enum TrangThaiCapNhatYeuCau {
  DA_TU_VAN = 'DA_TU_VAN',
  DANG_TIM_GS = 'DANG_TIM_GS',
  HUY = 'HUY',
}
export enum LoaiDangKyYeuCau {
  PHU_HUYNH = 'PHU_HUYNH',
  BAN_THAN = 'BAN_THAN',
}
