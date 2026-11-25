import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateRequestDto } from './create-request.dto.js';
import { UpdateRequestDto } from './update-request.dto.js';
import { ListRequestsQueryDto } from './list-requests-query.dto.js';
import {
  SubmitRequestDto,
  SubmitParentRegistrationDto,
  SubmitSelfRegistrationDto,
} from './submit-request.dto.js';
import { UpdateRequestStatusDto } from './update-request-status.dto.js';
async function loi<T extends object>(cls: new () => T, body: unknown) {
  return validate(plainToInstance(cls, body), {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
}
const nhuCau = {
  monHocId: 1,
  capHoc: 'THCS',
  khoiLop: '8',
  mucTieu: 'Củng cố kiến thức',
  hinhThuc: 'ONLINE',
  soBuoiMoiTuan: 2,
  thoiLuongPhut: 90,
  khungGioMongMuon: [{ thu: 2, gioBatDau: '18:00', gioKetThuc: '19:30' }],
};
const hocVien = {
  hoTen: 'Nguyễn An',
  ngaySinh: '2012-08-15',
  capHoc: 'THCS',
  khoiLop: '8',
  quanHeVoiNguoiDaiDien: 'Con',
};
const phuHuynh = {
  hoTen: 'Nguyễn Minh',
  soDienThoai: '0901234567',
  dongYXuLyDuLieu: true,
};
const dangKyPH = {
  loaiDangKy: 'PHU_HUYNH',
  phuHuynh,
  hocVien: [hocVien],
  matKhau: 'MatKhau123',
};
const { quanHeVoiNguoiDaiDien: _bo, ...thongTinBanThan } = hocVien;
const dangKyBT = {
  loaiDangKy: 'BAN_THAN',
  banThan: {
    ...thongTinBanThan,
    ngaySinh: '2000-08-15',
    soDienThoai: '0901234567',
  },
  matKhau: 'MatKhau123',
  dongYXuLyDuLieu: true,
};
const create = { nguoiThanhToanId: 1, hocVienIds: [1], nhuCau };
describe('CreateRequestDto', () => {
  it('nhận 1–4 học viên và giới hạn biên hợp lệ', async () => {
    expect(await loi(CreateRequestDto, create)).toEqual([]);
    expect(
      await loi(CreateRequestDto, { ...create, hocVienIds: [1, 2, 3, 4] }),
    ).toEqual([]);
    for (const soBuoiMoiTuan of [1, 7])
      expect(
        await loi(CreateRequestDto, {
          ...create,
          nhuCau: { ...nhuCau, soBuoiMoiTuan },
        }),
      ).toEqual([]);
    for (const thoiLuongPhut of [1, 1440])
      expect(
        await loi(CreateRequestDto, {
          ...create,
          nhuCau: { ...nhuCau, thoiLuongPhut },
        }),
      ).toEqual([]);
  });
  it.each(['nguoiThanhToanId', 'hocVienIds', 'nhuCau'])(
    'bắt buộc %s',
    async (field) => {
      const b: Record<string, unknown> = { ...create };
      delete b[field];
      expect(await loi(CreateRequestDto, b)).not.toEqual([]);
    },
  );
  it.each([[], [1, 1], [1, 2, 3, 4, 5], [-1], [1.5], ['1']])(
    'chặn danh sách HV %j',
    async (hocVienIds) => {
      expect(
        await loi(CreateRequestDto, { ...create, hocVienIds }),
      ).not.toEqual([]);
    },
  );
  it.each([
    ['monHocId', 0],
    ['capHoc', 'SAI'],
    ['mucTieu', '  '],
    ['khoiLop', 'a'.repeat(51)],
    ['soBuoiMoiTuan', 0],
    ['soBuoiMoiTuan', 8],
    ['thoiLuongPhut', 0],
    ['thoiLuongPhut', 1441],
    ['nganSachMoiBuoi', 0],
    ['nganSachMoiBuoi', 2147483648],
    ['ngayMuonBatDau', '2023-02-29'],
    ['ngayMuonBatDau', '2026-12-01T00:00:00Z'],
    ['khungGioMongMuon', []],
    [
      'khungGioMongMuon',
      Array(51).fill({ thu: 2, gioBatDau: '18:00', gioKetThuc: '19:00' }),
    ],
    ['khungGioMongMuon', [{ thu: 0, gioBatDau: '18:00', gioKetThuc: '19:00' }]],
    ['khungGioMongMuon', [{ thu: 8, gioBatDau: '18:00', gioKetThuc: '19:00' }]],
    ['khungGioMongMuon', [{ thu: 2, gioBatDau: '24:00', gioKetThuc: '19:00' }]],
    ['khungGioMongMuon', [{ thu: 2, gioBatDau: '18h', gioKetThuc: '19:00' }]],
    [
      'khungGioMongMuon',
      [{ thu: 2, gioBatDau: '18:00', gioKetThuc: '19:00', id: 1 }],
    ],
  ])('chặn nhu cầu sai %s', async (field, value) => {
    const errors = await loi(CreateRequestDto, {
      ...create,
      nhuCau: { ...nhuCau, [field]: value },
    });
    expect(
      errors.some(
        (e) =>
          e.property === 'nhuCau' &&
          e.children?.some((c) => c.property === field),
      ),
    ).toBe(true);
  });
  it('bắt buộc địa chỉ tại nhà', async () => {
    for (const diaChi of [undefined, '', '  ', null])
      expect(
        await loi(CreateRequestDto, {
          ...create,
          nhuCau: { ...nhuCau, hinhThuc: 'TAI_NHA', diaChi },
        }),
      ).not.toEqual([]);
    expect(
      await loi(CreateRequestDto, {
        ...create,
        nhuCau: {
          ...nhuCau,
          hinhThuc: 'TAI_NHA',
          diaChi: 'TP.HCM',
          ngayMuonBatDau: '2028-02-29',
        },
      }),
    ).toEqual([]);
  });
});
describe('UpdateRequestDto', () => {
  it('nhận PATCH lồng và không bắt nhập lại địa chỉ cũ', async () => {
    for (const body of [
      {},
      { nhuCau: { mucTieu: 'Ôn thi' } },
      { nhuCau: { hinhThuc: 'TAI_NHA' } },
      { nhanVienPhuTrachId: 2 },
      { nhuCau: { diaChi: null, ngayMuonBatDau: null, nganSachMoiBuoi: null } },
    ])
      expect(await loi(UpdateRequestDto, body)).toEqual([]);
  });
  it.each([
    { nhuCau: null },
    { nhuCau: { mucTieu: null } },
    { nhuCau: { monHocId: null } },
    { nhanVienPhuTrachId: null },
    { mucTieu: 'Ôn thi' },
    { nguoiThanhToanId: 2 },
    { hocVienIds: [1] },
    { kenhTiepNhan: 'Zalo' },
    { trangThai: 'MOI' },
    { ma: 'YC00001' },
  ])('chặn PATCH %j', async (b) => {
    expect(await loi(UpdateRequestDto, b)).not.toEqual([]);
  });
});
describe('ListRequestsQueryDto', () => {
  it.each([
    'MOI',
    'DA_TU_VAN',
    'DANG_TIM_GS',
    'DA_DE_XUAT',
    'DANG_HOC_THU',
    'THANH_CONG',
    'HUY',
  ])('nhận filter %s', async (trangThai) => {
    const q = plainToInstance(ListRequestsQueryDto, {
      trangThai,
      monHocId: '1',
      nguoiThanhToanId: '2',
      nhanVienPhuTrachId: '3',
    });
    expect(q).toMatchObject({
      page: 1,
      pageSize: 20,
      monHocId: 1,
      nguoiThanhToanId: 2,
      nhanVienPhuTrachId: 3,
    });
    expect(await loi(ListRequestsQueryDto, q)).toEqual([]);
  });
  it.each([
    { trangThai: 'SAI' },
    { monHocId: -1 },
    { pageSize: 101 },
    { q: 'a'.repeat(101) },
  ])('chặn query %j', async (b) => {
    expect(await loi(ListRequestsQueryDto, b)).not.toEqual([]);
  });
});
describe('SubmitRequestDto', () => {
  it('chọn đúng subtype và nhận hai luồng', async () => {
    for (const dangKy of [dangKyPH, dangKyBT])
      expect(await loi(SubmitRequestDto, { dangKy, nhuCau })).toEqual([]);
    expect(
      plainToInstance(SubmitRequestDto, { dangKy: dangKyPH, nhuCau }).dangKy,
    ).toBeInstanceOf(SubmitParentRegistrationDto);
    expect(
      plainToInstance(SubmitRequestDto, { dangKy: dangKyBT, nhuCau }).dangKy,
    ).toBeInstanceOf(SubmitSelfRegistrationDto);
  });
  it.each([
    undefined,
    null,
    [],
    {},
    { ...dangKyPH, loaiDangKy: undefined },
    { ...dangKyPH, loaiDangKy: 'SAI' },
    { ...dangKyPH, banThan: dangKyBT.banThan },
    { ...dangKyBT, phuHuynh },
    { ...dangKyBT, banThan: { ...dangKyBT.banThan, soDienThoai: undefined } },
    { ...dangKyPH, phuHuynh: { ...phuHuynh, dongYXuLyDuLieu: false } },
    { ...dangKyBT, dongYXuLyDuLieu: null },
    { ...dangKyBT, dongYXuLyDuLieu: undefined },
    { ...dangKyPH, hocVien: [] },
    { ...dangKyPH, hocVien: Array(5).fill(hocVien) },
    { ...dangKyPH, hocVien: [{ ...hocVien, phuHuynhId: 1 }] },
    {
      ...dangKyBT,
      banThan: { ...dangKyBT.banThan, quanHeVoiNguoiDaiDien: 'Bản thân' },
    },
  ])('chặn nhánh sai %j', async (dangKy) => {
    expect(await loi(SubmitRequestDto, { dangKy, nhuCau })).not.toEqual([]);
  });
  it('báo đúng đường dẫn lỗi nested', async () => {
    const errors = await loi(SubmitRequestDto, {
      dangKy: { ...dangKyPH, phuHuynh: { ...phuHuynh, hoTen: ' ' } },
      nhuCau,
    });
    expect(
      errors
        .find((e) => e.property === 'dangKy')
        ?.children?.find((e) => e.property === 'phuHuynh')
        ?.children?.some((e) => e.property === 'hoTen'),
    ).toBe(true);
  });
  it.each([7, 73])('chặn mật khẩu %s ký tự', async (n) => {
    for (const dangKy of [dangKyPH, dangKyBT])
      expect(
        await loi(SubmitRequestDto, {
          dangKy: { ...dangKy, matKhau: 'a'.repeat(n) },
          nhuCau,
        }),
      ).not.toEqual([]);
  });
  it.each([8, 72])('nhận mật khẩu %s ký tự', async (n) => {
    for (const dangKy of [dangKyPH, dangKyBT])
      expect(
        await loi(SubmitRequestDto, {
          dangKy: { ...dangKy, matKhau: 'a'.repeat(n) },
          nhuCau,
        }),
      ).toEqual([]);
  });
  it.each([
    'id',
    'ma',
    'trangThai',
    'nhanVienPhuTrachId',
    'kenhTiepNhan',
    'taiKhoanId',
  ])('chặn trường server %s', async (field) => {
    expect(
      await loi(SubmitRequestDto, { dangKy: dangKyPH, nhuCau, [field]: 1 }),
    ).not.toEqual([]);
  });
});
describe('UpdateRequestStatusDto', () => {
  it.each(['DA_TU_VAN', 'DANG_TIM_GS'])('nhận đích %s', async (trangThai) => {
    expect(await loi(UpdateRequestStatusDto, { trangThai })).toEqual([]);
  });
  it('nhận hủy có lý do 1–500 ký tự', async () => {
    for (const lyDoHuy of ['x', 'x'.repeat(500)])
      expect(
        await loi(UpdateRequestStatusDto, { trangThai: 'HUY', lyDoHuy }),
      ).toEqual([]);
  });
  it.each([undefined, null, '', '   ', 'x'.repeat(501)])(
    'chặn lý do hủy sai %s',
    async (lyDoHuy) => {
      expect(
        await loi(UpdateRequestStatusDto, { trangThai: 'HUY', lyDoHuy }),
      ).not.toEqual([]);
    },
  );
  it.each(['MOI', 'DA_DE_XUAT', 'DANG_HOC_THU', 'THANH_CONG', 'SAI'])(
    'chặn đích %s',
    async (trangThai) => {
      expect(await loi(UpdateRequestStatusDto, { trangThai })).not.toEqual([]);
    },
  );
  it.each([null, 'Lý do'])('chặn lý do ngoài ngữ cảnh %s', async (lyDoHuy) => {
    expect(
      await loi(UpdateRequestStatusDto, { trangThai: 'DA_TU_VAN', lyDoHuy }),
    ).not.toEqual([]);
  });
});

describe('Nested object array regression', () => {
  it('không nhận mảng lồng thay cho khung giờ', async () => {
    expect(
      await loi(CreateRequestDto, {
        ...create,
        nhuCau: { ...nhuCau, khungGioMongMuon: [[]] },
      }),
    ).not.toEqual([]);
    expect(
      await loi(UpdateRequestDto, { nhuCau: { khungGioMongMuon: [[]] } }),
    ).not.toEqual([]);
  });
  it('không nhận mảng lồng thay cho học viên công khai', async () => {
    expect(
      await loi(SubmitRequestDto, {
        dangKy: { ...dangKyPH, hocVien: [[]] },
        nhuCau,
      }),
    ).not.toEqual([]);
  });
});
describe('SubmitRequestDto ValidationPipe regression', () => {
  it.each([{ value: [null] }, { value: [[null]] }, { value: [null, {}] }])(
    'trả 400 cho dangKy là mảng sai %j',
    async ({ value }) => {
      const pipe = new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      await expect(
        pipe.transform(
          { dangKy: value, nhuCau },
          { type: 'body', metatype: SubmitRequestDto },
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );
});
describe('Required text and Unicode contract regression', () => {
  it('chặn mật khẩu chỉ có khoảng trắng và giữ khoảng trắng bên trong', async () => {
    expect(
      await loi(SubmitRequestDto, {
        dangKy: { ...dangKyPH, matKhau: '        ' },
        nhuCau,
      }),
    ).not.toEqual([]);
    expect(
      await loi(SubmitRequestDto, {
        dangKy: { ...dangKyPH, matKhau: 'ab cd ef' },
        nhuCau,
      }),
    ).toEqual([]);
  });
  it('đếm lý do hủy theo ký tự Unicode như MaxLength', async () => {
    expect(
      await loi(UpdateRequestStatusDto, {
        trangThai: 'HUY',
        lyDoHuy: '😀'.repeat(500),
      }),
    ).toEqual([]);
    expect(
      await loi(UpdateRequestStatusDto, {
        trangThai: 'HUY',
        lyDoHuy: '😀'.repeat(501),
      }),
    ).not.toEqual([]);
  });
});
