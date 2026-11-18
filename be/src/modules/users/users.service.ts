import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { maTiepTheo, thuLaiKhiTrungMa } from '../../common/ma-nghiep-vu.js';
import { maLoiPrisma, truongBiTrung } from '../../common/prisma-errors.js';
import {
  TrangThaiTaiKhoan,
  VaiTro,
} from '../../common/enums/tai-khoan.enum.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { BCRYPT_ROUNDS } from '../auth/auth.constants.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { ListUsersQueryDto } from './dto/list-users-query.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { UserListResponseDto } from './dto/user-list-response.dto.js';
import type { UserDto } from './dto/user.dto.js';
import {
  TAI_KHOAN_INCLUDE,
  type TaiKhoanDayDu,
  toUserDto,
} from './user.mapper.js';

const VAI_TRO_NHAN_VIEN: readonly VaiTro[] = [
  VaiTro.QUAN_LY,
  VaiTro.DIEU_PHOI,
];
const LOAI_HO_SO = ['nhanVien', 'phuHuynh', 'giaSu', 'hocVien'] as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListUsersQueryDto): Promise<UserListResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const where = this.dieuKienLoc(query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.taiKhoan.findMany({
        where,
        include: TAI_KHOAN_INCLUDE,
        orderBy: [{ ngayTao: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.taiKhoan.count({ where }),
    ]);
    return { items: items.map(toUserDto), total, page, pageSize };
  }

  async findOne(id: number): Promise<UserDto> {
    return toUserDto(await this.layTaiKhoan(id));
  }

  async create(dto: CreateUserDto): Promise<UserDto> {
    this.kiemTraHoSoKhiTao(dto);
    const matKhauHash = await bcrypt.hash(dto.matKhau, BCRYPT_ROUNDS);

    try {
      const taiKhoan = await thuLaiKhiTrungMa(async () =>
        this.prisma.taiKhoan.create({
          data: {
            tenDangNhap: dto.tenDangNhap,
            matKhauHash,
            vaiTro: { connect: { ma: dto.vaiTro } },
            ...(await this.taoHoSo(dto)),
          },
          include: TAI_KHOAN_INCLUDE,
        }),
      );
      return toUserDto(taiKhoan);
    } catch (error) {
      if (maLoiPrisma(error) === 'P2025') {
        throw new InternalServerErrorException(
          'Chưa có dữ liệu vai trò, cần chạy seed',
        );
      }
      throw this.chuyenLoiTrung(error);
    }
  }

  async update(
    id: number,
    dto: UpdateUserDto,
    nguoiThucHienId: number,
  ): Promise<UserDto> {
    const taiKhoan = await this.layTaiKhoan(id);
    const doiVaiTro =
      dto.vaiTro !== undefined && dto.vaiTro !== taiKhoan.vaiTro.ma;
    this.kiemTraQuyenSua(taiKhoan, dto, doiVaiTro, nguoiThucHienId);

    const data = await this.duLieuCapNhat(taiKhoan, dto, doiVaiTro);
    try {
      const capNhat = await this.prisma.taiKhoan.update({
        where: { id },
        data,
        include: TAI_KHOAN_INCLUDE,
      });
      return toUserDto(capNhat);
    } catch (error) {
      throw this.chuyenLoiTrung(error);
    }
  }

  /** Xóa mềm: giữ bản ghi vì còn liên kết nhật ký và dữ liệu nghiệp vụ. */
  async remove(id: number, nguoiThucHienId: number): Promise<void> {
    await this.update(
      id,
      { trangThai: TrangThaiTaiKhoan.BI_KHOA },
      nguoiThucHienId,
    );
  }

  private dieuKienLoc(query: ListUsersQueryDto): Prisma.TaiKhoanWhereInput {
    const tuKhoa = query.q?.trim();
    const khop = { contains: tuKhoa, mode: 'insensitive' } as const;
    const khopHoSo = {
      OR: [{ hoTen: khop }, { email: khop }, { soDienThoai: khop }],
    };
    return {
      ...(query.vaiTro && { vaiTro: { ma: query.vaiTro } }),
      ...(query.trangThai && { trangThai: query.trangThai }),
      ...(tuKhoa && {
        OR: [
          { tenDangNhap: khop },
          { nhanVien: khopHoSo },
          { phuHuynh: khopHoSo },
          { giaSu: khopHoSo },
          { hocVien: khopHoSo },
        ],
      }),
    };
  }

  private async layTaiKhoan(id: number): Promise<TaiKhoanDayDu> {
    const taiKhoan = await this.prisma.taiKhoan.findUnique({
      where: { id },
      include: TAI_KHOAN_INCLUDE,
    });
    if (!taiKhoan) throw new NotFoundException('Không tìm thấy tài khoản');
    return taiKhoan;
  }

  /** Các trường bắt buộc của bảng hồ sơ nhưng tùy chọn trong CreateUserDto. */
  private kiemTraHoSoKhiTao(dto: CreateUserDto): void {
    if (dto.vaiTro === VaiTro.GIA_SU) {
      throw new BadRequestException(
        'Tài khoản gia sư được tạo qua luồng ứng tuyển',
      );
    }
    if (!dto.soDienThoai) {
      throw new BadRequestException('soDienThoai là bắt buộc với vai trò này');
    }
    if (VAI_TRO_NHAN_VIEN.includes(dto.vaiTro) && !dto.email) {
      throw new BadRequestException('email là bắt buộc với tài khoản nhân viên');
    }
    if (
      dto.vaiTro === VaiTro.PHU_HUYNH &&
      dto.tenDangNhap !== dto.soDienThoai
    ) {
      throw new BadRequestException(
        'Phụ huynh dùng số điện thoại làm tên đăng nhập',
      );
    }
  }

  private async taoHoSo(
    dto: CreateUserDto,
  ): Promise<Pick<Prisma.TaiKhoanCreateInput, 'nhanVien' | 'phuHuynh'>> {
    const soDienThoai = dto.soDienThoai as string;
    if (dto.vaiTro === VaiTro.PHU_HUYNH) {
      const moiNhat = await this.prisma.phuHuynh.findFirst({
        where: { ma: { startsWith: 'PH' } },
        orderBy: { ma: 'desc' },
        select: { ma: true },
      });
      return {
        phuHuynh: {
          create: {
            ma: maTiepTheo('PH', 5, moiNhat ? [moiNhat.ma] : []),
            hoTen: dto.hoTen,
            soDienThoai,
            email: dto.email ?? null,
          },
        },
      };
    }

    const moiNhat = await this.prisma.nhanVien.findFirst({
      where: { ma: { startsWith: 'NV' } },
      orderBy: { ma: 'desc' },
      select: { ma: true },
    });
    return {
      nhanVien: {
        create: {
          ma: maTiepTheo('NV', 3, moiNhat ? [moiNhat.ma] : []),
          hoTen: dto.hoTen,
          soDienThoai,
          email: dto.email as string,
        },
      },
    };
  }

  private kiemTraQuyenSua(
    taiKhoan: TaiKhoanDayDu,
    dto: UpdateUserDto,
    doiVaiTro: boolean,
    nguoiThucHienId: number,
  ): void {
    // Luôn còn ít nhất một quản lý vì không ai tự khóa hoặc tự hạ quyền được.
    if (taiKhoan.id === nguoiThucHienId) {
      if (dto.trangThai === TrangThaiTaiKhoan.BI_KHOA) {
        throw new BadRequestException('Không thể tự khóa tài khoản của mình');
      }
      if (doiVaiTro) {
        throw new BadRequestException('Không thể tự đổi vai trò của mình');
      }
    }
    // Đổi sang nhóm khác cần hồ sơ khác (GiaSu, PhuHuynh), không đổi trực tiếp được.
    if (
      doiVaiTro &&
      !(taiKhoan.nhanVien && VAI_TRO_NHAN_VIEN.includes(dto.vaiTro as VaiTro))
    ) {
      throw new BadRequestException(
        'Chỉ đổi được vai trò giữa QUAN_LY và DIEU_PHOI',
      );
    }
  }

  private async duLieuCapNhat(
    taiKhoan: TaiKhoanDayDu,
    dto: UpdateUserDto,
    doiVaiTro: boolean,
  ): Promise<Prisma.TaiKhoanUpdateInput> {
    const thongTin = {
      ...(dto.hoTen !== undefined && { hoTen: dto.hoTen }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.soDienThoai !== undefined && { soDienThoai: dto.soDienThoai }),
    };
    const loaiHoSo = LOAI_HO_SO.find((loai) => taiKhoan[loai] !== null);
    if (Object.keys(thongTin).length > 0 && !loaiHoSo) {
      throw new BadRequestException('Tài khoản chưa liên kết hồ sơ');
    }

    // NhanVien có cột trangThai riêng, phải khớp với trạng thái tài khoản.
    const capNhatHoSo = {
      ...thongTin,
      ...(loaiHoSo === 'nhanVien' &&
        dto.trangThai && { trangThai: dto.trangThai }),
    };
    return {
      ...(dto.matKhau && {
        matKhauHash: await bcrypt.hash(dto.matKhau, BCRYPT_ROUNDS),
      }),
      ...(dto.trangThai && { trangThai: dto.trangThai }),
      ...(doiVaiTro && { vaiTro: { connect: { ma: dto.vaiTro } } }),
      ...(loaiHoSo &&
        Object.keys(capNhatHoSo).length > 0 && {
          [loaiHoSo]: { update: capNhatHoSo },
        }),
    };
  }

  private chuyenLoiTrung(error: unknown): unknown {
    if (maLoiPrisma(error) !== 'P2002') return error;
    const truong = truongBiTrung(error);
    if (truong.includes('tenDangNhap')) {
      return new ConflictException('Tên đăng nhập đã tồn tại');
    }
    if (truong.includes('soDienThoai')) {
      return new ConflictException('Số điện thoại đã được sử dụng');
    }
    if (truong.includes('email')) {
      return new ConflictException('Email đã được sử dụng');
    }
    return new ConflictException('Dữ liệu đã tồn tại');
  }
}
