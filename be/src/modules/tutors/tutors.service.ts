import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { AuthUser } from '../../common/auth/auth-user.js';
import type { BytesDb } from '../../common/bao-mat/ma-hoa-du-lieu.js';
import { MaHoaDuLieuService } from '../../common/bao-mat/ma-hoa-du-lieu.service.js';
import {
  HinhThucDay,
  KetQuaDuyetGiaSu,
  TrangThaiGiaSu,
  TrangThaiHoSoNangLuc,
} from '../../common/enums/gia-su.enum.js';
import { VaiTro } from '../../common/enums/tai-khoan.enum.js';
import { maTiepTheo, thuLaiKhiTrungMa } from '../../common/ma-nghiep-vu.js';
import { maLoiPrisma, truongBiTrung } from '../../common/prisma-errors.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { BCRYPT_ROUNDS } from '../auth/auth.constants.js';
import type {
  ApplyTutorDto,
  ApplyTutorResultDto,
} from './dto/apply-tutor.dto.js';
import type {
  LichRanhDto,
  LichRanhInputDto,
  ReplaceTutorAvailabilityDto,
} from './dto/lich-ranh.dto.js';
import type { ListTutorsQueryDto } from './dto/list-tutors-query.dto.js';
import type {
  MonDayDto,
  MonDayInputDto,
  ReplaceTutorSubjectsDto,
} from './dto/mon-day.dto.js';
import type { ReviewTutorDto } from './dto/review-tutor.dto.js';
import type { TutorListResponseDto } from './dto/tutor-list-response.dto.js';
import type { TutorDetailDto } from './dto/tutor.dto.js';
import type { UpdateTutorDto } from './dto/update-tutor.dto.js';
import {
  HanhDongGiaSu,
  LOAI_DOI_TUONG_GIA_SU,
  type MonHocDanhMuc,
  gioSangDate,
  homNayTaiVietNam,
  kiemTraDonViCongTac,
  kiemTraDuocSua,
  kiemTraGiayTo,
  kiemTraKhuVuc,
  kiemTraLichRanh,
  kiemTraMonDay,
  laGiaoVien,
  maHoSoNangLuc,
  maLichRanh,
  maMonDay,
  ngaySangDate,
  sapXepLichRanh,
} from './quy-tac-gia-su.js';
import {
  GIA_SU_CHI_TIET_INCLUDE,
  GIA_SU_DANH_SACH_INCLUDE,
  type GiaSuChiTiet,
  MON_DAY_INCLUDE,
  type TaiKhoanNganHangBanRo,
  cheTaiKhoanNganHang,
  toLichRanhDto,
  toMonDayDto,
  toTutorDetailDto,
  toTutorDto,
} from './tutor.mapper.js';

/** Các trường PATCH /tutors/:id sửa thẳng vào bảng GiaSu (cùng tên cột). */
const TRUONG_HO_SO_SUA_DUOC = [
  'soDienThoai',
  'email',
  'diaChi',
  'anhChanDung',
  'trinhDo',
  'truongDaoTao',
  'chuyenNganh',
  'nienKhoa',
  'donViCongTac',
  'laGiaoVienCongLap',
  'hinhThucDay',
  'khuVucNhanDay',
  'thuLaoMongMuon',
  'gioiThieu',
  'kinhNghiem',
] as const;
type TruongHoSo = (typeof TRUONG_HO_SO_SUA_DUOC)[number];

const KHONG_TIM_THAY = 'Không tìm thấy gia sư';
const MON_DAY_THEO_MA = { monHoc: { ma: 'asc' } } as const;

interface MucNhatKy {
  truong: string;
  giaTriCu: unknown;
  giaTriMoi: unknown;
}

function chuanHoaEmail(email: string): string {
  return email.trim().toLowerCase();
}

