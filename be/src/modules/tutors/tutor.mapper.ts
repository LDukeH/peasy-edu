import type { Prisma } from '@prisma/client';
import {
  cheCccd,
  cheSoTaiKhoan,
} from '../../common/bao-mat/ma-hoa-du-lieu.js';
import type {
  GioiTinh,
  HinhThucDay,
  LoaiHoSoNangLuc,
  TrangThaiGiaSu,
  TrangThaiHoSoNangLuc,
} from '../../common/enums/gia-su.enum.js';
import type { CapHoc } from '../../common/enums/mon-hoc.enum.js';
import type { HoSoNangLucDto } from './dto/ho-so-nang-luc.dto.js';
import type { LichRanhDto } from './dto/lich-ranh.dto.js';
import type { MonDayDto } from './dto/mon-day.dto.js';
import type {
  TaiKhoanNganHangDto,
  TutorDetailDto,
  TutorDto,
} from './dto/tutor.dto.js';
import {
  dateSangGio,
  dateSangNgay,
  sapXepLichRanh,
} from './quy-tac-gia-su.js';

export const MON_DAY_INCLUDE = {
  monHoc: { select: { ma: true, ten: true } },
} satisfies Prisma.MonDayInclude;

export const GIA_SU_DANH_SACH_INCLUDE = {
  monDay: { include: MON_DAY_INCLUDE, orderBy: { monHoc: { ma: 'asc' } } },
} satisfies Prisma.GiaSuInclude;

export const GIA_SU_CHI_TIET_INCLUDE = {
  ...GIA_SU_DANH_SACH_INCLUDE,
  lichRanh: true,
  hoSoNangLuc: { orderBy: { id: 'asc' } },
  nguoiDuyet: { select: { hoTen: true } },
} satisfies Prisma.GiaSuInclude;

type MonDayKemMon = Prisma.MonDayGetPayload<{ include: typeof MON_DAY_INCLUDE }>;
export type GiaSuDanhSach = Prisma.GiaSuGetPayload<{
  include: typeof GIA_SU_DANH_SACH_INCLUDE;
}>;
export type GiaSuChiTiet = Prisma.GiaSuGetPayload<{
  include: typeof GIA_SU_CHI_TIET_INCLUDE;
}>;

/** Bản rõ của GiaSu.taiKhoanNganHangMaHoa (một cột Bytes chứa JSON). */
export interface TaiKhoanNganHangBanRo {
  nganHang: string;
  soTaiKhoan: string;
  chuTaiKhoan: string;
}

/** Phần chỉ có sau khi giải mã hoặc tra nhật ký, service truyền vào. */
export interface DuLieuChiTietBoSung {
  soCccd: string;
  taiKhoanNganHang: TaiKhoanNganHangBanRo | null;
  lyDoTuChoi: string | null;
}

export function toMonDayDto(monDay: MonDayKemMon): MonDayDto {
  return {
    id: monDay.id,
    monHocId: monDay.monHocId,
    maMon: monDay.monHoc.ma,
    tenMon: monDay.monHoc.ten,
    capHoc: monDay.capLop as CapHoc[],
  };
}

export function toLichRanhDto(lichRanh: {
  id: number;
  thu: number;
  gioBatDau: Date;
  gioKetThuc: Date;
}): LichRanhDto {
  return {
    id: lichRanh.id,
    thu: lichRanh.thu,
    gioBatDau: dateSangGio(lichRanh.gioBatDau),
    gioKetThuc: dateSangGio(lichRanh.gioKetThuc),
  };
}

function toHoSoNangLucDto(
  hoSo: GiaSuChiTiet['hoSoNangLuc'][number],
): HoSoNangLucDto {
  return {
    id: hoSo.id,
    loai: hoSo.loai as LoaiHoSoNangLuc,
    ten: hoSo.ten,
    noiCap: hoSo.noiCap,
    ngayCap: dateSangNgay(hoSo.ngayCap),
    ngayHetHan: hoSo.ngayHetHan ? dateSangNgay(hoSo.ngayHetHan) : null,
    tep: hoSo.tep,
    trangThai: hoSo.trangThai as TrangThaiHoSoNangLuc,
  };
}

/** Không bao giờ trả số tài khoản đầy đủ ra API. */
export function cheTaiKhoanNganHang(
  taiKhoan: TaiKhoanNganHangBanRo,
): TaiKhoanNganHangDto {
  return {
    nganHang: taiKhoan.nganHang,
    soTaiKhoanDaChe: cheSoTaiKhoan(taiKhoan.soTaiKhoan),
    chuTaiKhoan: taiKhoan.chuTaiKhoan,
  };
}

export function toTutorDto(giaSu: GiaSuDanhSach): TutorDto {
  return {
    id: giaSu.id,
    ma: giaSu.ma,
    hoTen: giaSu.hoTen,
    ngaySinh: dateSangNgay(giaSu.ngaySinh),
    gioiTinh: giaSu.gioiTinh as GioiTinh,
    soDienThoai: giaSu.soDienThoai,
    email: giaSu.email,
    anhChanDung: giaSu.anhChanDung,
    trinhDo: giaSu.trinhDo,
    truongDaoTao: giaSu.truongDaoTao,
    chuyenNganh: giaSu.chuyenNganh,
    hinhThucDay: giaSu.hinhThucDay as HinhThucDay,
    khuVucNhanDay: giaSu.khuVucNhanDay,
    thuLaoMongMuon: giaSu.thuLaoMongMuon,
    monDay: giaSu.monDay.map(toMonDayDto),
    trangThai: giaSu.trangThai as TrangThaiGiaSu,
    ngayUngTuyen: giaSu.thoiDiemGhiNhanDongY,
  };
}

/** CCCD chỉ rời server dưới dạng đã che; bản mã/HMAC không bao giờ ra DTO. */
export function toTutorDetailDto(
  giaSu: GiaSuChiTiet,
  boSung: DuLieuChiTietBoSung,
): TutorDetailDto {
  return Object.assign(toTutorDto(giaSu), {
    soCccdDaChe: cheCccd(boSung.soCccd),
    anhCccdMatTruoc: giaSu.anhCccdMatTruoc,
    anhCccdMatSau: giaSu.anhCccdMatSau,
    diaChi: giaSu.diaChi,
    nienKhoa: giaSu.nienKhoa,
    donViCongTac: giaSu.donViCongTac,
    laGiaoVienCongLap: giaSu.laGiaoVienCongLap,
    soLopToiDa: giaSu.soLopToiDa,
    gioiThieu: giaSu.gioiThieu,
    kinhNghiem: giaSu.kinhNghiem,
    taiKhoanNganHang: boSung.taiKhoanNganHang
      ? cheTaiKhoanNganHang(boSung.taiKhoanNganHang)
      : null,
    ngayDuyet: giaSu.ngayDuyet,
    nguoiDuyet: giaSu.nguoiDuyet?.hoTen ?? null,
    lyDoTuChoi: boSung.lyDoTuChoi,
    lichRanh: sapXepLichRanh(giaSu.lichRanh.map(toLichRanhDto)),
    hoSoNangLuc: giaSu.hoSoNangLuc.map(toHoSoNangLucDto),
  });
}
