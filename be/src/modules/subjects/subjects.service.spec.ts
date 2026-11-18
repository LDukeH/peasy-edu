import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CapHoc,
  NhomMon,
  TrangThaiMonHoc,
} from '../../common/enums/mon-hoc.enum.js';
import { SubjectsService } from './subjects.service.js';

const toan = {
  id: 1,
  ma: 'MH01',
  ten: 'Toán',
  nhom: 'VAN_HOA',
  capHocApDung: ['THCS', 'THPT'],
  moTa: null,
  dangSuDung: true,
};
const taoToan = {
  tenMon: 'Toán',
  nhomMon: NhomMon.VAN_HOA,
  capHoc: [CapHoc.THCS, CapHoc.THPT],
};

const loiPrisma = (code: string) =>
  new Prisma.PrismaClientKnownRequestError('lỗi', {
    code,
    clientVersion: 'test',
  });

describe('SubjectsService', () => {
  const prisma = {
    monHoc: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
  const service = new SubjectsService(prisma as never);

  beforeEach(() => vi.resetAllMocks());

  it('findAll: đổi tên trường theo contract và lọc theo trạng thái', async () => {
    prisma.monHoc.findMany.mockResolvedValue([{ ...toan, dangSuDung: false }]);

    const ketQua = await service.findAll({
      capHoc: CapHoc.THCS,
      trangThai: TrangThaiMonHoc.NGUNG_SU_DUNG,
    });

    expect(prisma.monHoc.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { capHocApDung: { has: 'THCS' }, dangSuDung: false },
      }),
    );
    expect(ketQua[0]).toEqual({
      id: 1,
      ma: 'MH01',
      tenMon: 'Toán',
      nhomMon: 'VAN_HOA',
      capHoc: ['THCS', 'THPT'],
      moTa: null,
      trangThai: 'NGUNG_SU_DUNG',
    });
  });

  it('findOne: không có môn → 404', async () => {
    prisma.monHoc.findUnique.mockResolvedValue(null);

    await expect(service.findOne(9)).rejects.toBeInstanceOf(NotFoundException);
  });

  describe('create', () => {
    it('sinh mã theo số lớn nhất, kể cả khi đã quá MH99', async () => {
      prisma.monHoc.findMany.mockResolvedValue([
        { ma: 'MH99' },
        { ma: 'MH100' },
      ]);
      prisma.monHoc.create.mockResolvedValue(toan);

      await service.create(taoToan);

      expect(prisma.monHoc.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ ma: 'MH101' }) as object,
      });
    });

    it('TT 29: môn văn hóa không áp dụng cấp Tiểu học → 400', async () => {
      await expect(
        service.create({ ...taoToan, capHoc: [CapHoc.TIEU_HOC] }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('môn năng khiếu áp dụng được cấp Tiểu học', async () => {
      prisma.monHoc.findMany.mockResolvedValue([]);
      prisma.monHoc.create.mockResolvedValue(toan);

      await expect(
        service.create({
          tenMon: 'Piano',
          nhomMon: NhomMon.NANG_KHIEU_KY_NANG,
          capHoc: [CapHoc.TIEU_HOC],
        }),
      ).resolves.toBeDefined();
    });

    it('trùng tên môn → 409', async () => {
      prisma.monHoc.findMany.mockResolvedValue([]);
      prisma.monHoc.create.mockRejectedValue(loiPrisma('P2002'));

      await expect(service.create(taoToan)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('chỉ đổi cấp học vẫn kiểm tra với nhóm môn đang lưu', async () => {
      prisma.monHoc.findUnique.mockResolvedValue(toan);

      await expect(
        service.update(1, { capHoc: [CapHoc.TIEU_HOC] }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.monHoc.update).not.toHaveBeenCalled();
    });

    it('ngừng sử dụng ghi vào cột dangSuDung', async () => {
      prisma.monHoc.findUnique.mockResolvedValue(toan);
      prisma.monHoc.update.mockResolvedValue({ ...toan, dangSuDung: false });

      const ketQua = await service.update(1, {
        trangThai: TrangThaiMonHoc.NGUNG_SU_DUNG,
      });

      expect(prisma.monHoc.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ dangSuDung: false }) as object,
        }),
      );
      expect(ketQua.trangThai).toBe(TrangThaiMonHoc.NGUNG_SU_DUNG);
    });
  });

  describe('remove', () => {
    it('môn chưa dùng → xóa được', async () => {
      prisma.monHoc.delete.mockResolvedValue(toan);

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('môn đã gắn dữ liệu (P2003) → 409', async () => {
      prisma.monHoc.delete.mockRejectedValue(loiPrisma('P2003'));

      await expect(service.remove(1)).rejects.toBeInstanceOf(ConflictException);
    });

    it('không có môn (P2025) → 404', async () => {
      prisma.monHoc.delete.mockRejectedValue(loiPrisma('P2025'));

      await expect(service.remove(9)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
