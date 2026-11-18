import { Prisma } from '@prisma/client';
import { maTiepTheo, thuLaiKhiTrungMa } from './ma-nghiep-vu.js';

const loiTrung = (target: string[]) =>
  new Prisma.PrismaClientKnownRequestError('trùng', {
    code: 'P2002',
    clientVersion: 'test',
    meta: { target },
  });

describe('maTiepTheo', () => {
  it('bắt đầu từ 1 khi chưa có mã', () => {
    expect(maTiepTheo('PH', 5, [])).toBe('PH00001');
  });

  it('lấy số lớn nhất và giữ độ rộng', () => {
    expect(maTiepTheo('MH', 2, ['MH02', 'MH09', 'MH03'])).toBe('MH10');
  });

  it('vượt độ rộng khi quá 99 môn', () => {
    expect(maTiepTheo('MH', 2, ['MH99', 'MH100'])).toBe('MH101');
  });
});

describe('thuLaiKhiTrungMa', () => {
  it('thử lại khi trùng cột ma', async () => {
    const thucHien = vi
      .fn()
      .mockRejectedValueOnce(loiTrung(['ma']))
      .mockResolvedValue('ok');

    await expect(thuLaiKhiTrungMa(thucHien)).resolves.toBe('ok');
    expect(thucHien).toHaveBeenCalledTimes(2);
  });

  it('dừng sau 3 lần và ném lỗi', async () => {
    const thucHien = vi.fn().mockRejectedValue(loiTrung(['ma']));

    await expect(thuLaiKhiTrungMa(thucHien)).rejects.toThrow('trùng');
    expect(thucHien).toHaveBeenCalledTimes(3);
  });

  it('không thử lại khi trùng cột khác', async () => {
    const thucHien = vi.fn().mockRejectedValue(loiTrung(['soDienThoai']));

    await expect(thuLaiKhiTrungMa(thucHien)).rejects.toThrow('trùng');
    expect(thucHien).toHaveBeenCalledTimes(1);
  });
});
