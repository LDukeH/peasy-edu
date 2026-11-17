import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CapHoc, NhomMon } from '../../../common/enums/mon-hoc.enum.js';

/** Mã MHxx do hệ thống sinh, không nhận từ client. */
export class CreateSubjectDto {
  @ApiProperty({
    description: 'Tên môn, duy nhất',
    maxLength: 100,
    example: 'Toán',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  tenMon: string;

  @ApiProperty({ enum: NhomMon, enumName: 'NhomMon', example: NhomMon.VAN_HOA })
  @IsEnum(NhomMon)
  nhomMon: NhomMon;

  @ApiProperty({
    description:
      'Cấp học áp dụng, ít nhất 1. TIEU_HOC chỉ hợp lệ với nhóm NANG_KHIEU_KY_NANG (TT 29/2024)',
    enum: CapHoc,
    enumName: 'CapHoc',
    isArray: true,
    example: [CapHoc.THCS, CapHoc.THPT],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(CapHoc, { each: true })
  capHoc: CapHoc[];

  @ApiPropertyOptional({
    maxLength: 500,
    example: 'Toán chương trình phổ thông 2018',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  moTa?: string;
}
