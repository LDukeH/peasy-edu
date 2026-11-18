import {
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { VaiTro } from '../../common/enums/tai-khoan.enum.js';
import { AuthService } from './auth.service.js';

const MAT_KHAU = 'MatKhau@123';
const HASH = bcrypt.hashSync(MAT_KHAU, 4);
const TOKENS = { accessToken: 'access', refreshToken: 'refresh' };

const taiKhoanDayDu = {
  id: 1,
  tenDangNhap: '0901234567',
  matKhauHash: HASH,
  trangThai: 'HOAT_DONG',
  lanDangNhapCuoi: null,
  ngayTao: new Date('2026-11-16T02:00:00.000Z'),
  vaiTro: { ma: 'PHU_HUYNH' },
  nhanVien: null,
  phuHuynh: {
    ma: 'PH00001',
    hoTen: 'Nguyễn Văn An',
    email: null,
    soDienThoai: '0901234567',
  },
  giaSu: null,
  hocVien: null,
};

describe('AuthService', () => {
  const prisma = { taiKhoan: { findUnique: vi.fn(), update: vi.fn() } };
  const users = { create: vi.fn() };
  const tokens = { issue: vi.fn(), verifyRefresh: vi.fn() };
  const service = new AuthService(
    prisma as never,
    users as never,
    tokens as never,
  );

  beforeEach(() => {
    vi.resetAllMocks();
    tokens.issue.mockResolvedValue(TOKENS);
  });

  describe('login', () => {
    const dto = { tenDangNhap: '0901234567', matKhau: MAT_KHAU };

    it('đúng mật khẩu: cập nhật lần đăng nhập, không trả matKhauHash', async () => {
      prisma.taiKhoan.findUnique.mockResolvedValue(taiKhoanDayDu);
      prisma.taiKhoan.update.mockResolvedValue(taiKhoanDayDu);

      const ketQua = await service.login(dto);

      expect(ketQua.tokens).toEqual(TOKENS);
      expect(ketQua.user.hoTen).toBe('Nguyễn Văn An');
      expect(ketQua.user.maDoiTuong).toBe('PH00001');
      expect(ketQua.user).not.toHaveProperty('matKhauHash');
      expect(prisma.taiKhoan.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { lanDangNhapCuoi: expect.any(Date) as Date },
        }),
      );
    });

    it('sai mật khẩu → 401', async () => {
      prisma.taiKhoan.findUnique.mockResolvedValue(taiKhoanDayDu);

      await expect(
        service.login({ ...dto, matKhau: 'SaiMatKhau1' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('không có tài khoản → 401, cùng thông báo với sai mật khẩu', async () => {
      prisma.taiKhoan.findUnique.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(
        'Sai tên đăng nhập hoặc mật khẩu',
      );
    });

    it('tài khoản khóa, đúng mật khẩu → 403', async () => {
      prisma.taiKhoan.findUnique.mockResolvedValue({
        ...taiKhoanDayDu,
        trangThai: 'BI_KHOA',
      });

      await expect(service.login(dto)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(tokens.issue).not.toHaveBeenCalled();
    });

    it('tài khoản khóa, sai mật khẩu → 401, không lộ trạng thái khóa', async () => {
      prisma.taiKhoan.findUnique.mockResolvedValue({
        ...taiKhoanDayDu,
        trangThai: 'BI_KHOA',
      });

      await expect(
        service.login({ ...dto, matKhau: 'SaiMatKhau1' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('register', () => {
    const dto = {
      hoTen: 'Nguyễn Văn An',
      soDienThoai: '0901234567',
      matKhau: MAT_KHAU,
    };

    it('luôn tạo vai trò PHU_HUYNH, tên đăng nhập là số điện thoại', async () => {
      users.create.mockResolvedValue({ id: 1 });

      const ketQua = await service.register(dto);

      expect(users.create).toHaveBeenCalledWith(
        expect.objectContaining({
          tenDangNhap: '0901234567',
          vaiTro: VaiTro.PHU_HUYNH,
        }),
      );
      expect(ketQua.tokens).toEqual(TOKENS);
    });

    it('trùng số điện thoại → 409 đúng thông báo của contract', async () => {
      users.create.mockRejectedValue(new ConflictException('Dữ liệu đã tồn tại'));

      await expect(service.register(dto)).rejects.toThrow(
        'Số điện thoại đã được đăng ký',
      );
    });
  });

  describe('refresh', () => {
    it('token hợp lệ, tài khoản hoạt động → cấp cặp token mới', async () => {
      tokens.verifyRefresh.mockResolvedValue(1);
      prisma.taiKhoan.findUnique.mockResolvedValue({
        id: 1,
        trangThai: 'HOAT_DONG',
      });

      await expect(service.refresh('refresh-cu')).resolves.toEqual(TOKENS);
    });

    it.each([undefined, 123, ''])('thiếu cookie (%s) → 401', async (cookie) => {
      tokens.verifyRefresh.mockResolvedValue(null);

      await expect(service.refresh(cookie)).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('tài khoản đã khóa → 401, không cấp token', async () => {
      tokens.verifyRefresh.mockResolvedValue(1);
      prisma.taiKhoan.findUnique.mockResolvedValue({
        id: 1,
        trangThai: 'BI_KHOA',
      });

      await expect(service.refresh('refresh-cu')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
      expect(tokens.issue).not.toHaveBeenCalled();
    });
  });
});
