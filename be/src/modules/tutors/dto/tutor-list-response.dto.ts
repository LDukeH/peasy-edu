import { ApiProperty } from '@nestjs/swagger';
import { TutorDto } from './tutor.dto.js';

export class TutorListResponseDto {
  @ApiProperty({ type: [TutorDto] })
  items: TutorDto[];

  @ApiProperty({
    type: 'integer',
    description: 'Tổng số bản ghi khớp bộ lọc',
    example: 15,
  })
  total: number;

  @ApiProperty({ type: 'integer', example: 1 })
  page: number;

  @ApiProperty({ type: 'integer', example: 20 })
  pageSize: number;
}
