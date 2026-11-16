import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Phụ huynh tự đăng ký (báo cáo Mục 4.2.1: số điện thoại duy nhất, dùng làm tên đăng nhập).
 * Vai trò luôn là PHU_HUYNH do server gán; gia sư ứng tuyển qua module tutors (W2).
 */
export class RegisterDto {
  @ApiProperty({ maxLength: 100, example: 'Nguyễn Văn An' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  hoTen: string;

  @ApiProperty({
    description:
      'Số điện thoại Việt Nam (10 chữ số, bắt đầu bằng 0), dùng làm tên đăng nhập',
    example: '0901234567',
  })
  @Matches(/^0\d{9}$/, {
    message: 'soDienThoai phải gồm 10 chữ số, bắt đầu bằng 0',
  })
  soDienThoai: string;

  @ApiProperty({
    description: 'Mật khẩu 8–72 ký tự (giới hạn của bcrypt)',
    minLength: 8,
    maxLength: 72,
    example: 'MatKhau@123',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  matKhau: string;

  @ApiPropertyOptional({ example: 'an.nguyen@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
