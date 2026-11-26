import { BadRequestException, ConflictException } from '@nestjs/common';
import {
  HinhThucDay,
  LoaiHoSoNangLuc,
  TrangThaiGiaSu,
} from '../../common/enums/gia-su.enum.js';
import type { CapHoc } from '../../common/enums/mon-hoc.enum.js';
import { VaiTro } from '../../common/enums/tai-khoan.enum.js';

/**
 * Quy tắc nghiệp vụ hồ sơ gia sư (Mục 4.2.3–4.2.5, 6.2) viết dạng hàm thuần
 * để test không cần Nest/DB. Service chỉ gọi lại các hàm này.
 */

/** NhatKyThayDoi.loaiDoiTuong của hồ sơ gia sư; maBanGhi = mã GSxxxxx. */
export const LOAI_DOI_TUONG_GIA_SU = 'GiaSu';

/** NhatKyThayDoi.hanhDong của module gia sư. */
export const HanhDongGiaSu = {
  UNG_TUYEN: 'UNG_TUYEN',
  CAP_NHAT_HO_SO: 'CAP_NHAT_HO_SO',
  CAP_NHAT_MON_DAY: 'CAP_NHAT_MON_DAY',
  CAP_NHAT_LICH_RANH: 'CAP_NHAT_LICH_RANH',
  DUYET: 'DUYET',
  TU_CHOI: 'TU_CHOI',
} as const;

/** Chốt 23/11: gia sư tự sửa hồ sơ ở các trạng thái này; DIEU_PHOI sửa mọi trạng thái. */
export const TRANG_THAI_GIA_SU_TU_SUA: readonly TrangThaiGiaSu[] = [
  TrangThaiGiaSu.CHO_DUYET,
  TrangThaiGiaSu.DANG_HOAT_DONG,
  TrangThaiGiaSu.TAM_NGUNG,
];

export function kiemTraDuocSua(
  vaiTro: VaiTro,
  trangThai: TrangThaiGiaSu,
): void {
  if (vaiTro === VaiTro.GIA_SU && !TRANG_THAI_GIA_SU_TU_SUA.includes(trangThai)) {
    throw new ConflictException(
      'Hồ sơ đã bị từ chối hoặc ngừng hợp tác, không thể tự sửa; vui lòng liên hệ trung tâm',
    );
  }
}

// ---------- Giờ (cột TIME) và ngày (cột DATE) ----------

const GIO_PHUT = /^(\d{2}):(\d{2})$/;

/** 'HH:mm' → số phút từ 00:00. */
export function phutTrongNgay(gio: string): number {
  const khop = GIO_PHUT.exec(gio);
  if (!khop) throw new BadRequestException(`Giờ không hợp lệ: ${gio}`);
  return Number(khop[1]) * 60 + Number(khop[2]);
}

/** Prisma đọc/ghi cột TIME bằng Date ngày 1970-01-01 theo UTC. */
export function gioSangDate(gio: string): Date {
  return new Date(`1970-01-01T${gio}:00.000Z`);
}

export function dateSangGio(date: Date): string {
  return date.toISOString().slice(11, 16);
}

/** Cột DATE: 'YYYY-MM-DD' ↔ Date 00:00 UTC, không lệch ngày theo múi giờ máy chủ. */
export function ngaySangDate(ngay: string): Date {
  return new Date(`${ngay}T00:00:00.000Z`);
}

export function dateSangNgay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Ngày hôm nay theo giờ Việt Nam, dạng YYYY-MM-DD. */
export function homNayTaiVietNam(bayGio = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(bayGio);
}

// ---------- Lịch rảnh ----------

export interface KhungGio {
  thu: number;
  gioBatDau: string;
  gioKetThuc: string;
}

/**
 * Giờ kết thúc phải sau giờ bắt đầu; các khung cùng thứ không chồng nhau.
 * Hai khung chạm mép (18:00–19:30 và 19:30–21:00) được phép.
 */
