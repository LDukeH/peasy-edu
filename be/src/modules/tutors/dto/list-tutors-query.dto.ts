import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto.js';
import {
  GioiTinh,
  HinhThucDay,
  TrangThaiGiaSu,
} from '../../../common/enums/gia-su.enum.js';
import { CapHoc } from '../../../common/enums/mon-hoc.enum.js';

/** Lọc danh sách gia sư; sắp xếp hồ sơ mới nộp trước. */
export class ListTutorsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Tìm theo mã GS, họ tên, số điện thoại hoặc email',
    example: 'hân',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({
    description: 'CHO_DUYET = danh sách hồ sơ ứng tuyển cần xử lý',
    enum: TrangThaiGiaSu,
    enumName: 'TrangThaiGiaSu',
  })
  @IsOptional()
  @IsEnum(TrangThaiGiaSu)
  trangThai?: TrangThaiGiaSu;

  @ApiPropertyOptional({
    description: 'Chỉ lấy gia sư dạy môn này',
    type: 'integer',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  monHocId?: number;

  @ApiPropertyOptional({
    description:
      'Chỉ lấy gia sư dạy được cấp học này (ở bất kỳ môn nào, hoặc ở monHocId nếu có)',
    enum: CapHoc,
    enumName: 'CapHoc',
  })
  @IsOptional()
  @IsEnum(CapHoc)
  capHoc?: CapHoc;

  @ApiPropertyOptional({
    description: 'TAI_NHA hoặc ONLINE cũng khớp gia sư CA_HAI',
    enum: HinhThucDay,
    enumName: 'HinhThucDay',
  })
  @IsOptional()
  @IsEnum(HinhThucDay)
  hinhThucDay?: HinhThucDay;

  @ApiPropertyOptional({
    description: 'Khu vực nhận dạy (khớp đúng một phần tử của khuVucNhanDay)',
    example: 'Bình Thạnh',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  khuVuc?: string;

  @ApiPropertyOptional({ enum: GioiTinh, enumName: 'GioiTinh' })
  @IsOptional()
  @IsEnum(GioiTinh)
  gioiTinh?: GioiTinh;
}
