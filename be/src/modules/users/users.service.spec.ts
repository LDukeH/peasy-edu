import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  TrangThaiTaiKhoan,
  VaiTro,
} from '../../common/enums/tai-khoan.enum.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import { UsersService } from './users.service.js';

const hoSoNhanVien = {
  ma: 'NV001',
  hoTen: 'Trần Thị Bình',
  email: 'binh@example.com',
  soDienThoai: '0912345678',
};
const nhanVien = {
  id: 2,
  tenDangNhap: 'dieuphoi01',
  matKhauHash: 'hash-bi-mat',
  trangThai: 'HOAT_DONG',
  lanDangNhapCuoi: null,
  ngayTao: new Date('2026-11-16T02:00:00.000Z'),
  vaiTro: { ma: 'DIEU_PHOI' },
  nhanVien: hoSoNhanVien,
  phuHuynh: null,
  giaSu: null,
  hocVien: null,
};
const phuHuynh = {
  ...nhanVien,
  id: 3,
  tenDangNhap: '0901234567',
  vaiTro: { ma: 'PHU_HUYNH' },
  nhanVien: null,
  phuHuynh: { ...hoSoNhanVien, ma: 'PH00001' },
};
const taoNhanVien = {
  tenDangNhap: 'dieuphoi02',
  matKhau: 'MatKhau@123',
  hoTen: 'Trần Thị Bình',
  email: 'binh@example.com',
  soDienThoai: '0912345678',
  vaiTro: VaiTro.DIEU_PHOI,
} satisfies CreateUserDto;

const loiPrisma = (code: string, target?: string[]) =>
  new Prisma.PrismaClientKnownRequestError('lỗi', {
    code,
    clientVersion: 'test',
    meta: { target },
  });

describe('UsersService', () => {
  const prisma = {
    $transaction: vi.fn(),
    taiKhoan: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    nhanVien: { findFirst: vi.fn() },
    phuHuynh: { findFirst: vi.fn() },
  };
  const service = new UsersService(prisma as never);

  beforeEach(() => {
    vi.resetAllMocks();
    prisma.nhanVien.findFirst.mockResolvedValue({ ma: 'NV007' });
    prisma.phuHuynh.findFirst.mockResolvedValue(null);
  });

  describe('findAll', () => {
    it('phân trang và không trả matKhauHash', async () => {
      prisma.$transaction.mockResolvedValue([[nhanVien], 21]);

      const ketQua = await service.findAll({ page: 2, pageSize: 20 });

      expect(prisma.taiKhoan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 20 }),
      );
      expect(ketQua).toMatchObject({ total: 21, page: 2, pageSize: 20 });
      expect(ketQua.items[0]).not.toHaveProperty('matKhauHash');
      expect(ketQua.items[0].hoTen).toBe('Trần Thị Bình');
    });
  });

  it('findOne: không có tài khoản → 404', async () => {
    prisma.taiKhoan.findUnique.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  describe('create', () => {
    it('băm mật khẩu và sinh mã nhân viên kế tiếp', async () => {
      prisma.taiKhoan.create.mockResolvedValue(nhanVien);

      await service.create(taoNhanVien);

      const { data } = prisma.taiKhoan.create.mock.calls[0][0] as {
        data: {
          matKhauHash: string;
          nhanVien: { create: { ma: string } };
        };
      };
      expect(data.nhanVien.create.ma).toBe('NV008');
      expect(data.matKhauHash).not.toBe(taoNhanVien.matKhau);
      await expect(
        bcrypt.compare(taoNhanVien.matKhau, data.matKhauHash),
      ).resolves.toBe(true);
    }, 10_000);

    it.each<[string, Partial<CreateUserDto>]>([
      ['gia sư', { vaiTro: VaiTro.GIA_SU }],
      ['nhân viên thiếu email', { email: undefined }],
      ['thiếu số điện thoại', { soDienThoai: undefined }],
      [
        'phụ huynh có tên đăng nhập khác số điện thoại',
        { vaiTro: VaiTro.PHU_HUYNH },
      ],
    ])('%s → 400', async (_tenCa, thayDoi) => {
      await expect(
        service.create({ ...taoNhanVien, ...thayDoi }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.taiKhoan.create).not.toHaveBeenCalled();
    });

    it('trùng tên đăng nhập → 409', async () => {
      prisma.taiKhoan.create.mockRejectedValue(
        loiPrisma('P2002', ['tenDangNhap']),
      );

      await expect(service.create(taoNhanVien)).rejects.toThrow(
        new ConflictException('Tên đăng nhập đã tồn tại'),
      );
    }, 10_000);
  });

  describe('update', () => {
    it('sửa thông tin vào đúng bảng hồ sơ', async () => {
      prisma.taiKhoan.findUnique.mockResolvedValue(phuHuynh);
      prisma.taiKhoan.update.mockResolvedValue(phuHuynh);

      await service.update(3, { hoTen: 'Tên mới' }, 1);

      expect(prisma.taiKhoan.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { phuHuynh: { update: { hoTen: 'Tên mới' } } },
        }),
      );
    });

    it('khóa nhân viên thì đồng bộ trạng thái bảng NhanVien', async () => {
      prisma.taiKhoan.findUnique.mockResolvedValue(nhanVien);
      prisma.taiKhoan.update.mockResolvedValue(nhanVien);

      await service.update(2, { trangThai: TrangThaiTaiKhoan.BI_KHOA }, 1);

      expect(prisma.taiKhoan.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            trangThai: 'BI_KHOA',
            nhanVien: { update: { trangThai: 'BI_KHOA' } },
          },
        }),
      );
    });

    it('đổi được vai trò giữa hai nhóm nhân viên', async () => {
      prisma.taiKhoan.findUnique.mockResolvedValue(nhanVien);
      prisma.taiKhoan.update.mockResolvedValue(nhanVien);

      await service.update(2, { vaiTro: VaiTro.QUAN_LY }, 1);

      expect(prisma.taiKhoan.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { vaiTro: { connect: { ma: 'QUAN_LY' } } },
        }),
      );
    });

    it('không đổi được phụ huynh thành nhân viên → 400', async () => {
      prisma.taiKhoan.findUnique.mockResolvedValue(phuHuynh);

      await expect(
        service.update(3, { vaiTro: VaiTro.QUAN_LY }, 1),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('không tự hạ vai trò của mình → 400', async () => {
      prisma.taiKhoan.findUnique.mockResolvedValue({
        ...nhanVien,
        vaiTro: { ma: 'QUAN_LY' },
      });

      await expect(
        service.update(2, { vaiTro: VaiTro.DIEU_PHOI }, 2),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('tài khoản không tồn tại → 404', async () => {
      prisma.taiKhoan.findUnique.mockResolvedValue(null);

      await expect(service.update(99, {}, 1)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('khóa mềm, không xóa bản ghi', async () => {
      prisma.taiKhoan.findUnique.mockResolvedValue(phuHuynh);
      prisma.taiKhoan.update.mockResolvedValue(phuHuynh);

      await service.remove(3, 1);

      expect(prisma.taiKhoan.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 3 },
          data: { trangThai: 'BI_KHOA' },
        }),
      );
    });

    it('không tự khóa tài khoản của mình → 400', async () => {
      prisma.taiKhoan.findUnique.mockResolvedValue(nhanVien);

      await expect(service.remove(2, 2)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(prisma.taiKhoan.update).not.toHaveBeenCalled();
    });
  });
});
