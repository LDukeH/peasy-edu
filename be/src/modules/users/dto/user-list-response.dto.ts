import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto.js';

export class UserListResponseDto {
  @ApiProperty({ type: [UserDto] })
  items: UserDto[];

  @ApiProperty({
    type: 'integer',
    description: 'Tổng số bản ghi khớp bộ lọc',
    example: 42,
  })
  total: number;

  @ApiProperty({ type: 'integer', example: 1 })
  page: number;

  @ApiProperty({ type: 'integer', example: 20 })
  pageSize: number;
}
