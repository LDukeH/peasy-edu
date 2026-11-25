import { ApiProperty } from '@nestjs/swagger';
import { GioiTinh } from '../../../common/enums/gia-su.enum.js';
import { CapHoc } from '../../../common/enums/mon-hoc.enum.js';
export class StudentDto {
  @ApiProperty({ type: 'integer', example: 1 })
  id: number;
  @ApiProperty({ example: 'HV00001' })
  ma: string;
  @ApiProperty({ example: 'Nguyễn Minh An' })
  hoTen: string;
  @ApiProperty({ type: String, format: 'date', example: '2012-08-15' })
  ngaySinh: string;
  // Ghi đè miền enum do Swagger compiler suy ra, giữ null hợp lệ trong oneOf.
  @ApiProperty({
    type: String,
    nullable: true,
    enum: [GioiTinh.NAM, GioiTinh.NU, null],
    oneOf: [
      { $ref: '#/components/schemas/GioiTinh' },
      { type: 'string', nullable: true, enum: [null] },
    ],
    example: null,
    description: 'NAM, NU hoặc null nếu chưa ghi nhận giới tính.',
  })
  gioiTinh: GioiTinh | null;
  @ApiProperty({ enum: CapHoc, enumName: 'CapHoc', example: CapHoc.THCS })
  capHoc: CapHoc;
  @ApiProperty({ example: '8' })
  khoiLop: string;
  @ApiProperty({ type: 'integer', nullable: true, example: 1 })
  phuHuynhId: number | null;
  @ApiProperty({ example: 'Con' })
  quanHeVoiNguoiDaiDien: string;
  @ApiProperty({ type: String, nullable: true, example: null })
  truong: string | null;
}
export class StudentDetailDto extends StudentDto {
  @ApiProperty({ type: String, nullable: true, example: null })
  hocLuc: string | null;
  @ApiProperty({ type: String, nullable: true, example: null })
  soDienThoai: string | null;
  @ApiProperty({ type: String, nullable: true, example: null })
  email: string | null;
  @ApiProperty({ type: String, nullable: true, example: null })
  diaChi: string | null;
  @ApiProperty({ type: 'integer', nullable: true, example: null })
  taiKhoanId: number | null;
  @ApiProperty({ type: 'integer', nullable: true, example: null })
  nguoiThanhToanId: number | null;
}
