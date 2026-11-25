import { randomBytes } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { bamHmac, maHoa } from '../../common/bao-mat/ma-hoa-du-lieu.js';
import { MaHoaDuLieuService } from '../../common/bao-mat/ma-hoa-du-lieu.service.js';
import {
  HinhThucDay,
  KetQuaDuyetGiaSu,
  LoaiHoSoNangLuc,
  TrangThaiGiaSu,
} from '../../common/enums/gia-su.enum.js';
import { CapHoc } from '../../common/enums/mon-hoc.enum.js';
import { VaiTro } from '../../common/enums/tai-khoan.enum.js';
import type { ApplyTutorDto } from './dto/apply-tutor.dto.js';
import { TutorsService } from './tutors.service.js';

vi.mock('bcrypt', () => ({ default: { hash: vi.fn() } }));

const KHOA = randomBytes(32);
const KHOA_HMAC = randomBytes(32);
const CCCD = '079200001042';

const dieuPhoi = { id: 2, vaiTro: VaiTro.DIEU_PHOI };
const giaSuDangNhap = { id: 30, vaiTro: VaiTro.GIA_SU };

const monToan = {
  id: 1,
  ma: 'MH01',
  ten: 'Toán',
  capHocApDung: ['THCS', 'THPT'],
  dangSuDung: true,
};

// satisfies (không khai báo kiểu class) để spread trong test không bị lint cảnh báo.
const hoSoUngTuyen = {
  hoTen: ' Vũ Ngọc Hân ',
  ngaySinh: '2000-08-15',
  gioiTinh: 'NU' as ApplyTutorDto['gioiTinh'],
  soCccd: CCCD,
  anhCccdMatTruoc: 'ung-tuyen/a/cccd-truoc.jpg',
  anhCccdMatSau: 'ung-tuyen/a/cccd-sau.jpg',
  soDienThoai: '0903826154',
  email: 'Han.Vu@Example.com',
  diaChi: 'Phường Bình Thạnh, TP.HCM',
  anhChanDung: 'ung-tuyen/a/chan-dung.jpg',
  trinhDo: 'Sinh viên',
  truongDaoTao: 'ĐH Sư phạm TP.HCM',
  chuyenNganh: 'Sư phạm Toán',
  nienKhoa: '2022–2026',
  hinhThucDay: HinhThucDay.CA_HAI,
  khuVucNhanDay: ['Bình Thạnh'],
  monDay: [{ monHocId: 1, capHoc: [CapHoc.THCS] }],
  lichRanh: [{ thu: 2, gioBatDau: '18:00', gioKetThuc: '21:00' }],
  hoSoNangLuc: [
    {
      loai: LoaiHoSoNangLuc.THE_SINH_VIEN,
      ten: 'Thẻ sinh viên',
      noiCap: 'ĐH Sư phạm TP.HCM',
      ngayCap: '2022-09-01',
      ngayHetHan: '2099-06-30',
      tep: 'ung-tuyen/a/the-sv.jpg',
    },
  ],
  matKhau: 'MatKhau@123',
  dongYXuLyDuLieu: true,
} satisfies ApplyTutorDto;

