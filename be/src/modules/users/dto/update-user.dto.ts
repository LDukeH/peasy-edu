import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TrangThaiTaiKhoan } from '../../../common/enums/tai-khoan.enum.js';
import { CreateUserDto } from './create-user.dto.js';

/**
 * Sửa tài khoản: mọi trường đều tùy chọn, không đổi được tenDangNhap.
 * Gửi matKhau = QTV đặt lại mật khẩu cho người dùng.
 */
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['tenDangNhap'] as const),
) {
  @ApiPropertyOptional({
    enum: TrangThaiTaiKhoan,
    enumName: 'TrangThaiTaiKhoan',
    example: TrangThaiTaiKhoan.BI_KHOA,
  })
  @IsOptional()
  @IsEnum(TrangThaiTaiKhoan)
  trangThai?: TrangThaiTaiKhoan;
}
