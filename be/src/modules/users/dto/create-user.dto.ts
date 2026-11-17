import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VaiTro } from '../../../common/enums/tai-khoan.enum.js';

/** QUAN_LY tạo tài khoản (chủ yếu cho nhân viên). Mã nghiệp vụ do hệ thống sinh. */
export class CreateUserDto {
  @ApiProperty({
    description: 'Tên đăng nhập, duy nhất: chữ, số và . _ @ -',
    minLength: 3,
    maxLength: 50,
    example: 'dieuphoi01',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9._@-]+$/, {
    message: 'tenDangNhap chỉ gồm chữ, số và các ký tự . _ @ -',
  })
  tenDangNhap: string;

  @ApiProperty({
    description: 'Mật khẩu ban đầu, 8–72 ký tự (giới hạn của bcrypt)',
    minLength: 8,
    maxLength: 72,
    example: 'MatKhau@123',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  matKhau: string;

  @ApiProperty({ maxLength: 100, example: 'Trần Thị Bình' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  hoTen: string;

  @ApiPropertyOptional({ example: 'binh.tran@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại Việt Nam: 10 chữ số, bắt đầu bằng 0',
    example: '0912345678',
  })
  @IsOptional()
  @Matches(/^0\d{9}$/, {
    message: 'soDienThoai phải gồm 10 chữ số, bắt đầu bằng 0',
  })
  soDienThoai?: string;

  @ApiProperty({ enum: VaiTro, enumName: 'VaiTro', example: VaiTro.DIEU_PHOI })
  @IsEnum(VaiTro)
  vaiTro: VaiTro;
}
