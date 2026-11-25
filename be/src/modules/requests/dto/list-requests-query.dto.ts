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
import { TrangThaiYeuCau } from '../../../common/enums/yeu-cau.enum.js';
/** ngayTiepNhan desc, id desc; PH luôn bị giới hạn dữ liệu thuộc tài khoản. */
export class ListRequestsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    maxLength: 100,
    description: 'Tìm theo mã yêu cầu, không phân biệt hoa thường',
    example: 'YC00001',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
  @ApiPropertyOptional({ enum: TrangThaiYeuCau, enumName: 'TrangThaiYeuCau' })
  @IsOptional()
  @IsEnum(TrangThaiYeuCau)
  trangThai?: TrangThaiYeuCau;
  @ApiPropertyOptional({ type: 'integer', minimum: 1, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  monHocId?: number;
  @ApiPropertyOptional({ type: 'integer', minimum: 1, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  nguoiThanhToanId?: number;
  @ApiPropertyOptional({ type: 'integer', minimum: 1, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  nhanVienPhuTrachId?: number;
}