export function kiemTraLichRanh(lichRanh: readonly KhungGio[]): void {
  const theoThu = new Map<number, { bd: number; kt: number; nhan: string }[]>();
  for (const khung of lichRanh) {
    const bd = phutTrongNgay(khung.gioBatDau);
    const kt = phutTrongNgay(khung.gioKetThuc);
    const nhan = `${tenThu(khung.thu)} ${khung.gioBatDau}–${khung.gioKetThuc}`;
    if (kt <= bd) {
      throw new BadRequestException(
        `Khung ${nhan}: giờ kết thúc phải sau giờ bắt đầu`,
      );
    }
    const dsThu = theoThu.get(khung.thu) ?? [];
    dsThu.push({ bd, kt, nhan });
    theoThu.set(khung.thu, dsThu);
  }
  for (const dsThu of theoThu.values()) {
    dsThu.sort((a, b) => a.bd - b.bd);
    for (let i = 1; i < dsThu.length; i += 1) {
      if (dsThu[i].bd < dsThu[i - 1].kt) {
        throw new BadRequestException(
          `Lịch rảnh bị chồng giờ: ${dsThu[i - 1].nhan} và ${dsThu[i].nhan}`,
        );
      }
    }
  }
}

/** Sắp theo thứ rồi giờ bắt đầu (thứ tự trả về của API lịch rảnh). */
export function sapXepLichRanh<T extends KhungGio>(lichRanh: readonly T[]): T[] {
  return [...lichRanh].sort(
    (a, b) =>
      a.thu - b.thu ||
      phutTrongNgay(a.gioBatDau) - phutTrongNgay(b.gioBatDau),
  );
}

function tenThu(thu: number): string {
  return thu === 7 ? 'Chủ nhật' : `Thứ ${thu + 1}`;
}

// ---------- Hình thức dạy, khu vực ----------

export function kiemTraKhuVuc(
  hinhThucDay: HinhThucDay,
  khuVucNhanDay: readonly string[],
): void {
  if (hinhThucDay !== HinhThucDay.ONLINE && khuVucNhanDay.length === 0) {
    throw new BadRequestException(
      'Cần ít nhất 1 khu vực nhận dạy khi dạy tại nhà (TAI_NHA hoặc CA_HAI)',
    );
  }
}

// ---------- Giáo viên (TT 29/2024) và giấy tờ ----------

/** Giáo viên: tự khai là giáo viên công lập hoặc trình độ hiện tại là "Giáo viên". */
export function laGiaoVien(
  trinhDo: string,
  laGiaoVienCongLap: boolean | null | undefined,
): boolean {
  return (
    laGiaoVienCongLap === true ||
    trinhDo.trim().toLocaleLowerCase('vi') === 'giáo viên'
  );
}

export function kiemTraDonViCongTac(
  giaoVien: boolean,
  donViCongTac: string | null | undefined,
): void {
  if (giaoVien && !donViCongTac?.trim()) {
    throw new BadRequestException(
      'Giáo viên cần khai báo đơn vị công tác (TT 29/2024)',
    );
  }
}

export interface GiayTo {
  loai: LoaiHoSoNangLuc;
  ngayCap: string;
  ngayHetHan?: string | null;
}

/**
 * Mục 6.2: bắt buộc thẻ sinh viên còn hạn hoặc bằng tốt nghiệp; giáo viên
 * thêm bằng/chứng chỉ sư phạm hoặc xác nhận nơi công tác.
 * Ngày so sánh dạng chuỗi YYYY-MM-DD (đúng thứ tự từ điển).
 */
