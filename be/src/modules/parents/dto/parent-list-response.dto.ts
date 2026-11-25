import { ApiProperty } from '@nestjs/swagger';
import { ParentDto } from './parent.dto.js';
export class ParentListResponseDto {
  @ApiProperty({ type: [ParentDto] })
  items: ParentDto[];
  @ApiProperty({ type: 'integer', example: 10 })
  total: number;
  @ApiProperty({ type: 'integer', example: 1 })
  page: number;
  @ApiProperty({ type: 'integer', example: 20 })
  pageSize: number;
}