/** Bản ghi GiaSu như Prisma trả về với GIA_SU_CHI_TIET_INCLUDE. */
function giaSuChiTiet(ghiDe: Record<string, unknown> = {}) {
  return {
    id: 16,
    ma: 'GS00016',
    hoTen: 'Vũ Ngọc Hân',
    ngaySinh: new Date('2000-08-15T00:00:00.000Z'),
    gioiTinh: 'NU',
    cccdMaHoa: maHoa(CCCD, KHOA),
    cccdHmac: bamHmac(CCCD, KHOA_HMAC),
    anhCccdMatTruoc: 'ung-tuyen/a/cccd-truoc.jpg',
    anhCccdMatSau: 'ung-tuyen/a/cccd-sau.jpg',
    soDienThoai: '0903826154',
    email: 'han.vu@example.com',
    diaChi: 'Phường Bình Thạnh, TP.HCM',
    anhChanDung: 'ung-tuyen/a/chan-dung.jpg',
    trinhDo: 'Sinh viên',
    truongDaoTao: 'ĐH Sư phạm TP.HCM',
    chuyenNganh: 'Sư phạm Toán',
    nienKhoa: '2022–2026',
    hinhThucDay: 'CA_HAI',
    trangThai: 'CHO_DUYET',
    dongYXuLyDuLieu: true,
    thoiDiemGhiNhanDongY: new Date('2026-11-23T03:15:00.000Z'),
    donViCongTac: null,
    laGiaoVienCongLap: null,
    khuVucNhanDay: ['Bình Thạnh'],
    thuLaoMongMuon: 200000,
    taiKhoanNganHangMaHoa: null,
    soLopToiDa: null,
    gioiThieu: null,
    kinhNghiem: null,
    nguoiDuyetId: null,
    ngayDuyet: null,
    taiKhoanId: 30,
    monDay: [
      {
        id: 12,
        ma: 'GS00016-MH01',
        giaSuId: 16,
        monHocId: 1,
        capLop: ['THCS'],
        monHoc: { ma: 'MH01', ten: 'Toán' },
      },
    ],
    lichRanh: [
      {
        id: 32,
        ma: 'GS00016-LR4-0800-1000',
        giaSuId: 16,
        thu: 4,
        gioBatDau: new Date('1970-01-01T08:00:00.000Z'),
        gioKetThuc: new Date('1970-01-01T10:00:00.000Z'),
      },
      {
        id: 31,
        ma: 'GS00016-LR2-1800-2100',
        giaSuId: 16,
        thu: 2,
        gioBatDau: new Date('1970-01-01T18:00:00.000Z'),
        gioKetThuc: new Date('1970-01-01T21:00:00.000Z'),
      },
    ],
    hoSoNangLuc: [
      {
        id: 7,
        ma: 'GS00016-HS01',
        giaSuId: 16,
        loai: 'THE_SINH_VIEN',
        ten: 'Thẻ sinh viên',
        noiCap: 'ĐH Sư phạm TP.HCM',
        ngayCap: new Date('2022-09-01T00:00:00.000Z'),
        ngayHetHan: new Date('2099-06-30T00:00:00.000Z'),
        tep: 'ung-tuyen/a/the-sv.jpg',
        trangThai: 'CHUA_XAC_MINH',
        nguoiXacMinhId: null,
      },
    ],
    nguoiDuyet: null,
    ...ghiDe,
  };
}

const loiPrisma = (code: string, target?: string[]) =>
  new Prisma.PrismaClientKnownRequestError('lỗi', {
    code,
    clientVersion: 'test',
    meta: { target },
  });

