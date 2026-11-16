import { ApiProperty } from '@nestjs/swagger';
import {
  TrangThaiTaiKhoan,
  VaiTro,
} from '../../../common/enums/tai-khoan.enum.js';

/**
 * Thông tin tài khoản trả về cho FE (báo cáo Mục 4.2.23).
 * Không bao giờ chứa mật khẩu. Dùng chung cho /users/* và /auth/login|register|me.
 */
export class UserDto {
  @ApiProperty({
    description: 'Khóa kỹ thuật (không hiển thị cho người dùng)',
    type: 'integer',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Tên đăng nhập, duy nhất. Phụ huynh dùng số điện thoại',
    example: '0901234567',
  })
  tenDangNhap: string;

  @ApiProperty({ example: 'Nguyễn Văn An' })
  hoTen: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'an.nguyen@example.com',
  })
  email: string | null;

  @ApiProperty({ type: String, nullable: true, example: '0901234567' })
  soDienThoai: string | null;

  @ApiProperty({ enum: VaiTro, enumName: 'VaiTro', example: VaiTro.PHU_HUYNH })
  vaiTro: VaiTro;

  @ApiProperty({
    enum: TrangThaiTaiKhoan,
    enumName: 'TrangThaiTaiKhoan',
    example: TrangThaiTaiKhoan.HOAT_DONG,
  })
  trangThai: TrangThaiTaiKhoan;

  @ApiProperty({
    type: String,
    nullable: true,
    description:
      'Mã nghiệp vụ của đối tượng liên kết (PHxxxxx, GSxxxxx, NVxxx); null nếu chưa liên kết',
    example: 'PH00015',
  })
  maDoiTuong: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    example: '2026-11-17T08:30:00.000Z',
  })
  lanDangNhapCuoi: Date | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-11-16T02:00:00.000Z',
  })
  ngayTao: Date;
}
