import type { Prisma } from '@prisma/client';
import type {
  TrangThaiTaiKhoan,
  VaiTro,
} from '../../common/enums/tai-khoan.enum.js';
import type { UserDto } from './dto/user.dto.js';

const HO_SO_SELECT = {
  select: { ma: true, hoTen: true, email: true, soDienThoai: true },
} as const;

/** Họ tên, email, SĐT nằm ở bảng hồ sơ liên kết, không nằm trong TaiKhoan. */
export const TAI_KHOAN_INCLUDE = {
  vaiTro: { select: { ma: true } },
  nhanVien: HO_SO_SELECT,
  phuHuynh: HO_SO_SELECT,
  giaSu: HO_SO_SELECT,
  hocVien: HO_SO_SELECT,
} satisfies Prisma.TaiKhoanInclude;

export type TaiKhoanDayDu = Prisma.TaiKhoanGetPayload<{
  include: typeof TAI_KHOAN_INCLUDE;
}>;

/** Liệt kê từng trường để matKhauHash không bao giờ lọt ra response. */
export function toUserDto(taiKhoan: TaiKhoanDayDu): UserDto {
  const hoSo =
    taiKhoan.nhanVien ??
    taiKhoan.phuHuynh ??
    taiKhoan.giaSu ??
    taiKhoan.hocVien;
  return {
    id: taiKhoan.id,
    tenDangNhap: taiKhoan.tenDangNhap,
    hoTen: hoSo?.hoTen ?? taiKhoan.tenDangNhap,
    email: hoSo?.email ?? null,
    soDienThoai: hoSo?.soDienThoai ?? null,
    vaiTro: taiKhoan.vaiTro.ma as VaiTro,
    trangThai: taiKhoan.trangThai as TrangThaiTaiKhoan,
    maDoiTuong: hoSo?.ma ?? null,
    lanDangNhapCuoi: taiKhoan.lanDangNhapCuoi,
    ngayTao: taiKhoan.ngayTao,
  };
}
