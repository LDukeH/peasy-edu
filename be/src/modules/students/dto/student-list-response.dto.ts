import { ApiProperty } from '@nestjs/swagger';
import { StudentDto } from './student.dto.js';
export class StudentListResponseDto {
  @ApiProperty({ type: [StudentDto] })
  items: StudentDto[];
  @ApiProperty({ type: 'integer', example: 10 })
  total: number;
  @ApiProperty({ type: 'integer', example: 1 })
  page: number;
  @ApiProperty({ type: 'integer', example: 20 })
  pageSize: number;
}
