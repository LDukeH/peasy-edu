import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  CapHoc,
  NhomMon,
  TrangThaiMonHoc,
} from '../../../common/enums/mon-hoc.enum.js';

/** Danh mục môn ít bản ghi (vài chục) nên không phân trang. */
export class ListSubjectsQueryDto {
  @ApiPropertyOptional({
    description: 'Tìm theo mã hoặc tên môn',
    example: 'toán',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({ enum: NhomMon, enumName: 'NhomMon' })
  @IsOptional()
  @IsEnum(NhomMon)
  nhomMon?: NhomMon;

  @ApiPropertyOptional({
    description: 'Chỉ lấy môn áp dụng cho cấp học này',
    enum: CapHoc,
    enumName: 'CapHoc',
  })
  @IsOptional()
  @IsEnum(CapHoc)
  capHoc?: CapHoc;

  @ApiPropertyOptional({ enum: TrangThaiMonHoc, enumName: 'TrangThaiMonHoc' })
  @IsOptional()
  @IsEnum(TrangThaiMonHoc)
  trangThai?: TrangThaiMonHoc;
}
