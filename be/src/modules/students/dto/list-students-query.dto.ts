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
import { CapHoc } from '../../../common/enums/mon-hoc.enum.js';

/** id desc. PH chỉ xem con hoặc bản thân; filter không mở rộng quyền. */
export class ListStudentsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    maxLength: 100,
    description: 'Tìm mã, họ tên, SĐT, email',
    example: 'An',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
  @ApiPropertyOptional({ type: 'integer', minimum: 1, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  phuHuynhId?: number;
  @ApiPropertyOptional({ enum: CapHoc, enumName: 'CapHoc' })
  @IsOptional()
  @IsEnum(CapHoc)
  capHoc?: CapHoc;
}