function giongNhau(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function banGhiNhatKy(
  taiKhoanId: number | null,
  hanhDong: string,
  maGiaSu: string,
  muc: MucNhatKy,
  lyDo: string | null = null,
): Prisma.NhatKyThayDoiCreateManyInput {
  // Cột Json nullable: bỏ trống (undefined) thay vì null để Prisma ghi NULL.
  const json = (giaTri: unknown) =>
    giaTri === null || giaTri === undefined
      ? undefined
      : (giaTri as Prisma.InputJsonValue);
  return {
    taiKhoanId,
    hanhDong,
    loaiDoiTuong: LOAI_DOI_TUONG_GIA_SU,
    maBanGhi: maGiaSu,
    truong: muc.truong,
    giaTriCu: json(muc.giaTriCu),
    giaTriMoi: json(muc.giaTriMoi),
    lyDo,
  };
}

function chuyenLoiTrung(error: unknown): unknown {
  if (maLoiPrisma(error) !== 'P2002') return error;
  const truong = truongBiTrung(error);
  if (truong.includes('cccdHmac')) {
    return new ConflictException('Số CCCD đã có hồ sơ gia sư');
  }
  if (truong.includes('tenDangNhap')) {
    return new ConflictException(
      'Số điện thoại đã là tên đăng nhập của tài khoản khác',
    );
  }
  if (truong.includes('soDienThoai')) {
    return new ConflictException('Số điện thoại đã được sử dụng');
  }
  if (truong.includes('email')) {
    return new ConflictException('Email đã được sử dụng');
  }
  return new ConflictException('Dữ liệu đã tồn tại');
}

const tomTatMonDay = (monDay: { monHoc: { ma: string }; capLop: string[] }) => ({
  maMon: monDay.monHoc.ma,
  capHoc: monDay.capLop,
});

@Injectable()
export class TutorsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly maHoa: MaHoaDuLieuService,
  ) {}

  // ---------- Ứng tuyển (công khai) ----------

  async apply(dto: ApplyTutorDto): Promise<ApplyTutorResultDto> {
    const email = chuanHoaEmail(dto.email);
    const khuVucNhanDay = dto.khuVucNhanDay ?? [];
    const lichRanh = dto.lichRanh ?? [];
    kiemTraKhuVuc(dto.hinhThucDay, khuVucNhanDay);
    const giaoVien = laGiaoVien(dto.trinhDo, dto.laGiaoVienCongLap);
    kiemTraDonViCongTac(giaoVien, dto.donViCongTac);
    kiemTraGiayTo(dto.hoSoNangLuc, giaoVien, homNayTaiVietNam());
    kiemTraLichRanh(lichRanh);
    const monHoc = await this.kiemTraMonHoc(dto.monDay);

    const cccdHmac = this.maHoa.bamHmac(dto.soCccd);
    await this.kiemTraTrungKhiUngTuyen(dto.soDienThoai, email, cccdHmac);
    const cccdMaHoa = this.maHoa.maHoa(dto.soCccd);
    const matKhauHash = await bcrypt.hash(dto.matKhau, BCRYPT_ROUNDS);
    const thoiDiem = new Date();

    try {
      const giaSu = await thuLaiKhiTrungMa(async () => {
        const ma = await this.sinhMaGiaSu();
        return this.prisma.$transaction(async (tx) => {
          const taoMoi = await tx.giaSu.create({
            data: {
              ma,
              hoTen: dto.hoTen.trim(),
              ngaySinh: ngaySangDate(dto.ngaySinh),
              gioiTinh: dto.gioiTinh,
              cccdMaHoa,
              cccdHmac,
              anhCccdMatTruoc: dto.anhCccdMatTruoc,
              anhCccdMatSau: dto.anhCccdMatSau,
              soDienThoai: dto.soDienThoai,
              email,
              diaChi: dto.diaChi,
              anhChanDung: dto.anhChanDung,
              trinhDo: dto.trinhDo,
              truongDaoTao: dto.truongDaoTao,
              chuyenNganh: dto.chuyenNganh,
              nienKhoa: dto.nienKhoa,
              donViCongTac: dto.donViCongTac ?? null,
              laGiaoVienCongLap: dto.laGiaoVienCongLap ?? null,
              hinhThucDay: dto.hinhThucDay,
              khuVucNhanDay,
              thuLaoMongMuon: dto.thuLaoMongMuon ?? null,
              gioiThieu: dto.gioiThieu ?? null,
              kinhNghiem: dto.kinhNghiem ?? null,
              trangThai: TrangThaiGiaSu.CHO_DUYET,
              dongYXuLyDuLieu: true,
              thoiDiemGhiNhanDongY: thoiDiem,
              taiKhoan: {
                create: {
                  tenDangNhap: dto.soDienThoai,
                  matKhauHash,
                  vaiTro: { connect: { ma: VaiTro.GIA_SU } },
                },
              },
              monDay: { create: this.duLieuMonDay(ma, dto.monDay, monHoc) },
              lichRanh: { create: this.duLieuLichRanh(ma, lichRanh) },
              hoSoNangLuc: {
                create: dto.hoSoNangLuc.map((hoSo, i) => ({
                  ma: maHoSoNangLuc(ma, i + 1),
                  loai: hoSo.loai,
                  ten: hoSo.ten,
                  noiCap: hoSo.noiCap,
                  ngayCap: ngaySangDate(hoSo.ngayCap),
                  ngayHetHan: hoSo.ngayHetHan
                    ? ngaySangDate(hoSo.ngayHetHan)
                    : null,
                  tep: hoSo.tep,
                })),
              },
            },
            select: { ma: true, hoTen: true, taiKhoanId: true },
          });
          await tx.nhatKyThayDoi.create({
            data: banGhiNhatKy(taoMoi.taiKhoanId, HanhDongGiaSu.UNG_TUYEN, ma, {
              truong: 'trangThai',
              giaTriCu: null,
              giaTriMoi: TrangThaiGiaSu.CHO_DUYET,
            }),
          });
          return taoMoi;
        });
      });
      return {
        ma: giaSu.ma,
        hoTen: giaSu.hoTen,
        trangThai: TrangThaiGiaSu.CHO_DUYET,
        tenDangNhap: dto.soDienThoai,
        ngayUngTuyen: thoiDiem,
      };
    } catch (error) {
      if (maLoiPrisma(error) === 'P2025') {
        throw new InternalServerErrorException(
          'Chưa có dữ liệu vai trò, cần chạy seed',
        );
      }
      throw chuyenLoiTrung(error);
    }
  }

  // ---------- Xem ----------

  async findAll(query: ListTutorsQueryDto): Promise<TutorListResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where = this.dieuKienLoc(query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.giaSu.findMany({
        where,
        include: GIA_SU_DANH_SACH_INCLUDE,
        // Hồ sơ mới nộp trước; bản ghi chưa có thời điểm đồng ý xếp cuối.
        orderBy: [
          { thoiDiemGhiNhanDongY: { sort: 'desc', nulls: 'last' } },
          { id: 'desc' },
        ],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.giaSu.count({ where }),
    ]);
    return { items: items.map(toTutorDto), total, page, pageSize };
  }

  async findMe(user: AuthUser): Promise<TutorDetailDto> {
    const giaSu = await this.prisma.giaSu.findUnique({
      where: { taiKhoanId: user.id },
      include: GIA_SU_CHI_TIET_INCLUDE,
    });
    if (!giaSu) {
      throw new NotFoundException('Tài khoản chưa liên kết hồ sơ gia sư');
    }
    return this.toChiTiet(giaSu);
  }

  async findOne(id: number): Promise<TutorDetailDto> {
    return this.toChiTiet(await this.layChiTiet(id));
  }

  // ---------- Sửa hồ sơ ----------

  async update(
    id: number,
    dto: UpdateTutorDto,
    user: AuthUser,
  ): Promise<TutorDetailDto> {
    const giaSu = await this.layChiTiet(id);
    kiemTraDuocSua(user.vaiTro, giaSu.trangThai as TrangThaiGiaSu);

    const { taiKhoanNganHang, ...thongTin } = dto;
    const moi: UpdateTutorDto = {
      ...thongTin,
      ...(thongTin.email !== undefined && {
        email: chuanHoaEmail(thongTin.email),
      }),
    };

    // Kiểm tra trên dữ liệu sau khi gộp phần sửa vào hồ sơ hiện có.
    kiemTraKhuVuc(
      moi.hinhThucDay ?? (giaSu.hinhThucDay as HinhThucDay),
      moi.khuVucNhanDay ?? giaSu.khuVucNhanDay,
    );
    kiemTraDonViCongTac(
      laGiaoVien(
        moi.trinhDo ?? giaSu.trinhDo,
        moi.laGiaoVienCongLap !== undefined
          ? moi.laGiaoVienCongLap
          : giaSu.laGiaoVienCongLap,
      ),
      moi.donViCongTac !== undefined ? moi.donViCongTac : giaSu.donViCongTac,
    );

    const thayDoi: TruongHoSo[] = TRUONG_HO_SO_SUA_DUOC.filter(
      (truong) =>
        moi[truong] !== undefined && !giongNhau(moi[truong], giaSu[truong]),
    );
    const nhatKy: MucNhatKy[] = thayDoi.map((truong) => ({
      truong,
      giaTriCu: giaSu[truong],
      giaTriMoi: moi[truong],
    }));
    const data = Object.fromEntries(
      thayDoi.map((truong) => [truong, moi[truong]]),
    ) as Prisma.GiaSuUpdateInput;

    if (taiKhoanNganHang) {
      const banRo: TaiKhoanNganHangBanRo = {
        nganHang: taiKhoanNganHang.nganHang.trim(),
        soTaiKhoan: taiKhoanNganHang.soTaiKhoan,
        chuTaiKhoan: taiKhoanNganHang.chuTaiKhoan.trim(),
      };
      const cu = this.docTaiKhoanNganHang(giaSu.taiKhoanNganHangMaHoa);
      if (!giongNhau(cu, banRo)) {
        data.taiKhoanNganHangMaHoa = this.maHoa.maHoa(JSON.stringify(banRo));
        // Nhật ký chỉ lưu số tài khoản đã che.
        nhatKy.push({
          truong: 'taiKhoanNganHang',
          giaTriCu: cu && cheTaiKhoanNganHang(cu),
          giaTriMoi: cheTaiKhoanNganHang(banRo),
        });
      }
    }
    if (nhatKy.length === 0) return this.toChiTiet(giaSu);

    const soDienThoaiMoi = thayDoi.includes('soDienThoai')
      ? moi.soDienThoai
      : undefined;
    const emailMoi = thayDoi.includes('email') ? moi.email : undefined;
    await this.kiemTraTrungKhiSua(giaSu, soDienThoaiMoi, emailMoi);
    // Gia sư đăng nhập bằng SĐT: đổi SĐT thì đổi luôn tên đăng nhập.
    if (soDienThoaiMoi && giaSu.taiKhoanId) {
      data.taiKhoan = { update: { tenDangNhap: soDienThoaiMoi } };
    }

    try {
      const capNhat = await this.prisma.$transaction(async (tx) => {
        const ketQua = await tx.giaSu.update({
          where: { id },
          data,
          include: GIA_SU_CHI_TIET_INCLUDE,
        });
        await tx.nhatKyThayDoi.createMany({
          data: nhatKy.map((muc) =>
            banGhiNhatKy(user.id, HanhDongGiaSu.CAP_NHAT_HO_SO, giaSu.ma, muc),
          ),
        });
        return ketQua;
      });
      return this.toChiTiet(capNhat);
    } catch (error) {
      throw chuyenLoiTrung(error);
    }
  }

  // ---------- Môn dạy, lịch rảnh (thay toàn bộ) ----------

  async replaceSubjects(
    id: number,
    dto: ReplaceTutorSubjectsDto,
    user: AuthUser,
  ): Promise<MonDayDto[]> {
    const giaSu = await this.layCoBan(id);
    kiemTraDuocSua(user.vaiTro, giaSu.trangThai as TrangThaiGiaSu);
    const monHoc = await this.kiemTraMonHoc(dto.monDay);

    const monDay = await this.prisma.$transaction(async (tx) => {
      const cu = await tx.monDay.findMany({
        where: { giaSuId: id },
        include: MON_DAY_INCLUDE,
        orderBy: MON_DAY_THEO_MA,
      });
      const duLieu = this.duLieuMonDay(giaSu.ma, dto.monDay, monHoc);
      const tomTatMoi = duLieu
        .map((md) =>
          tomTatMonDay({
            monHoc: monHoc.get(md.monHocId) as MonHocDanhMuc,
            capLop: md.capLop,
          }),
        )
        .sort((a, b) => a.maMon.localeCompare(b.maMon));
      // Gửi lại đúng danh sách cũ thì không ghi DB, không ghi nhật ký.
      if (giongNhau(cu.map(tomTatMonDay), tomTatMoi)) return cu;

      await tx.monDay.deleteMany({ where: { giaSuId: id } });
      await tx.monDay.createMany({
        data: duLieu.map((md) => ({ ...md, giaSuId: id })),
      });
      await tx.nhatKyThayDoi.create({
        data: banGhiNhatKy(user.id, HanhDongGiaSu.CAP_NHAT_MON_DAY, giaSu.ma, {
          truong: 'monDay',
          giaTriCu: cu.map(tomTatMonDay),
          giaTriMoi: tomTatMoi,
        }),
      });
      return tx.monDay.findMany({
        where: { giaSuId: id },
        include: MON_DAY_INCLUDE,
        orderBy: MON_DAY_THEO_MA,
      });
    });
    return monDay.map(toMonDayDto);
  }

  async replaceAvailability(
    id: number,
    dto: ReplaceTutorAvailabilityDto,
    user: AuthUser,
  ): Promise<LichRanhDto[]> {
    const giaSu = await this.layCoBan(id);
    kiemTraDuocSua(user.vaiTro, giaSu.trangThai as TrangThaiGiaSu);
    kiemTraLichRanh(dto.lichRanh);

    const lichRanh = await this.prisma.$transaction(async (tx) => {
      const cu = sapXepLichRanh((await tx.lichRanh.findMany({
        where: { giaSuId: id },
      })).map(toLichRanhDto));
      const moi = sapXepLichRanh(dto.lichRanh);
      const tomTat = (khung: { thu: number; gioBatDau: string; gioKetThuc: string }) => ({
        thu: khung.thu,
        gioBatDau: khung.gioBatDau,
        gioKetThuc: khung.gioKetThuc,
      });
      if (giongNhau(cu.map(tomTat), moi.map(tomTat))) return cu;

      await tx.lichRanh.deleteMany({ where: { giaSuId: id } });
      await tx.lichRanh.createMany({
        data: this.duLieuLichRanh(giaSu.ma, moi).map((lr) => ({
          ...lr,
          giaSuId: id,
        })),
      });
      await tx.nhatKyThayDoi.create({
        data: banGhiNhatKy(
          user.id,
          HanhDongGiaSu.CAP_NHAT_LICH_RANH,
          giaSu.ma,
          {
            truong: 'lichRanh',
            giaTriCu: cu.map(tomTat),
            giaTriMoi: moi.map(tomTat),
          },
        ),
      });
      return sapXepLichRanh(
        (await tx.lichRanh.findMany({ where: { giaSuId: id } })).map(
          toLichRanhDto,
        ),
      );
    });
    return lichRanh;
  }

  // ---------- Duyệt / từ chối ----------

  async review(
    id: number,
    dto: ReviewTutorDto,
    user: AuthUser,
  ): Promise<TutorDetailDto> {
    const giaSu = await this.layCoBan(id);
    if (giaSu.trangThai !== TrangThaiGiaSu.CHO_DUYET) {
      throw new ConflictException('Hồ sơ không ở trạng thái CHO_DUYET');
    }
    const nhanVien = await this.prisma.nhanVien.findUnique({
      where: { taiKhoanId: user.id },
      select: { id: true },
    });
    if (!nhanVien) {
      throw new ForbiddenException('Tài khoản chưa liên kết hồ sơ nhân viên');
    }

    const duyet = dto.ketQua === KetQuaDuyetGiaSu.DUYET;
    const trangThaiMoi = duyet
      ? TrangThaiGiaSu.DANG_HOAT_DONG
      : TrangThaiGiaSu.BI_TU_CHOI;
    const lyDo = dto.lyDo?.trim() || null;

    await this.prisma.$transaction(async (tx) => {
      // Điều kiện trangThai trong WHERE: hai NV bấm cùng lúc thì chỉ một người thắng.
      const { count } = await tx.giaSu.updateMany({
        where: { id, trangThai: TrangThaiGiaSu.CHO_DUYET },
        data: {
          trangThai: trangThaiMoi,
          ngayDuyet: new Date(),
          nguoiDuyetId: nhanVien.id,
        },
      });
      if (count === 0) {
        throw new ConflictException('Hồ sơ không ở trạng thái CHO_DUYET');
      }
      // MVP chưa xác minh từng giấy tờ: duyệt hồ sơ = xác minh các giấy tờ đang chờ.
      if (duyet) {
        await tx.hoSoNangLuc.updateMany({
          where: { giaSuId: id, trangThai: TrangThaiHoSoNangLuc.CHUA_XAC_MINH },
          data: {
            trangThai: TrangThaiHoSoNangLuc.DA_XAC_MINH,
            nguoiXacMinhId: nhanVien.id,
          },
        });
      }
      await tx.nhatKyThayDoi.create({
        data: banGhiNhatKy(
          user.id,
          duyet ? HanhDongGiaSu.DUYET : HanhDongGiaSu.TU_CHOI,
          giaSu.ma,
          {
            truong: 'trangThai',
            giaTriCu: TrangThaiGiaSu.CHO_DUYET,
            giaTriMoi: trangThaiMoi,
          },
          lyDo,
        ),
      });
    });
    return this.findOne(id);
  }

  // ---------- Hàm phụ ----------

  private dieuKienLoc(query: ListTutorsQueryDto): Prisma.GiaSuWhereInput {
    const tuKhoa = query.q?.trim();
    const khop = { contains: tuKhoa, mode: 'insensitive' } as const;
    const khuVuc = query.khuVuc?.trim();
    const locMon = query.monHocId !== undefined || query.capHoc !== undefined;
    return {
      ...(query.trangThai && { trangThai: query.trangThai }),
      ...(query.gioiTinh && { gioiTinh: query.gioiTinh }),
      ...(khuVuc && { khuVucNhanDay: { has: khuVuc } }),
      // Gia sư CA_HAI nhận được cả lớp tại nhà lẫn online.
      ...(query.hinhThucDay && {
        hinhThucDay:
          query.hinhThucDay === HinhThucDay.CA_HAI
            ? HinhThucDay.CA_HAI
            : { in: [query.hinhThucDay, HinhThucDay.CA_HAI] },
      }),
      // monHocId và capHoc cùng khớp trên MỘT môn dạy.
      ...(locMon && {
        monDay: {
          some: {
            ...(query.monHocId !== undefined && { monHocId: query.monHocId }),
            ...(query.capHoc && { capLop: { has: query.capHoc } }),
          },
        },
      }),
      ...(tuKhoa && {
        OR: [
          { ma: khop },
          { hoTen: khop },
          { soDienThoai: khop },
          { email: khop },
        ],
      }),
    };
  }

  private async layChiTiet(id: number): Promise<GiaSuChiTiet> {
    const giaSu = await this.prisma.giaSu.findUnique({
      where: { id },
      include: GIA_SU_CHI_TIET_INCLUDE,
    });
    if (!giaSu) throw new NotFoundException(KHONG_TIM_THAY);
    return giaSu;
  }

  private async layCoBan(
    id: number,
  ): Promise<{ id: number; ma: string; trangThai: string }> {
    const giaSu = await this.prisma.giaSu.findUnique({
      where: { id },
      select: { id: true, ma: true, trangThai: true },
    });
    if (!giaSu) throw new NotFoundException(KHONG_TIM_THAY);
    return giaSu;
  }

  private async toChiTiet(giaSu: GiaSuChiTiet): Promise<TutorDetailDto> {
    const lyDoTuChoi =
      giaSu.trangThai === TrangThaiGiaSu.BI_TU_CHOI
        ? await this.lyDoTuChoiGanNhat(giaSu.ma)
        : null;
    return toTutorDetailDto(giaSu, {
      soCccd: this.maHoa.giaiMa(giaSu.cccdMaHoa),
      taiKhoanNganHang: this.docTaiKhoanNganHang(giaSu.taiKhoanNganHangMaHoa),
      lyDoTuChoi,
    });
  }

  /** Chốt 23/11: lý do lấy từ nhật ký TU_CHOI mới nhất, không thêm cột. */
  private async lyDoTuChoiGanNhat(maGiaSu: string): Promise<string | null> {
    const nhatKy = await this.prisma.nhatKyThayDoi.findFirst({
      where: {
        loaiDoiTuong: LOAI_DOI_TUONG_GIA_SU,
        maBanGhi: maGiaSu,
        hanhDong: HanhDongGiaSu.TU_CHOI,
      },
      orderBy: [{ thoiDiem: 'desc' }, { id: 'desc' }],
      select: { lyDo: true },
    });
    return nhatKy?.lyDo ?? null;
  }

  private docTaiKhoanNganHang(
    banMa: Uint8Array | null,
  ): TaiKhoanNganHangBanRo | null {
    if (!banMa) return null;
    const giaTri = JSON.parse(this.maHoa.giaiMa(banMa)) as Partial<
      Record<keyof TaiKhoanNganHangBanRo, unknown>
    >;
    if (
      typeof giaTri.nganHang !== 'string' ||
      typeof giaTri.soTaiKhoan !== 'string' ||
      typeof giaTri.chuTaiKhoan !== 'string'
    ) {
      throw new InternalServerErrorException(
        'Dữ liệu tài khoản ngân hàng không đúng định dạng',
      );
    }
    return {
      nganHang: giaTri.nganHang,
      soTaiKhoan: giaTri.soTaiKhoan,
      chuTaiKhoan: giaTri.chuTaiKhoan,
    };
  }

  private async kiemTraMonHoc(
    monDay: readonly MonDayInputDto[],
  ): Promise<Map<number, MonHocDanhMuc>> {
    const danhMuc = await this.prisma.monHoc.findMany({
      where: { id: { in: monDay.map((md) => md.monHocId) } },
      select: {
        id: true,
        ma: true,
        ten: true,
        capHocApDung: true,
        dangSuDung: true,
      },
    });
    return kiemTraMonDay(monDay, danhMuc);
  }

  private duLieuMonDay(
    maGiaSu: string,
    monDay: readonly MonDayInputDto[],
    monHoc: Map<number, MonHocDanhMuc>,
  ): { ma: string; monHocId: number; capLop: string[] }[] {
    return monDay.map((md) => ({
      // kiemTraMonHoc đã bảo đảm mọi monHocId có trong danh mục.
      ma: maMonDay(maGiaSu, (monHoc.get(md.monHocId) as MonHocDanhMuc).ma),
      monHocId: md.monHocId,
      capLop: [...md.capHoc],
    }));
  }

  private duLieuLichRanh(
    maGiaSu: string,
    lichRanh: readonly LichRanhInputDto[],
  ): { ma: string; thu: number; gioBatDau: Date; gioKetThuc: Date }[] {
    return lichRanh.map((khung) => ({
      ma: maLichRanh(maGiaSu, khung),
      thu: khung.thu,
      gioBatDau: gioSangDate(khung.gioBatDau),
      gioKetThuc: gioSangDate(khung.gioKetThuc),
    }));
  }

  private async sinhMaGiaSu(): Promise<string> {
    const moiNhat = await this.prisma.giaSu.findFirst({
      where: { ma: { startsWith: 'GS' } },
      orderBy: { ma: 'desc' },
      select: { ma: true },
    });
    return maTiepTheo('GS', 5, moiNhat ? [moiNhat.ma] : []);
  }

  /** Báo lỗi rõ trước khi ghi; lỗi P2002 khi ghi (hai request cùng lúc) vẫn được chuyển thành 409. */
  private async kiemTraTrungKhiUngTuyen(
    soDienThoai: string,
    email: string,
    cccdHmac: BytesDb,
  ): Promise<void> {
    const [giaSu, taiKhoan] = await Promise.all([
      this.prisma.giaSu.findFirst({
        where: {
          OR: [
            { cccdHmac },
            { soDienThoai },
            { email: { equals: email, mode: 'insensitive' } },
          ],
        },
        select: { cccdHmac: true, soDienThoai: true },
      }),
      this.prisma.taiKhoan.findUnique({
        where: { tenDangNhap: soDienThoai },
        select: { id: true },
      }),
    ]);
    if (giaSu) {
      if (Buffer.from(giaSu.cccdHmac).equals(cccdHmac)) {
        throw new ConflictException('Số CCCD đã có hồ sơ gia sư');
      }
      if (giaSu.soDienThoai === soDienThoai) {
        throw new ConflictException('Số điện thoại đã có hồ sơ gia sư');
      }
      throw new ConflictException('Email đã có hồ sơ gia sư');
    }
    if (taiKhoan) {
      throw new ConflictException(
        'Số điện thoại đã là tên đăng nhập của tài khoản khác',
      );
    }
  }

  private async kiemTraTrungKhiSua(
    giaSu: GiaSuChiTiet,
    soDienThoai: string | undefined,
    email: string | undefined,
  ): Promise<void> {
    if (!soDienThoai && !email) return;
    const [giaSuKhac, taiKhoanKhac] = await Promise.all([
      this.prisma.giaSu.findFirst({
        where: {
          id: { not: giaSu.id },
          OR: [
            ...(soDienThoai ? [{ soDienThoai }] : []),
            ...(email
              ? [{ email: { equals: email, mode: 'insensitive' as const } }]
              : []),
          ],
        },
        select: { soDienThoai: true },
      }),
      soDienThoai
        ? this.prisma.taiKhoan.findFirst({
            where: {
              tenDangNhap: soDienThoai,
              ...(giaSu.taiKhoanId && { id: { not: giaSu.taiKhoanId } }),
            },
            select: { id: true },
          })
        : null,
    ]);
    if (giaSuKhac) {
      throw new ConflictException(
        soDienThoai && giaSuKhac.soDienThoai === soDienThoai
          ? 'Số điện thoại đã được sử dụng'
          : 'Email đã được sử dụng',
      );
    }
    if (taiKhoanKhac) {
      throw new ConflictException(
        'Số điện thoại đã là tên đăng nhập của tài khoản khác',
      );
    }
  }
}
