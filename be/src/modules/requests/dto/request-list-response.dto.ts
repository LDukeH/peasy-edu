import { ApiProperty } from '@nestjs/swagger';
import { RequestDto } from './request.dto.js';
export class RequestListResponseDto {
  @ApiProperty({ type: [RequestDto] })
  items: RequestDto[];
  @ApiProperty({ type: 'integer', example: 10 })
  total: number;
  @ApiProperty({ type: 'integer', example: 1 })
  page: number;
  @ApiProperty({ type: 'integer', example: 20 })
  pageSize: number;
}
