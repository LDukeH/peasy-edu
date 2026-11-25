import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Matches, Max, Min } from 'class-validator';
/** Các lựa chọn lịch hằng tuần theo giờ Việt Nam. */
export class KhungGioMongMuonDto {
  @ApiProperty({
    type: 'integer',
    minimum: 1,
    maximum: 7,
    example: 2,
    description: 'ISO: 1 = Thứ Hai, 7 = Chủ nhật',
  })
  @IsInt()
  @Min(1)
  @Max(7)
  thu: number;
  @ApiProperty({ pattern: '^([01]\\d|2[0-3]):[0-5]\\d$', example: '18:00' })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  gioBatDau: string;
  @ApiProperty({
    pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
    example: '19:30',
    description: 'Phải sau giờ bắt đầu cùng ngày; logic tương lai kiểm tra.',
  })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  gioKetThuc: string;
}
