import { ApiProperty } from '@nestjs/swagger';
export class ParentDto {
  @ApiProperty({ type: 'integer', example: 1 })
  id: number;
  @ApiProperty({ example: 'PH00001' })
  ma: string;
  @ApiProperty({ example: 'Nguyễn Văn An' })
  hoTen: string;
  @ApiProperty({ example: '0901234567' })
  soDienThoai: string;
  @ApiProperty({ type: String, nullable: true, example: null })
  email: string | null;
  @ApiProperty({ type: String, nullable: true, example: null })
  zalo: string | null;
  @ApiProperty({ type: String, nullable: true, example: null })
  diaChi: string | null;
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-11-25T03:00:00.000Z',
  })
  ngayTao: Date;
}
export class ParentDetailDto extends ParentDto {
  @ApiProperty({ type: String, nullable: true, example: 'Zalo' })
  kenhTiepNhan: string | null;
  @ApiProperty({ type: Boolean, nullable: true, example: true })
  dongYXuLyDuLieu: boolean | null;
  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    example: null,
  })
  thoiDiemGhiNhanDongY: Date | null;
  @ApiProperty({ type: 'integer', nullable: true, example: null })
  nguoiTaoId: number | null;
  @ApiProperty({ type: 'integer', nullable: true, example: null })
  taiKhoanId: number | null;
  @ApiProperty({ type: 'integer', nullable: true, example: null })
  nguoiThanhToanId: number | null;
}