export function kiemTraGiayTo(
  giayTo: readonly GiayTo[],
  giaoVien: boolean,
  homNay: string,
): void {
  for (const gt of giayTo) {
    if (gt.ngayCap > homNay) {
      throw new BadRequestException('Ngày cấp giấy tờ không được sau hôm nay');
    }
    if (gt.ngayHetHan && gt.ngayHetHan < gt.ngayCap) {
      throw new BadRequestException(
        'Ngày hết hạn giấy tờ không được trước ngày cấp',
      );
    }
  }
  const coTheSinhVienConHan = giayTo.some(
    (gt) =>
      gt.loai === LoaiHoSoNangLuc.THE_SINH_VIEN &&
      (!gt.ngayHetHan || gt.ngayHetHan >= homNay),
  );
  const coBangTotNghiep = giayTo.some(
    (gt) => gt.loai === LoaiHoSoNangLuc.BANG_TOT_NGHIEP,
  );
  if (!coTheSinhVienConHan && !coBangTotNghiep) {
    throw new BadRequestException(
      'Cần thẻ sinh viên còn hạn hoặc bằng tốt nghiệp',
    );
  }
  if (
    giaoVien &&
    !giayTo.some(
      (gt) =>
        gt.loai === LoaiHoSoNangLuc.CHUNG_CHI_SU_PHAM ||
        gt.loai === LoaiHoSoNangLuc.XAC_NHAN_NOI_CONG_TAC,
    )
  ) {
    throw new BadRequestException(
      'Giáo viên cần nộp bằng/chứng chỉ sư phạm hoặc xác nhận nơi công tác',
    );
  }
}

// ---------- Môn dạy ----------

export interface MonDayYeuCau {
  monHocId: number;
  capHoc: readonly CapHoc[];
}

export interface MonHocDanhMuc {
  id: number;
  ma: string;
  ten: string;
  capHocApDung: readonly string[];
  dangSuDung: boolean;
}

/**
 * Môn phải có trong danh mục, đang sử dụng; cấp dạy nằm trong cấp học áp dụng
 * của môn (danh mục đã bảo đảm Tiểu học chỉ cho nhóm năng khiếu – TT 29).
 */
export function kiemTraMonDay(
  monDay: readonly MonDayYeuCau[],
  danhMuc: readonly MonHocDanhMuc[],
): Map<number, MonHocDanhMuc> {
  const theoId = new Map(danhMuc.map((mon) => [mon.id, mon]));
  for (const { monHocId, capHoc } of monDay) {
    const mon = theoId.get(monHocId);
    if (!mon || !mon.dangSuDung) {
      throw new BadRequestException(
        `Môn học id=${monHocId} không tồn tại hoặc đã ngừng sử dụng`,
      );
    }
    const khongApDung = capHoc.filter((cap) => !mon.capHocApDung.includes(cap));
    if (khongApDung.length > 0) {
      throw new BadRequestException(
        `Môn ${mon.ten} không áp dụng cho cấp ${khongApDung.join(', ')}`,
      );
    }
  }
  return theoId;
}

// ---------- Mã nội bộ của bảng con (cột ma @unique, không xuất ra DTO) ----------

/** MonDay @@unique(giaSuId, monHocId) → GS00016-MH01 luôn duy nhất. */
export function maMonDay(maGiaSu: string, maMon: string): string {
  return `${maGiaSu}-${maMon}`;
}

/**
 * LichRanh @@unique(giaSuId, thu, gioBatDau, gioKetThuc) → GS00016-LR1-1800-2100
 * (LR + thu ISO, tránh nhầm "T2" = Thứ Hai trong tiếng Việt).
 */
export function maLichRanh(maGiaSu: string, khung: KhungGio): string {
  const gio = (g: string) => g.replace(':', '');
  return `${maGiaSu}-LR${khung.thu}-${gio(khung.gioBatDau)}-${gio(khung.gioKetThuc)}`;
}

/** Giấy tờ chỉ tạo một lần lúc ứng tuyển → đánh số theo thứ tự nộp. */
export function maHoSoNangLuc(maGiaSu: string, thuTu: number): string {
  return `${maGiaSu}-HS${String(thuTu).padStart(2, '0')}`;
}
