import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateParentDto } from './create-parent.dto.js';
import { UpdateParentDto } from './update-parent.dto.js';
import { ListParentsQueryDto } from './list-parents-query.dto.js';

async function loi<T extends object>(cls: new () => T, body: unknown) {
  return validate(plainToInstance(cls, body), {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
}
const hopLe = {
  hoTen: 'Nguyễn An',
  soDienThoai: '0901234567',
  dongYXuLyDuLieu: true,
};
describe('CreateParentDto', () => {
  it('nhận hồ sơ tối thiểu và đầy đủ', async () => {
    expect(await loi(CreateParentDto, hopLe)).toEqual([]);
    expect(
      await loi(CreateParentDto, {
        ...hopLe,
        email: 'an@example.com',
        zalo: '0901234567',
        diaChi: 'TP.HCM',
        kenhTiepNhan: 'Zalo',
        ghiChu: 'Khách mới',
      }),
    ).toEqual([]);
  });
  it.each(['hoTen', 'soDienThoai', 'dongYXuLyDuLieu'])(
    'bắt buộc %s',
    async (field) => {
      const body: Record<string, unknown> = { ...hopLe };
      delete body[field];
      expect(
        (await loi(CreateParentDto, body)).some((e) => e.property === field),
      ).toBe(true);
    },
  );
  it.each([
    ['hoTen', '   '],
    ['hoTen', 'a'.repeat(101)],
    ['soDienThoai', '090123456'],
    ['soDienThoai', '09012345678'],
    ['soDienThoai', '1901234567'],
    ['dongYXuLyDuLieu', false],
    ['dongYXuLyDuLieu', null],
    ['email', 'sai'],
    ['email', 'a'.repeat(255)],
    ['zalo', 'a'.repeat(51)],
    ['diaChi', 'a'.repeat(256)],
    ['kenhTiepNhan', 'a'.repeat(101)],
    ['ghiChu', 'a'.repeat(2001)],
    ['taiKhoanId', 1],
    ['matKhau', 'Password123'],
    ['ma', 'PH00001'],
  ])('chặn %s không hợp lệ (%s)', async (field, value) => {
    expect(
      await loi(CreateParentDto, { ...hopLe, [field]: value }),
    ).not.toEqual([]);
  });
});
describe('UpdateParentDto', () => {
  it('nhận PATCH rỗng và xóa liên hệ nullable', async () => {
    expect(await loi(UpdateParentDto, {})).toEqual([]);
    expect(
      await loi(UpdateParentDto, { email: null, zalo: null, diaChi: null }),
    ).toEqual([]);
    expect(await loi(UpdateParentDto, { hoTen: 'Tên mới' })).toEqual([]);
  });
  it.each(['hoTen', 'soDienThoai'])('không nhận null ở %s', async (field) => {
    expect(await loi(UpdateParentDto, { [field]: null })).not.toEqual([]);
  });
  it.each(['ghiChu', 'kenhTiepNhan', 'taiKhoanId', 'dongYXuLyDuLieu', 'ma'])(
    'chặn sửa %s',
    async (field) => {
      expect(await loi(UpdateParentDto, { [field]: 'x' })).not.toEqual([]);
    },
  );
});
describe('ListParentsQueryDto', () => {
  it('mặc định 1/20 và chuyển query số', async () => {
    expect(plainToInstance(ListParentsQueryDto, {})).toMatchObject({
      page: 1,
      pageSize: 20,
    });
    const query = plainToInstance(ListParentsQueryDto, {
      page: '2',
      pageSize: '100',
    });
    expect(query).toMatchObject({ page: 2, pageSize: 100 });
    expect(await loi(ListParentsQueryDto, query)).toEqual([]);
  });
  it.each([
    { page: 0 },
    { pageSize: 101 },
    { pageSize: 1.5 },
    { q: 'a'.repeat(101) },
  ])('chặn query sai %j', async (query) => {
    expect(await loi(ListParentsQueryDto, query)).not.toEqual([]);
  });
});

describe('CreateParentDto non-null optional fields', () => {
  it.each(['kenhTiepNhan', 'ghiChu'])('chặn null ở %s', async (field) => {
    expect(await loi(CreateParentDto, { ...hopLe, [field]: null })).not.toEqual(
      [],
    );
  });
});
