import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { MonHoc, Prisma } from '@prisma/client';
import {
  CapHoc,
  NhomMon,
  TrangThaiMonHoc,
} from '../../common/enums/mon-hoc.enum.js';
import { maTiepTheo, thuLaiKhiTrungMa } from '../../common/ma-nghiep-vu.js';
import { maLoiPrisma } from '../../common/prisma-errors.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { CreateSubjectDto } from './dto/create-subject.dto.js';
import type { ListSubjectsQueryDto } from './dto/list-subjects-query.dto.js';
import type { SubjectDto } from './dto/subject.dto.js';
import type { UpdateSubjectDto } from './dto/update-subject.dto.js';

function toSubjectDto(monHoc: MonHoc): SubjectDto {
  return {
    id: monHoc.id,
    ma: monHoc.ma,
    tenMon: monHoc.ten,
    nhomMon: monHoc.nhom as NhomMon,
    capHoc: monHoc.capHocApDung as CapHoc[],
    moTa: monHoc.moTa,
    trangThai: monHoc.dangSuDung
      ? TrangThaiMonHoc.DANG_SU_DUNG
      : TrangThaiMonHoc.NGUNG_SU_DUNG,
  };
}

/** TT 29/2024: cấp Tiểu học chỉ áp dụng cho nhóm năng khiếu – kỹ năng. */
function kiemTraCapHoc(nhomMon: NhomMon, capHoc: readonly CapHoc[]): void {
  if (
    capHoc.includes(CapHoc.TIEU_HOC) &&
    nhomMon !== NhomMon.NANG_KHIEU_KY_NANG
  ) {
    throw new BadRequestException(
      'Cấp Tiểu học chỉ áp dụng cho nhóm năng khiếu – kỹ năng',
    );
  }
}

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListSubjectsQueryDto): Promise<SubjectDto[]> {
    const tuKhoa = query.q?.trim();
    const khop = { contains: tuKhoa, mode: 'insensitive' } as const;
    const where: Prisma.MonHocWhereInput = {
      ...(query.nhomMon && { nhom: query.nhomMon }),
      ...(query.capHoc && { capHocApDung: { has: query.capHoc } }),
      ...(query.trangThai && {
        dangSuDung: query.trangThai === TrangThaiMonHoc.DANG_SU_DUNG,
      }),
      ...(tuKhoa && { OR: [{ ma: khop }, { ten: khop }] }),
    };
    const danhSach = await this.prisma.monHoc.findMany({
      where,
      orderBy: { ma: 'asc' },
    });
    return danhSach.map(toSubjectDto);
  }

  async findOne(id: number): Promise<SubjectDto> {
    return toSubjectDto(await this.layMonHoc(id));
  }

  async create(dto: CreateSubjectDto): Promise<SubjectDto> {
    kiemTraCapHoc(dto.nhomMon, dto.capHoc);
    try {
      const monHoc = await thuLaiKhiTrungMa(async () =>
        this.prisma.monHoc.create({
          data: {
            ma: await this.sinhMa(),
            ten: dto.tenMon,
            nhom: dto.nhomMon,
            capHocApDung: dto.capHoc,
            moTa: dto.moTa ?? null,
          },
        }),
      );
      return toSubjectDto(monHoc);
    } catch (error) {
      throw this.chuyenLoiTrungTen(error);
    }
  }

  async update(id: number, dto: UpdateSubjectDto): Promise<SubjectDto> {
    const hienTai = await this.layMonHoc(id);
    // Sửa một trong hai trường vẫn phải hợp lệ với giá trị còn lại đang lưu.
    kiemTraCapHoc(
      dto.nhomMon ?? (hienTai.nhom as NhomMon),
      dto.capHoc ?? (hienTai.capHocApDung as CapHoc[]),
    );

    try {
      const monHoc = await this.prisma.monHoc.update({
        where: { id },
        data: {
          ten: dto.tenMon,
          nhom: dto.nhomMon,
          capHocApDung: dto.capHoc,
          moTa: dto.moTa,
          ...(dto.trangThai && {
            dangSuDung: dto.trangThai === TrangThaiMonHoc.DANG_SU_DUNG,
          }),
        },
      });
      return toSubjectDto(monHoc);
    } catch (error) {
      if (maLoiPrisma(error) === 'P2025') {
        throw new NotFoundException('Không tìm thấy môn học');
      }
      throw this.chuyenLoiTrungTen(error);
    }
  }

  /** Khóa ngoại Restrict của DB chặn xóa môn đã gắn lớp, yêu cầu hoặc môn dạy. */
  async remove(id: number): Promise<void> {
    try {
      await this.prisma.monHoc.delete({ where: { id } });
    } catch (error) {
      const maLoi = maLoiPrisma(error);
      if (maLoi === 'P2025') {
        throw new NotFoundException('Không tìm thấy môn học');
      }
      if (maLoi === 'P2003') {
        throw new ConflictException(
          'Môn đã được sử dụng, chỉ có thể ngừng sử dụng',
        );
      }
      throw error;
    }
  }

  private async layMonHoc(id: number): Promise<MonHoc> {
    const monHoc = await this.prisma.monHoc.findUnique({ where: { id } });
    if (!monHoc) throw new NotFoundException('Không tìm thấy môn học');
    return monHoc;
  }

  /** Lấy toàn bộ mã vì sắp xếp chuỗi đặt MH100 trước MH99. */
  private async sinhMa(): Promise<string> {
    const danhSach = await this.prisma.monHoc.findMany({
      select: { ma: true },
    });
    return maTiepTheo(
      'MH',
      2,
      danhSach.map((monHoc) => monHoc.ma),
    );
  }

  private chuyenLoiTrungTen(error: unknown): unknown {
    return maLoiPrisma(error) === 'P2002'
      ? new ConflictException('Tên môn đã tồn tại')
      : error;
  }
}
