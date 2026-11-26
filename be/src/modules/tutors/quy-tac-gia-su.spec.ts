import { BadRequestException, ConflictException } from '@nestjs/common';
import {
  HinhThucDay,
  LoaiHoSoNangLuc,
  TrangThaiGiaSu,
} from '../../common/enums/gia-su.enum.js';
import { CapHoc } from '../../common/enums/mon-hoc.enum.js';
import { VaiTro } from '../../common/enums/tai-khoan.enum.js';
import {
  dateSangGio,
  dateSangNgay,
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

const HOM_NAY = '2026-11-26';

describe('kiemTraLichRanh', () => {
  it('nhận các khung không chồng nhau, kể cả chạm mép cùng thứ', () => {
    expect(() =>
      kiemTraLichRanh([
        { thu: 2, gioBatDau: '18:00', gioKetThuc: '19:30' },
        { thu: 2, gioBatDau: '19:30', gioKetThuc: '21:00' },
        { thu: 3, gioBatDau: '18:00', gioKetThuc: '21:00' },
      ]),
    ).not.toThrow();
    expect(() => kiemTraLichRanh([])).not.toThrow();
  });

  it('giờ kết thúc phải sau giờ bắt đầu', () => {
    expect(() =>
      kiemTraLichRanh([{ thu: 1, gioBatDau: '18:00', gioKetThuc: '18:00' }]),
    ).toThrow(BadRequestException);
    expect(() =>
      kiemTraLichRanh([{ thu: 1, gioBatDau: '21:00', gioKetThuc: '18:00' }]),
    ).toThrow('giờ kết thúc phải sau giờ bắt đầu');
  });

  it('chặn khung cùng thứ chồng giờ (start_A < end_B và start_B < end_A), dù gửi lộn thứ tự', () => {
    expect(() =>
      kiemTraLichRanh([
        { thu: 7, gioBatDau: '09:00', gioKetThuc: '11:00' },
        { thu: 7, gioBatDau: '08:00', gioKetThuc: '09:30' },
      ]),
    ).toThrow('Lịch rảnh bị chồng giờ: Chủ nhật 08:00–09:30 và Chủ nhật 09:00–11:00');
    expect(() =>
      kiemTraLichRanh([
        { thu: 2, gioBatDau: '18:00', gioKetThuc: '21:00' },
        { thu: 2, gioBatDau: '18:00', gioKetThuc: '21:00' },
      ]),
    ).toThrow('chồng giờ');
  });

  it('sắp lịch theo thứ rồi giờ bắt đầu', () => {
    expect(
      sapXepLichRanh([
        { thu: 3, gioBatDau: '08:00', gioKetThuc: '09:00' },
        { thu: 1, gioBatDau: '19:00', gioKetThuc: '21:00' },
        { thu: 1, gioBatDau: '07:00', gioKetThuc: '09:00' },
      ]).map((k) => `${k.thu} ${k.gioBatDau}`),
    ).toEqual(['1 07:00', '1 19:00', '3 08:00']);
  });
});

describe('giờ và ngày cho cột TIME/DATE', () => {
  it('đổi qua lại không lệch theo múi giờ', () => {
    expect(dateSangGio(gioSangDate('18:30'))).toBe('18:30');
    expect(gioSangDate('07:05').toISOString()).toBe('1970-01-01T07:05:00.000Z');
    expect(dateSangNgay(ngaySangDate('2000-08-15'))).toBe('2000-08-15');
  });

  it('hôm nay tính theo giờ Việt Nam (UTC+7)', () => {
    // 17:30 UTC ngày 25 = 00:30 ngày 26 ở Việt Nam.
    expect(homNayTaiVietNam(new Date('2026-11-25T17:30:00Z'))).toBe(
      '2026-11-26',
    );
  });
});

describe('kiemTraKhuVuc', () => {
  it('dạy tại nhà cần ít nhất 1 khu vực, ONLINE thì không', () => {
    expect(() => kiemTraKhuVuc(HinhThucDay.ONLINE, [])).not.toThrow();
    expect(() => kiemTraKhuVuc(HinhThucDay.TAI_NHA, ['Gò Vấp'])).not.toThrow();
    expect(() => kiemTraKhuVuc(HinhThucDay.TAI_NHA, [])).toThrow(
      BadRequestException,
    );
    expect(() => kiemTraKhuVuc(HinhThucDay.CA_HAI, [])).toThrow(
      BadRequestException,
    );
  });
});

describe('giáo viên và giấy tờ (Mục 6.2, TT 29/2024)', () => {
  const bang = {
    loai: LoaiHoSoNangLuc.BANG_TOT_NGHIEP,
    ngayCap: '2022-07-15',
  };
  const theSv = (ngayHetHan?: string) => ({
    loai: LoaiHoSoNangLuc.THE_SINH_VIEN,
    ngayCap: '2023-09-01',
    ngayHetHan,
  });

  it('nhận diện giáo viên qua cờ công lập hoặc trình độ "Giáo viên"', () => {
    expect(laGiaoVien('Sinh viên', null)).toBe(false);
    expect(laGiaoVien('Sinh viên', true)).toBe(true);
    expect(laGiaoVien(' GIÁO VIÊN ', false)).toBe(true);
  });

  it('giáo viên bắt buộc đơn vị công tác', () => {
    expect(() => kiemTraDonViCongTac(false, undefined)).not.toThrow();
    expect(() => kiemTraDonViCongTac(true, 'THCS Lê Văn Tám')).not.toThrow();
    expect(() => kiemTraDonViCongTac(true, '  ')).toThrow(BadRequestException);
  });

  it('cần thẻ sinh viên còn hạn hoặc bằng tốt nghiệp', () => {
    expect(() => kiemTraGiayTo([bang], false, HOM_NAY)).not.toThrow();
    expect(() => kiemTraGiayTo([theSv('2027-06-30')], false, HOM_NAY)).not.toThrow();
    expect(() => kiemTraGiayTo([theSv(HOM_NAY)], false, HOM_NAY)).not.toThrow();
    expect(() => kiemTraGiayTo([theSv()], false, HOM_NAY)).not.toThrow();
    expect(() => kiemTraGiayTo([theSv('2026-11-25')], false, HOM_NAY)).toThrow(
      'Cần thẻ sinh viên còn hạn hoặc bằng tốt nghiệp',
    );
    expect(() =>
      kiemTraGiayTo(
        [{ loai: LoaiHoSoNangLuc.CHUNG_CHI_NGOAI_NGU, ngayCap: '2024-01-01' }],
        false,
        HOM_NAY,
      ),
    ).toThrow(BadRequestException);
  });

  it('giáo viên cần thêm chứng chỉ sư phạm hoặc xác nhận nơi công tác', () => {
    expect(() => kiemTraGiayTo([bang], true, HOM_NAY)).toThrow(
      'Giáo viên cần nộp bằng/chứng chỉ sư phạm hoặc xác nhận nơi công tác',
    );
    expect(() =>
      kiemTraGiayTo(
        [bang, { loai: LoaiHoSoNangLuc.XAC_NHAN_NOI_CONG_TAC, ngayCap: '2025-09-01' }],
        true,
        HOM_NAY,
      ),
    ).not.toThrow();
  });

  it('ngày cấp không sau hôm nay, ngày hết hạn không trước ngày cấp', () => {
    expect(() =>
      kiemTraGiayTo([{ ...bang, ngayCap: '2026-11-27' }], false, HOM_NAY),
    ).toThrow('Ngày cấp giấy tờ không được sau hôm nay');
    expect(() =>
      kiemTraGiayTo([bang, { ...theSv('2023-08-01') }], false, HOM_NAY),
    ).toThrow('Ngày hết hạn giấy tờ không được trước ngày cấp');
  });
});

describe('kiemTraMonDay', () => {
  const danhMuc = [
    { id: 1, ma: 'MH01', ten: 'Toán', capHocApDung: ['THCS', 'THPT'], dangSuDung: true },
    { id: 5, ma: 'MH05', ten: 'Piano', capHocApDung: ['TIEU_HOC', 'THCS'], dangSuDung: true },
    { id: 9, ma: 'MH09', ten: 'Tin học', capHocApDung: ['THCS'], dangSuDung: false },
  ];

  it('trả map môn theo id khi hợp lệ', () => {
    const theoId = kiemTraMonDay(
      [
        { monHocId: 1, capHoc: [CapHoc.THCS, CapHoc.THPT] },
        { monHocId: 5, capHoc: [CapHoc.TIEU_HOC] },
      ],
      danhMuc,
    );
    expect(theoId.get(5)?.ma).toBe('MH05');
  });

  it('chặn môn không tồn tại hoặc ngừng sử dụng', () => {
    expect(() => kiemTraMonDay([{ monHocId: 2, capHoc: [CapHoc.THCS] }], danhMuc)).toThrow(
      'Môn học id=2 không tồn tại hoặc đã ngừng sử dụng',
    );
    expect(() => kiemTraMonDay([{ monHocId: 9, capHoc: [CapHoc.THCS] }], danhMuc)).toThrow(
      BadRequestException,
    );
  });

  it('chặn cấp học không áp dụng cho môn (Toán không có Tiểu học – TT 29)', () => {
    expect(() =>
      kiemTraMonDay([{ monHocId: 1, capHoc: [CapHoc.TIEU_HOC, CapHoc.THCS] }], danhMuc),
    ).toThrow('Môn Toán không áp dụng cho cấp TIEU_HOC');
  });
});

describe('kiemTraDuocSua (chốt 23/11)', () => {
  it('gia sư tự sửa khi CHO_DUYET, DANG_HOAT_DONG, TAM_NGUNG', () => {
    for (const trangThai of [
      TrangThaiGiaSu.CHO_DUYET,
      TrangThaiGiaSu.DANG_HOAT_DONG,
      TrangThaiGiaSu.TAM_NGUNG,
    ]) {
      expect(() => kiemTraDuocSua(VaiTro.GIA_SU, trangThai)).not.toThrow();
    }
  });

  it('gia sư BI_TU_CHOI hoặc NGUNG_HOP_TAC tự sửa → 409; điều phối sửa mọi trạng thái', () => {
    for (const trangThai of [TrangThaiGiaSu.BI_TU_CHOI, TrangThaiGiaSu.NGUNG_HOP_TAC]) {
      expect(() => kiemTraDuocSua(VaiTro.GIA_SU, trangThai)).toThrow(ConflictException);
      expect(() => kiemTraDuocSua(VaiTro.DIEU_PHOI, trangThai)).not.toThrow();
    }
  });
});

describe('mã nội bộ bảng con', () => {
  it('sinh từ mã gia sư nên không trùng giữa các gia sư', () => {
    expect(maMonDay('GS00016', 'MH01')).toBe('GS00016-MH01');
    expect(
      maLichRanh('GS00016', { thu: 1, gioBatDau: '18:00', gioKetThuc: '21:00' }),
    ).toBe('GS00016-LR1-1800-2100');
    expect(maHoSoNangLuc('GS00016', 3)).toBe('GS00016-HS03');
  });
});
