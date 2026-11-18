import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { VaiTro } from '../enums/tai-khoan.enum.js';
import type { AuthUser } from './auth-user.js';

/** Các tài nguyên có quyền "Của mình" theo Bảng 9. */
export type TaiNguyenCuaMinh =
  | 'PHU_HUYNH'
  | 'HOC_VIEN'
  | 'GIA_SU'
  | 'YEU_CAU'
  | 'LOP_HOC'
  | 'BUOI_HOC'
  | 'PHIEU_HOC_PHI'
  | 'BANG_THU_LAO';

/** Học viên của phụ huynh đang đăng nhập, hoặc chính học viên dùng tài khoản riêng. */
const hocVienCuaMinh = (taiKhoanId: number): Prisma.HocVienWhereInput => ({
  OR: [{ taiKhoanId }, { phuHuynh: { taiKhoanId } }],
});

const nguoiThanhToanCuaMinh = (
  taiKhoanId: number,
): Prisma.NguoiThanhToanWhereInput => ({
  OR: [
    { phuHuynh: { taiKhoanId } },
    { hocVien: hocVienCuaMinh(taiKhoanId) },
  ],
});

@Injectable()
export class OwnershipService {
  constructor(private readonly prisma: PrismaService) {}

  /** Tài nguyên không áp dụng cho vai trò này → false (mặc định từ chối). */
  async laCuaMinh(
    user: AuthUser,
    taiNguyen: TaiNguyenCuaMinh,
    id: number,
  ): Promise<boolean> {
    const laGiaSu = user.vaiTro === VaiTro.GIA_SU;
    const laPhuHuynh = user.vaiTro === VaiTro.PHU_HUYNH;
    const taiKhoanId = user.id;
    let soBanGhi = 0;

    switch (taiNguyen) {
      case 'PHU_HUYNH':
        if (laPhuHuynh) {
          soBanGhi = await this.prisma.phuHuynh.count({
            where: { id, taiKhoanId },
          });
        }
        break;
      case 'HOC_VIEN':
        if (laPhuHuynh) {
          soBanGhi = await this.prisma.hocVien.count({
            where: { id, ...hocVienCuaMinh(taiKhoanId) },
          });
        }
        break;
      case 'GIA_SU':
        if (laGiaSu) {
          soBanGhi = await this.prisma.giaSu.count({
            where: { id, taiKhoanId },
          });
        }
        break;
      case 'YEU_CAU':
        if (laPhuHuynh) {
          soBanGhi = await this.prisma.yeuCau.count({
            where: { id, nguoiThanhToan: nguoiThanhToanCuaMinh(taiKhoanId) },
          });
        }
        break;
      case 'LOP_HOC':
        if (laGiaSu) {
          soBanGhi = await this.prisma.lopHoc.count({
            where: { id, phanCong: { some: { giaSu: { taiKhoanId } } } },
          });
        } else if (laPhuHuynh) {
          soBanGhi = await this.prisma.lopHoc.count({
            where: {
              id,
              ghiDanh: { some: { hocVien: hocVienCuaMinh(taiKhoanId) } },
            },
          });
        }
        break;
      case 'BUOI_HOC':
        if (laGiaSu) {
          soBanGhi = await this.prisma.buoiHoc.count({
            where: { id, giaSuThucDay: { taiKhoanId } },
          });
        } else if (laPhuHuynh) {
          soBanGhi = await this.prisma.buoiHoc.count({
            where: {
              id,
              lopHoc: {
                ghiDanh: { some: { hocVien: hocVienCuaMinh(taiKhoanId) } },
              },
            },
          });
        }
        break;
      case 'PHIEU_HOC_PHI':
        if (laPhuHuynh) {
          soBanGhi = await this.prisma.phieuHocPhi.count({
            where: { id, nguoiThanhToan: nguoiThanhToanCuaMinh(taiKhoanId) },
          });
        }
        break;
      case 'BANG_THU_LAO':
        if (laGiaSu) {
          soBanGhi = await this.prisma.bangThuLao.count({
            where: { id, giaSu: { taiKhoanId } },
          });
        }
        break;
    }
    return soBanGhi > 0;
  }
}
