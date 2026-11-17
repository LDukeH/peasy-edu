import { ApiProperty } from '@nestjs/swagger';
import {
  CapHoc,
  NhomMon,
  TrangThaiMonHoc,
} from '../../../common/enums/mon-hoc.enum.js';

/** Môn học (báo cáo Mục 4.2.6). */
export class SubjectDto {
  @ApiProperty({
    description: 'Khóa kỹ thuật (không hiển thị cho người dùng)',
    type: 'integer',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Mã môn do hệ thống sinh, dạng MHxx',
    example: 'MH01',
  })
  ma: string;

  @ApiProperty({ example: 'Toán' })
  tenMon: string;

  @ApiProperty({ enum: NhomMon, enumName: 'NhomMon', example: NhomMon.VAN_HOA })
  nhomMon: NhomMon;

  @ApiProperty({
    enum: CapHoc,
    enumName: 'CapHoc',
    isArray: true,
    example: [CapHoc.THCS, CapHoc.THPT],
  })
  capHoc: CapHoc[];

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'Toán chương trình phổ thông 2018',
  })
  moTa: string | null;

  @ApiProperty({
    enum: TrangThaiMonHoc,
    enumName: 'TrangThaiMonHoc',
    example: TrangThaiMonHoc.DANG_SU_DUNG,
  })
  trangThai: TrangThaiMonHoc;
}
