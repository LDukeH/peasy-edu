import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
}
