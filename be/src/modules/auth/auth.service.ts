import { randomBytes } from 'node:crypto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import {
  TrangThaiTaiKhoan,
  VaiTro,
} from '../../common/enums/tai-khoan.enum.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { UserDto } from '../users/dto/user.dto.js';
import { TAI_KHOAN_INCLUDE, toUserDto } from '../users/user.mapper.js';
import { UsersService } from '../users/users.service.js';
import { BCRYPT_ROUNDS } from './auth.constants.js';
import type { LoginDto } from './dto/login.dto.js';
import type { RegisterDto } from './dto/register.dto.js';
import { type TokenPair, TokenService } from './token.service.js';

export interface AuthResult {
  user: UserDto;
  tokens: TokenPair;
  persistent: boolean;
}

export interface RefreshResult {
  tokens: TokenPair;
  persistent: boolean;
}

const PHIEN_KHONG_HOP_LE = 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn';

@Injectable()
export class AuthService {
  /** So khớp cả khi không có tài khoản để không dò được tên đăng nhập qua thời gian phản hồi. */
  private readonly hashGia = bcrypt.hash(
    randomBytes(32).toString('hex'),
    BCRYPT_ROUNDS,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly tokens: TokenService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResult> {
    const taiKhoan = await this.prisma.taiKhoan.findUnique({
      where: { tenDangNhap: dto.tenDangNhap },
      select: { id: true, matKhauHash: true, trangThai: true },
    });
    const dungMatKhau = await bcrypt.compare(
      dto.matKhau,
      taiKhoan?.matKhauHash ?? (await this.hashGia),
    );
    if (!taiKhoan || !dungMatKhau) {
      throw new UnauthorizedException('Sai tên đăng nhập hoặc mật khẩu');
    }
    // Chỉ báo khóa sau khi đúng mật khẩu, tránh lộ trạng thái tài khoản.
    if (taiKhoan.trangThai !== TrangThaiTaiKhoan.HOAT_DONG) {
      throw new ForbiddenException('Tài khoản đã bị khóa');
    }

    const persistent = dto.ghiNho !== false;
    const capNhat = await this.prisma.taiKhoan.update({
      where: { id: taiKhoan.id },
      data: { lanDangNhapCuoi: new Date() },
      include: TAI_KHOAN_INCLUDE,
    });
    return {
      user: toUserDto(capNhat),
      tokens: await this.tokens.issue(capNhat.id, persistent),
      persistent,
    };
  }

  async register(dto: RegisterDto): Promise<AuthResult> {
    try {
      const user = await this.users.create({
        tenDangNhap: dto.soDienThoai,
        matKhau: dto.matKhau,
        hoTen: dto.hoTen,
        soDienThoai: dto.soDienThoai,
        email: dto.email,
        vaiTro: VaiTro.PHU_HUYNH,
      });
      return {
        user,
        tokens: await this.tokens.issue(user.id, true),
        persistent: true,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Số điện thoại đã được đăng ký');
      }
      throw error;
    }
  }

  async refresh(refreshToken: unknown): Promise<RefreshResult> {
    const verified =
      typeof refreshToken === 'string'
        ? await this.tokens.verifyRefresh(refreshToken)
        : null;
    if (verified === null) {
      throw new UnauthorizedException(PHIEN_KHONG_HOP_LE);
    }

    const taiKhoan = await this.prisma.taiKhoan.findUnique({
      where: { id: verified.taiKhoanId },
      select: { id: true, trangThai: true },
    });
    if (taiKhoan?.trangThai !== TrangThaiTaiKhoan.HOAT_DONG) {
      throw new UnauthorizedException(PHIEN_KHONG_HOP_LE);
    }
    return {
      tokens: await this.tokens.issue(taiKhoan.id, verified.persistent),
      persistent: verified.persistent,
    };
  }
}
