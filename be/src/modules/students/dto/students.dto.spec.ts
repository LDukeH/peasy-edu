import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateStudentDto } from './create-student.dto.js';
import { UpdateStudentDto } from './update-student.dto.js';
import { ListStudentsQueryDto } from './list-students-query.dto.js';
async function loi<T extends object>(cls: new () => T, body: unknown) {
  return validate(plainToInstance(cls, body), {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
}
const hopLe = {
  hoTen: 'Nguyễn An',
  ngaySinh: '2012-08-15',
  capHoc: 'THCS',
  khoiLop: '8',
  quanHeVoiNguoiDaiDien: 'Con',
  phuHuynhId: 1,
};
describe('CreateStudentDto', () => {
  it('nhận hồ sơ và enum dùng chung', async () => {
    for (const gioiTinh of ['NAM', 'NU'])
      expect(await loi(CreateStudentDto, { ...hopLe, gioiTinh })).toEqual([]);
    const { phuHuynhId: _bo, ...tuDaiDien } = hopLe;
    expect(
      await loi(CreateStudentDto, {
        ...tuDaiDien,
        ngaySinh: '2000-01-01',
        quanHeVoiNguoiDaiDien: 'Bản thân',
      }),
    ).toEqual([]);
  });
  it.each(['hoTen', 'ngaySinh', 'capHoc', 'khoiLop', 'quanHeVoiNguoiDaiDien'])(
    'bắt buộc %s',
    async (field) => {
      const body: Record<string, unknown> = { ...hopLe };
      delete body[field];
      expect(await loi(CreateStudentDto, body)).not.toEqual([]);
    },
  );
  it.each(['2012-08-15', '2024-02-29'])('nhận date %s', async (ngaySinh) => {
    expect(await loi(CreateStudentDto, { ...hopLe, ngaySinh })).toEqual([]);
  });
  it.each(['2023-02-29', '2012-02-30', '2012-8-15', '2012-08-15T00:00:00Z'])(
    'chặn date %s',
    async (ngaySinh) => {
      expect(await loi(CreateStudentDto, { ...hopLe, ngaySinh })).not.toEqual(
        [],
      );
    },
  );
  it.each([
    ['gioiTinh', 'KHAC'],
    ['capHoc', 'SAI'],
    ['phuHuynhId', -1],
    ['phuHuynhId', 1.5],
    ['hoTen', '  '],
    ['hoTen', 'a'.repeat(101)],
    ['khoiLop', 'a'.repeat(51)],
    ['quanHeVoiNguoiDaiDien', 'a'.repeat(51)],
    ['truong', 'a'.repeat(201)],
    ['hocLuc', 'a'.repeat(2001)],
    ['email', 'sai'],
    ['soDienThoai', '123'],
    ['taiKhoanId', 2],
    ['ma', 'HV00001'],
  ])('chặn %s sai', async (field, value) => {
    expect(
      await loi(CreateStudentDto, { ...hopLe, [field]: value }),
    ).not.toEqual([]);
  });
});
describe('UpdateStudentDto', () => {
  it('nhận phần sửa và nullable', async () => {
    expect(await loi(UpdateStudentDto, {})).toEqual([]);
    expect(
      await loi(UpdateStudentDto, {
        hoTen: 'Tên mới',
        truong: null,
        hocLuc: null,
        soDienThoai: null,
        email: null,
        diaChi: null,
      }),
    ).toEqual([]);
  });
  it.each(['hoTen', 'capHoc', 'khoiLop'])('chặn null ở %s', async (field) => {
    expect(await loi(UpdateStudentDto, { [field]: null })).not.toEqual([]);
  });
  it.each([
    'ngaySinh',
    'gioiTinh',
    'quanHeVoiNguoiDaiDien',
    'phuHuynhId',
    'taiKhoanId',
  ])('chặn sửa %s', async (field) => {
    expect(await loi(UpdateStudentDto, { [field]: 'x' })).not.toEqual([]);
  });
});
describe('ListStudentsQueryDto', () => {
  it('chuyển ID query và giữ mặc định', async () => {
    const q = plainToInstance(ListStudentsQueryDto, {
      phuHuynhId: '2',
      capHoc: 'THCS',
    });
    expect(q).toMatchObject({ page: 1, pageSize: 20, phuHuynhId: 2 });
    expect(await loi(ListStudentsQueryDto, q)).toEqual([]);
  });
  it.each([
    { phuHuynhId: -1 },
    { capHoc: 'SAI' },
    { pageSize: 101 },
    { q: 'a'.repeat(101) },
  ])('chặn query %j', async (q) => {
    expect(await loi(ListStudentsQueryDto, q)).not.toEqual([]);
  });
});

describe('CreateStudentDto non-null optional fields', () => {
  it.each(['phuHuynhId', 'gioiTinh'])('chặn null ở %s', async (field) => {
    expect(
      await loi(CreateStudentDto, { ...hopLe, [field]: null }),
    ).not.toEqual([]);
  });
});
