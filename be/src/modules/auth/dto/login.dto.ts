import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Tên đăng nhập; phụ huynh dùng số điện thoại',
    maxLength: 50,
    example: '0901234567',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tenDangNhap: string;

  @ApiProperty({ maxLength: 72, example: 'MatKhau@123' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
  matKhau: string;

  @ApiPropertyOptional({
    description:
      'Ghi nhớ đăng nhập (mặc định true). Nếu false, cookie chỉ tồn tại trong phiên trình duyệt hiện tại.',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  ghiNho?: boolean;
}
