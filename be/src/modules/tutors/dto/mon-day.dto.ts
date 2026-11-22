import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { CapHoc } from '../../../common/enums/mon-hoc.enum.js';

/** Một môn gia sư đăng ký dạy (Mục 4.2.5). */
export class MonDayInputDto {
  @ApiProperty({
    description: 'id môn học trong danh mục /subjects (môn đang sử dụng)',
    type: 'integer',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  monHocId: number;

  @ApiProperty({
    description:
      'Các cấp dạy được; phải nằm trong cấp học áp dụng của môn (TIEU_HOC chỉ cho nhóm NANG_KHIEU_KY_NANG)',
    enum: CapHoc,
    enumName: 'CapHoc',
    isArray: true,
    example: [CapHoc.THCS, CapHoc.THPT],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsEnum(CapHoc, { each: true })
  capHoc: CapHoc[];
}

/** Thay toàn bộ danh sách môn dạy (chỉ giữ bản hiện hành, thay đổi ghi nhật ký). */
export class ReplaceTutorSubjectsDto {
  @ApiProperty({
    description: 'Danh sách môn dạy mới, mỗi môn xuất hiện một lần',
    type: [MonDayInputDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ArrayUnique((monDay: MonDayInputDto) => monDay.monHocId, {
    message: 'Mỗi môn học chỉ được khai báo một lần',
  })
  @ValidateNested({ each: true })
  @Type(() => MonDayInputDto)
  monDay: MonDayInputDto[];
}

export class MonDayDto {
  @ApiProperty({
    description: 'Khóa kỹ thuật (không hiển thị cho người dùng)',
    type: 'integer',
    example: 12,
  })
  id: number;

  @ApiProperty({ type: 'integer', example: 1 })
  monHocId: number;

  @ApiProperty({ description: 'Mã môn học', example: 'MH01' })
  maMon: string;

  @ApiProperty({ example: 'Toán' })
  tenMon: string;

  @ApiProperty({
    enum: CapHoc,
    enumName: 'CapHoc',
    isArray: true,
    example: [CapHoc.THCS, CapHoc.THPT],
  })
  capHoc: CapHoc[];
}