describe('TutorsService', () => {
  const prisma = {
    $transaction: vi.fn(),
    giaSu: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    taiKhoan: { findUnique: vi.fn(), findFirst: vi.fn() },
    nhanVien: { findUnique: vi.fn() },
    monHoc: { findMany: vi.fn() },
    monDay: { findMany: vi.fn(), deleteMany: vi.fn(), createMany: vi.fn() },
    lichRanh: { findMany: vi.fn(), deleteMany: vi.fn(), createMany: vi.fn() },
    hoSoNangLuc: { updateMany: vi.fn() },
    nhatKyThayDoi: { create: vi.fn(), createMany: vi.fn(), findFirst: vi.fn() },
  };
  const maHoaService = new MaHoaDuLieuService({
    get: (ten: string) =>
      ({
        DATA_ENCRYPTION_KEY: KHOA.toString('base64'),
        DATA_HMAC_KEY: KHOA_HMAC.toString('base64'),
      })[ten],
  } as unknown as ConfigService);
  const service = new TutorsService(prisma as never, maHoaService);

  beforeEach(() => {
    vi.resetAllMocks();
    // Interactive transaction chạy callback với chính mock; batch thì Promise.all.
    prisma.$transaction.mockImplementation((arg: unknown) =>
      typeof arg === 'function'
        ? (arg as (tx: typeof prisma) => unknown)(prisma)
        : Promise.all(arg as unknown[]),
    );
    vi.mocked(bcrypt.hash).mockResolvedValue('hash-mat-khau' as never);
    prisma.monHoc.findMany.mockResolvedValue([monToan]);
    prisma.giaSu.findFirst.mockResolvedValue(null);
    prisma.taiKhoan.findUnique.mockResolvedValue(null);
    prisma.taiKhoan.findFirst.mockResolvedValue(null);
    prisma.nhatKyThayDoi.findFirst.mockResolvedValue(null);
  });

  describe('apply', () => {
    beforeEach(() => {
      // Lần gọi đầu: kiểm tra trùng (không có); lần sau: mã lớn nhất hiện có.
      prisma.giaSu.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ ma: 'GS00015' });
      prisma.giaSu.create.mockResolvedValue({
        ma: 'GS00016',
        hoTen: 'Vũ Ngọc Hân',
        taiKhoanId: 30,
      });
    });

    it('tạo hồ sơ GS kế tiếp ở CHO_DUYET kèm tài khoản GIA_SU, CCCD chỉ lưu bản mã', async () => {
      const ketQua = await service.apply(hoSoUngTuyen);

      expect(ketQua).toMatchObject({
        ma: 'GS00016',
        trangThai: TrangThaiGiaSu.CHO_DUYET,
        tenDangNhap: '0903826154',
      });
      expect(ketQua.ngayUngTuyen).toBeInstanceOf(Date);

      const { data } = prisma.giaSu.create.mock.calls[0][0];
      expect(data).toMatchObject({
        ma: 'GS00016',
        hoTen: 'Vũ Ngọc Hân',
        email: 'han.vu@example.com',
        trangThai: TrangThaiGiaSu.CHO_DUYET,
        dongYXuLyDuLieu: true,
        taiKhoan: {
          create: {
            tenDangNhap: '0903826154',
            matKhauHash: 'hash-mat-khau',
            vaiTro: { connect: { ma: VaiTro.GIA_SU } },
          },
        },
      });
      expect(data.thoiDiemGhiNhanDongY).toEqual(ketQua.ngayUngTuyen);
      expect(data.ngaySinh.toISOString()).toBe('2000-08-15T00:00:00.000Z');
      // CCCD: không có bản rõ, giải mã lại ra đúng số, HMAC khớp để bắt trùng.
      expect(JSON.stringify(data)).not.toContain(CCCD);
      expect(maHoaService.giaiMa(data.cccdMaHoa)).toBe(CCCD);
      expect(Buffer.from(data.cccdHmac).equals(Buffer.from(bamHmac(CCCD, KHOA_HMAC)))).toBe(true);
      // Mã bảng con sinh từ mã gia sư, map capHoc → capLop.
      expect(data.monDay.create).toEqual([
        { ma: 'GS00016-MH01', monHocId: 1, capLop: ['THCS'] },
      ]);
      expect(data.lichRanh.create[0]).toMatchObject({
        ma: 'GS00016-LR2-1800-2100',
        thu: 2,
      });
      expect(data.lichRanh.create[0].gioBatDau.toISOString()).toBe(
        '1970-01-01T18:00:00.000Z',
      );
      expect(data.hoSoNangLuc.create[0]).toMatchObject({
        ma: 'GS00016-HS01',
        loai: 'THE_SINH_VIEN',
      });
      expect(prisma.nhatKyThayDoi.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          hanhDong: 'UNG_TUYEN',
          loaiDoiTuong: 'GiaSu',
          maBanGhi: 'GS00016',
          giaTriMoi: 'CHO_DUYET',
        }),
      });
    });

    it('CCCD đã có hồ sơ → 409, không tạo gì', async () => {
      prisma.giaSu.findFirst.mockReset().mockResolvedValueOnce({
        cccdHmac: bamHmac(CCCD, KHOA_HMAC),
        soDienThoai: '0999999999',
      });
      await expect(service.apply(hoSoUngTuyen)).rejects.toThrow(
        'Số CCCD đã có hồ sơ gia sư',
      );
      expect(prisma.giaSu.create).not.toHaveBeenCalled();
    });

    it('SĐT đã là tên đăng nhập của tài khoản khác → 409', async () => {
      prisma.taiKhoan.findUnique.mockResolvedValue({ id: 3 });
      await expect(service.apply(hoSoUngTuyen)).rejects.toThrow(
        'Số điện thoại đã là tên đăng nhập của tài khoản khác',
      );
    });

    it('hai request cùng SĐT: request thua nhận 409 thay vì 500', async () => {
      prisma.giaSu.create.mockRejectedValue(loiPrisma('P2002', ['soDienThoai']));
      await expect(service.apply(hoSoUngTuyen)).rejects.toThrow(ConflictException);
    });

    it('môn ngừng sử dụng hoặc thiếu giấy tờ → 400 trước khi ghi DB', async () => {
      prisma.monHoc.findMany.mockResolvedValue([{ ...monToan, dangSuDung: false }]);
      await expect(service.apply(hoSoUngTuyen)).rejects.toThrow(BadRequestException);

      await expect(
        service.apply({
          ...hoSoUngTuyen,
          hoSoNangLuc: [{ ...hoSoUngTuyen.hoSoNangLuc[0], ngayHetHan: '2025-06-30' }],
        }),
      ).rejects.toThrow('Cần thẻ sinh viên còn hạn hoặc bằng tốt nghiệp');
      expect(prisma.giaSu.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('lọc theo hình thức (CA_HAI khớp cả TAI_NHA), môn + cấp trên cùng môn dạy, mới nộp trước', async () => {
      prisma.giaSu.findMany.mockResolvedValue([giaSuChiTiet()]);
      prisma.giaSu.count.mockResolvedValue(1);

      const ketQua = await service.findAll({
        page: 1,
        pageSize: 20,
        trangThai: TrangThaiGiaSu.CHO_DUYET,
        hinhThucDay: HinhThucDay.TAI_NHA,
        monHocId: 1,
        capHoc: CapHoc.THCS,
        khuVuc: ' Bình Thạnh ',
        q: 'hân',
      });

      const tham = prisma.giaSu.findMany.mock.calls[0][0];
      expect(tham.where).toEqual({
        trangThai: 'CHO_DUYET',
        khuVucNhanDay: { has: 'Bình Thạnh' },
        hinhThucDay: { in: ['TAI_NHA', 'CA_HAI'] },
        monDay: { some: { monHocId: 1, capLop: { has: 'THCS' } } },
        OR: expect.arrayContaining([
          { hoTen: { contains: 'hân', mode: 'insensitive' } },
        ]),
      });
      expect(tham.orderBy).toEqual([
        { thoiDiemGhiNhanDongY: { sort: 'desc', nulls: 'last' } },
        { id: 'desc' },
      ]);
      expect(ketQua.total).toBe(1);
      expect(ketQua.items[0]).toMatchObject({
        ma: 'GS00016',
        ngaySinh: '2000-08-15',
        monDay: [{ maMon: 'MH01', tenMon: 'Toán', capHoc: ['THCS'] }],
      });
      // Danh sách không có CCCD dù đã che.
      expect(ketQua.items[0]).not.toHaveProperty('soCccdDaChe');
      expect(ketQua.items[0]).not.toHaveProperty('cccdMaHoa');
    });
  });

  describe('findOne / findMe', () => {
    it('che CCCD và STK, không lộ bản mã; lịch rảnh sắp theo thứ', async () => {
      prisma.giaSu.findUnique.mockResolvedValue(
        giaSuChiTiet({
          taiKhoanNganHangMaHoa: maHoa(
            JSON.stringify({
              nganHang: 'Vietcombank',
              soTaiKhoan: '0123456789',
              chuTaiKhoan: 'VU NGOC HAN',
            }),
            KHOA,
          ),
        }),
      );

      const chiTiet = await service.findOne(16);

      expect(chiTiet.soCccdDaChe).toBe('079******042');
      expect(chiTiet.taiKhoanNganHang).toEqual({
        nganHang: 'Vietcombank',
        soTaiKhoanDaChe: '******6789',
        chuTaiKhoan: 'VU NGOC HAN',
      });
      const json = JSON.stringify(chiTiet);
      expect(json).not.toContain(CCCD);
      expect(json).not.toContain('0123456789');
      expect(chiTiet).not.toHaveProperty('cccdMaHoa');
      expect(chiTiet).not.toHaveProperty('cccdHmac');
      expect(chiTiet.lichRanh.map((lr) => lr.thu)).toEqual([2, 4]);
      expect(chiTiet.lichRanh[0]).toMatchObject({ gioBatDau: '18:00', gioKetThuc: '21:00' });
      expect(chiTiet.hoSoNangLuc[0]).toMatchObject({ ngayCap: '2022-09-01', ngayHetHan: '2099-06-30' });
      expect(chiTiet.lyDoTuChoi).toBeNull();
    });

    it('BI_TU_CHOI: lyDoTuChoi lấy từ nhật ký TU_CHOI mới nhất', async () => {
      prisma.giaSu.findUnique.mockResolvedValue(
        giaSuChiTiet({ trangThai: 'BI_TU_CHOI', nguoiDuyet: { hoTen: 'Điều phối Mẫu' } }),
      );
      prisma.nhatKyThayDoi.findFirst.mockResolvedValue({ lyDo: 'Thẻ sinh viên mờ' });

      const chiTiet = await service.findOne(16);

      expect(chiTiet.lyDoTuChoi).toBe('Thẻ sinh viên mờ');
      expect(chiTiet.nguoiDuyet).toBe('Điều phối Mẫu');
      expect(prisma.nhatKyThayDoi.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { loaiDoiTuong: 'GiaSu', maBanGhi: 'GS00016', hanhDong: 'TU_CHOI' },
          orderBy: [{ thoiDiem: 'desc' }, { id: 'desc' }],
        }),
      );
    });

    it('không tìm thấy → 404; tài khoản chưa có hồ sơ gia sư → 404', async () => {
      prisma.giaSu.findUnique.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
      await expect(service.findMe(giaSuDangNhap)).rejects.toThrow(
        'Tài khoản chưa liên kết hồ sơ gia sư',
      );
    });
  });

  describe('update', () => {
    beforeEach(() => {
      prisma.giaSu.findUnique.mockResolvedValue(giaSuChiTiet({ trangThai: 'DANG_HOAT_DONG' }));
      prisma.giaSu.update.mockImplementation(({ data }: { data: object }) =>
        Promise.resolve(giaSuChiTiet({ trangThai: 'DANG_HOAT_DONG', ...data })),
      );
    });

    it('đổi SĐT thì đổi luôn tên đăng nhập và ghi nhật ký từng trường', async () => {
      await service.update(16, { soDienThoai: '0911222333', diaChi: 'Gò Vấp' }, giaSuDangNhap);

      const { data } = prisma.giaSu.update.mock.calls[0][0];
      expect(data).toEqual({
        soDienThoai: '0911222333',
        diaChi: 'Gò Vấp',
        taiKhoan: { update: { tenDangNhap: '0911222333' } },
      });
      const nhatKy = prisma.nhatKyThayDoi.createMany.mock.calls[0][0].data;
      expect(nhatKy).toEqual([
        expect.objectContaining({
          taiKhoanId: 30,
          hanhDong: 'CAP_NHAT_HO_SO',
          truong: 'soDienThoai',
          giaTriCu: '0903826154',
          giaTriMoi: '0911222333',
        }),
        expect.objectContaining({ truong: 'diaChi', giaTriMoi: 'Gò Vấp' }),
      ]);
    });

    it('SĐT đã thuộc gia sư khác → 409', async () => {
      prisma.giaSu.findFirst.mockResolvedValue({ soDienThoai: '0911222333' });
      await expect(
        service.update(16, { soDienThoai: '0911222333' }, giaSuDangNhap),
      ).rejects.toThrow('Số điện thoại đã được sử dụng');
      expect(prisma.giaSu.update).not.toHaveBeenCalled();
    });

    it('chuyển ONLINE với khu vực rỗng được; dạy tại nhà mà hết khu vực → 400', async () => {
      await service.update(
        16,
        { hinhThucDay: HinhThucDay.ONLINE, khuVucNhanDay: [] },
        giaSuDangNhap,
      );
      expect(prisma.giaSu.update).toHaveBeenCalledTimes(1);

      await expect(
        service.update(16, { khuVucNhanDay: [] }, giaSuDangNhap),
      ).rejects.toThrow(BadRequestException);
    });

    it('STK lưu bản mã, nhật ký chỉ có số đã che', async () => {
      await service.update(
        16,
        {
          taiKhoanNganHang: {
            nganHang: 'Vietcombank',
            soTaiKhoan: '0123456789',
            chuTaiKhoan: 'VU NGOC HAN',
          },
        },
        giaSuDangNhap,
      );
      const { data } = prisma.giaSu.update.mock.calls[0][0];
      expect(JSON.parse(maHoaService.giaiMa(data.taiKhoanNganHangMaHoa))).toEqual({
        nganHang: 'Vietcombank',
        soTaiKhoan: '0123456789',
        chuTaiKhoan: 'VU NGOC HAN',
      });
      const nhatKy = JSON.stringify(prisma.nhatKyThayDoi.createMany.mock.calls[0][0]);
      expect(nhatKy).toContain('******6789');
      expect(nhatKy).not.toContain('0123456789');
    });

    it('gửi lại giá trị cũ thì không ghi DB', async () => {
      await service.update(16, { diaChi: 'Phường Bình Thạnh, TP.HCM' }, giaSuDangNhap);
      expect(prisma.giaSu.update).not.toHaveBeenCalled();
      expect(prisma.nhatKyThayDoi.createMany).not.toHaveBeenCalled();
    });

    it('gia sư BI_TU_CHOI tự sửa → 409; điều phối vẫn sửa được', async () => {
      prisma.giaSu.findUnique.mockResolvedValue(giaSuChiTiet({ trangThai: 'BI_TU_CHOI' }));
      await expect(
        service.update(16, { diaChi: 'Gò Vấp' }, giaSuDangNhap),
      ).rejects.toThrow(ConflictException);

      await service.update(16, { diaChi: 'Gò Vấp' }, dieuPhoi);
      expect(prisma.giaSu.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('replaceAvailability', () => {
    beforeEach(() => {
      prisma.giaSu.findUnique.mockResolvedValue({ id: 16, ma: 'GS00016', trangThai: 'DANG_HOAT_DONG' });
      prisma.lichRanh.findMany
        .mockResolvedValueOnce(giaSuChiTiet().lichRanh)
        .mockResolvedValueOnce([
          {
            id: 40,
            thu: 1,
            gioBatDau: new Date('1970-01-01T19:00:00.000Z'),
            gioKetThuc: new Date('1970-01-01T21:00:00.000Z'),
          },
        ]);
    });

    it('thay toàn bộ lịch trong một transaction và ghi nhật ký', async () => {
      const ketQua = await service.replaceAvailability(
        16,
        { lichRanh: [{ thu: 1, gioBatDau: '19:00', gioKetThuc: '21:00' }] },
        giaSuDangNhap,
      );

      expect(prisma.lichRanh.deleteMany).toHaveBeenCalledWith({ where: { giaSuId: 16 } });
      expect(prisma.lichRanh.createMany.mock.calls[0][0].data).toEqual([
        expect.objectContaining({ ma: 'GS00016-LR1-1900-2100', giaSuId: 16, thu: 1 }),
      ]);
      expect(prisma.nhatKyThayDoi.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          hanhDong: 'CAP_NHAT_LICH_RANH',
          truong: 'lichRanh',
          giaTriMoi: [{ thu: 1, gioBatDau: '19:00', gioKetThuc: '21:00' }],
        }),
      });
      expect(ketQua).toEqual([{ id: 40, thu: 1, gioBatDau: '19:00', gioKetThuc: '21:00' }]);
    });

    it('khung cùng thứ chồng nhau → 400, không xóa lịch cũ', async () => {
      await expect(
        service.replaceAvailability(
          16,
          {
            lichRanh: [
              { thu: 1, gioBatDau: '18:00', gioKetThuc: '20:00' },
              { thu: 1, gioBatDau: '19:00', gioKetThuc: '21:00' },
            ],
          },
          giaSuDangNhap,
        ),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.lichRanh.deleteMany).not.toHaveBeenCalled();
    });

    it('gửi lại đúng lịch cũ (khác thứ tự) thì không ghi DB', async () => {
      const ketQua = await service.replaceAvailability(
        16,
        {
          lichRanh: [
            { thu: 4, gioBatDau: '08:00', gioKetThuc: '10:00' },
            { thu: 2, gioBatDau: '18:00', gioKetThuc: '21:00' },
          ],
        },
        giaSuDangNhap,
      );
      expect(prisma.lichRanh.deleteMany).not.toHaveBeenCalled();
      expect(ketQua.map((lr) => lr.thu)).toEqual([2, 4]);
    });
  });

  describe('replaceSubjects', () => {
    it('thay danh sách môn dạy, mã sinh từ mã gia sư', async () => {
      prisma.giaSu.findUnique.mockResolvedValue({ id: 16, ma: 'GS00016', trangThai: 'CHO_DUYET' });
      prisma.monHoc.findMany.mockResolvedValue([
        monToan,
        { id: 3, ma: 'MH03', ten: 'Tiếng Anh', capHocApDung: ['THCS', 'THPT'], dangSuDung: true },
      ]);
      prisma.monDay.findMany.mockResolvedValue(giaSuChiTiet().monDay);

      await service.replaceSubjects(
        16,
        {
          monDay: [
            { monHocId: 3, capHoc: [CapHoc.THPT] },
            { monHocId: 1, capHoc: [CapHoc.THCS] },
          ],
        },
        giaSuDangNhap,
      );

      expect(prisma.monDay.createMany.mock.calls[0][0].data).toEqual([
        { ma: 'GS00016-MH03', monHocId: 3, capLop: ['THPT'], giaSuId: 16 },
        { ma: 'GS00016-MH01', monHocId: 1, capLop: ['THCS'], giaSuId: 16 },
      ]);
      expect(prisma.nhatKyThayDoi.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          hanhDong: 'CAP_NHAT_MON_DAY',
          giaTriCu: [{ maMon: 'MH01', capHoc: ['THCS'] }],
          giaTriMoi: [
            { maMon: 'MH01', capHoc: ['THCS'] },
            { maMon: 'MH03', capHoc: ['THPT'] },
          ],
        }),
      });
    });

    it('gửi lại đúng danh sách cũ thì không ghi DB', async () => {
      prisma.giaSu.findUnique.mockResolvedValue({ id: 16, ma: 'GS00016', trangThai: 'CHO_DUYET' });
      prisma.monDay.findMany.mockResolvedValue(giaSuChiTiet().monDay);

      await service.replaceSubjects(
        16,
        { monDay: [{ monHocId: 1, capHoc: [CapHoc.THCS] }] },
        giaSuDangNhap,
      );
      expect(prisma.monDay.deleteMany).not.toHaveBeenCalled();
    });
  });

  describe('review', () => {
    beforeEach(() => {
      prisma.giaSu.findUnique
        .mockResolvedValueOnce({ id: 16, ma: 'GS00016', trangThai: 'CHO_DUYET' })
        .mockResolvedValue(giaSuChiTiet({ trangThai: 'DANG_HOAT_DONG' }));
      prisma.nhanVien.findUnique.mockResolvedValue({ id: 5 });
      prisma.giaSu.updateMany.mockResolvedValue({ count: 1 });
    });

    it('DUYET → DANG_HOAT_DONG, ghi người duyệt, giấy tờ chờ chuyển DA_XAC_MINH, ghi nhật ký', async () => {
      const ketQua = await service.review(16, { ketQua: KetQuaDuyetGiaSu.DUYET }, dieuPhoi);

      expect(prisma.giaSu.updateMany).toHaveBeenCalledWith({
        where: { id: 16, trangThai: 'CHO_DUYET' },
        data: { trangThai: 'DANG_HOAT_DONG', ngayDuyet: expect.any(Date), nguoiDuyetId: 5 },
      });
      expect(prisma.hoSoNangLuc.updateMany).toHaveBeenCalledWith({
        where: { giaSuId: 16, trangThai: 'CHUA_XAC_MINH' },
        data: { trangThai: 'DA_XAC_MINH', nguoiXacMinhId: 5 },
      });
      expect(prisma.nhatKyThayDoi.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          taiKhoanId: 2,
          hanhDong: 'DUYET',
          giaTriCu: 'CHO_DUYET',
          giaTriMoi: 'DANG_HOAT_DONG',
        }),
      });
      expect(ketQua.trangThai).toBe('DANG_HOAT_DONG');
    });

    it('TU_CHOI → BI_TU_CHOI kèm lý do, giấy tờ giữ nguyên', async () => {
      await service.review(
        16,
        { ketQua: KetQuaDuyetGiaSu.TU_CHOI, lyDo: '  Thẻ sinh viên mờ  ' },
        dieuPhoi,
      );
      expect(prisma.giaSu.updateMany.mock.calls[0][0].data.trangThai).toBe('BI_TU_CHOI');
      expect(prisma.hoSoNangLuc.updateMany).not.toHaveBeenCalled();
      expect(prisma.nhatKyThayDoi.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ hanhDong: 'TU_CHOI', lyDo: 'Thẻ sinh viên mờ' }),
      });
    });

    it('hồ sơ không còn CHO_DUYET → 409', async () => {
      prisma.giaSu.findUnique.mockReset().mockResolvedValue({
        id: 16,
        ma: 'GS00016',
        trangThai: 'DANG_HOAT_DONG',
      });
      await expect(
        service.review(16, { ketQua: KetQuaDuyetGiaSu.DUYET }, dieuPhoi),
      ).rejects.toThrow('Hồ sơ không ở trạng thái CHO_DUYET');
    });

    it('hai NV duyệt cùng lúc: người đến sau (count = 0) nhận 409, không ghi nhật ký', async () => {
      prisma.giaSu.updateMany.mockResolvedValue({ count: 0 });
      await expect(
        service.review(16, { ketQua: KetQuaDuyetGiaSu.DUYET }, dieuPhoi),
      ).rejects.toThrow(ConflictException);
      expect(prisma.nhatKyThayDoi.create).not.toHaveBeenCalled();
    });

    it('tài khoản điều phối chưa có hồ sơ nhân viên → 403', async () => {
      prisma.nhanVien.findUnique.mockResolvedValue(null);
      await expect(
        service.review(16, { ketQua: KetQuaDuyetGiaSu.DUYET }, dieuPhoi),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
