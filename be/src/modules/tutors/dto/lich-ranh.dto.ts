import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

/** Giờ dạng HH:mm (24 giờ), giờ Việt Nam. */
const GIO_PHUT = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Một khung giờ rảnh lặp lại hằng tuần (Mục 4.2.5, 6.2). */
export class LichRanhInputDto {
  @ApiProperty({
    description:
      'Thứ trong tuần theo ISO: 1 = Thứ Hai … 6 = Thứ Bảy, 7 = Chủ nhật',
    type: 'integer',
    minimum: 1,
    maximum: 7,
    example: 2,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(7)
  thu: number;

  @ApiProperty({
    description: 'Giờ bắt đầu HH:mm (giờ Việt Nam)',
    pattern: GIO_PHUT.source,
    example: '18:00',
  })
  @Matches(GIO_PHUT, { message: 'gioBatDau phải có dạng HH:mm' })
  gioBatDau: string;

  @ApiProperty({
    description: 'Giờ kết thúc HH:mm, phải sau giờ bắt đầu trong cùng ngày',
    pattern: GIO_PHUT.source,
    example: '21:00',
  })
  @Matches(GIO_PHUT, { message: 'gioKetThuc phải có dạng HH:mm' })
  gioKetThuc: string;
}

/**
 * Thay toàn bộ lịch rảnh tuần. Mảng rỗng = tạm thời không có khung rảnh.
 * Các khung cùng thứ không được chồng nhau (server trả 400).
 */
export class ReplaceTutorAvailabilityDto {
  @ApiProperty({ type: [LichRanhInputDto] })
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => LichRanhInputDto)
  lichRanh: LichRanhInputDto[];
}

export class LichRanhDto {
  @ApiProperty({
    description: 'Khóa kỹ thuật (không hiển thị cho người dùng)',
    type: 'integer',
    example: 31,
  })
  id: number;

  @ApiProperty({
    description: 'Thứ trong tuần theo ISO: 1 = Thứ Hai … 7 = Chủ nhật',
    type: 'integer',
    example: 2,
  })
  thu: number;

  @ApiProperty({ description: 'HH:mm', example: '18:00' })
  gioBatDau: string;

  @ApiProperty({ description: 'HH:mm', example: '21:00' })
  gioKetThuc: string;
}
