import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto.js';

/** ngayTao desc, id desc; không phân biệt hoa thường khi tìm. */
export class ListParentsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Tìm theo mã, họ tên, SĐT hoặc email',
    maxLength: 100,
    example: 'An',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;
}
