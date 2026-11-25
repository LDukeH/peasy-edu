import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ApplyTutorDto } from './apply-tutor.dto.js';
import { ReplaceTutorSubjectsDto } from './mon-day.dto.js';
import { ReviewTutorDto } from './review-tutor.dto.js';
import { UpdateTutorDto } from './update-tutor.dto.js';

/** Giống ValidationPipe toàn cục trong main.ts. */
async function loi<T extends object>(
  cls: new () => T,
  body: unknown,
): Promise<string[]> {
  const errors = await validate(plainToInstance(cls, body), {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  return errors.map((e) => e.property);
}

const hoSoHopLe = {
  hoTen: 'Vũ Ngọc Hân',
  ngaySinh: '2000-08-15',
  gioiTinh: 'NU',
  soCccd: '079200001042',
  anhCccdMatTruoc: 'ung-tuyen/a/cccd-truoc.jpg',
  anhCccdMatSau: 'ung-tuyen/a/cccd-sau.jpg',
  soDienThoai: '0903826154',
  email: 'han.vu@example.com',
  diaChi: 'Phường Bình Thạnh, TP.HCM',
  anhChanDung: 'ung-tuyen/a/chan-dung.jpg',
  trinhDo: 'Sinh viên',
  truongDaoTao: 'ĐH Sư phạm TP.HCM',
  chuyenNganh: 'Sư phạm Toán',
  nienKhoa: '2018–2022',
  hinhThucDay: 'CA_HAI',
  khuVucNhanDay: ['Bình Thạnh'],
  monDay: [{ monHocId: 1, capHoc: ['THCS'] }],
  lichRanh: [{ thu: 2, gioBatDau: '18:00', gioKetThuc: '21:00' }],
  hoSoNangLuc: [
    {
      loai: 'BANG_TOT_NGHIEP',
      ten: 'Bằng Cử nhân',
      noiCap: 'ĐH Sư phạm TP.HCM',
      ngayCap: '2022-07-15',
      tep: 'ung-tuyen/a/bang.pdf',
    },
  ],
  matKhau: 'MatKhau@123',
  dongYXuLyDuLieu: true,
};

describe('ApplyTutorDto', () => {
  it('nhận hồ sơ hợp lệ', async () => {
    expect(await loi(ApplyTutorDto, hoSoHopLe)).toEqual([]);
  });

  it('bắt buộc khu vực khi dạy tại nhà, không bắt buộc khi chỉ online', async () => {
    const { khuVucNhanDay: _bo, ...khongKhuVuc } = hoSoHopLe;
    expect(await loi(ApplyTutorDto, khongKhuVuc)).toEqual(['khuVucNhanDay']);
    expect(
      await loi(ApplyTutorDto, { ...khongKhuVuc, hinhThucDay: 'ONLINE' }),
    ).toEqual([]);
  });

  it('ONLINE được gửi khu vực rỗng, dạy tại nhà thì không (review PR #10)', async () => {
    expect(
      await loi(ApplyTutorDto, {
        ...hoSoHopLe,
        hinhThucDay: 'ONLINE',
        khuVucNhanDay: [],
      }),
    ).toEqual([]);
    for (const hinhThucDay of ['TAI_NHA', 'CA_HAI']) {
      expect(
        await loi(ApplyTutorDto, { ...hoSoHopLe, hinhThucDay, khuVucNhanDay: [] }),
      ).toEqual(['khuVucNhanDay']);
    }
  });

  it('ngày chỉ nhận YYYY-MM-DD, từ chối chuỗi có giờ (review PR #10)', async () => {
    const [giayTo] = hoSoHopLe.hoSoNangLuc;
    expect(
      await loi(ApplyTutorDto, {
        ...hoSoHopLe,
        ngaySinh: '2000-08-15T10:00:00Z',
        hoSoNangLuc: [{ ...giayTo, ngayCap: '2022-07-15T00:00:00Z' }],
      }),
    ).toEqual(['ngaySinh', 'hoSoNangLuc']);
    expect(
      await loi(ApplyTutorDto, { ...hoSoHopLe, ngaySinh: '2000-02-30' }),
    ).toEqual(['ngaySinh']);
  });

  it('từ chối khi chưa đồng ý xử lý dữ liệu cá nhân', async () => {
    expect(
      await loi(ApplyTutorDto, { ...hoSoHopLe, dongYXuLyDuLieu: false }),
    ).toEqual(['dongYXuLyDuLieu']);
  });

  it('kiểm tra CCCD 12 số, giờ HH:mm và môn không lặp', async () => {
    expect(
      await loi(ApplyTutorDto, {
        ...hoSoHopLe,
        soCccd: '07920000104',
        lichRanh: [{ thu: 8, gioBatDau: '18h', gioKetThuc: '21:00' }],
        monDay: [
          { monHocId: 1, capHoc: ['THCS'] },
          { monHocId: 1, capHoc: ['THPT'] },
        ],
      }),
    ).toEqual(['soCccd', 'monDay', 'lichRanh']);
  });
});

describe('UpdateTutorDto', () => {
  it('cho phép gửi một phần, chặn trường không được sửa', async () => {
    expect(await loi(UpdateTutorDto, { diaChi: 'Quận 3' })).toEqual([]);
    expect(await loi(UpdateTutorDto, { soCccd: '079200001042' })).toEqual([
      'soCccd',
    ]);
  });

  it('cho gửi khuVucNhanDay rỗng khi đổi sang ONLINE (review PR #10)', async () => {
    expect(
      await loi(UpdateTutorDto, { hinhThucDay: 'ONLINE', khuVucNhanDay: [] }),
    ).toEqual([]);
    expect(await loi(UpdateTutorDto, { khuVucNhanDay: [] })).toEqual([]);
  });

  it('trường bắt buộc gửi null bị chặn; trường tùy chọn gửi null để xóa', async () => {
    const loiNull = await loi(UpdateTutorDto, {
      soDienThoai: null,
      email: null,
      hinhThucDay: null,
      khuVucNhanDay: null,
      taiKhoanNganHang: null,
    });
    expect(loiNull.sort()).toEqual([
      'email',
      'hinhThucDay',
      'khuVucNhanDay',
      'soDienThoai',
      'taiKhoanNganHang',
    ]);
    expect(
      await loi(UpdateTutorDto, {
        donViCongTac: null,
        thuLaoMongMuon: null,
        gioiThieu: null,
      }),
    ).toEqual([]);
  });
});

describe('ReviewTutorDto', () => {
  it('bắt buộc lý do khi từ chối', async () => {
    expect(await loi(ReviewTutorDto, { ketQua: 'DUYET' })).toEqual([]);
    expect(await loi(ReviewTutorDto, { ketQua: 'TU_CHOI' })).toEqual(['lyDo']);
  });
});

describe('ReplaceTutorSubjectsDto', () => {
  it('cần ít nhất một môn, mỗi môn có ít nhất một cấp học', async () => {
    expect(await loi(ReplaceTutorSubjectsDto, { monDay: [] })).toEqual([
      'monDay',
    ]);
    expect(
      await loi(ReplaceTutorSubjectsDto, {
        monDay: [{ monHocId: 1, capHoc: [] }],
      }),
    ).toEqual(['monDay']);
  });
});
