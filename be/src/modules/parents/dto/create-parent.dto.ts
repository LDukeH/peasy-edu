import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  Matches,
  MaxLength,
} from 'class-validator';

/** Hồ sơ nội bộ; tài khoản và mã nghiệp vụ do server quản lý. */
export class CreateParentDto {
  @ApiProperty({ maxLength: 100, example: 'Nguyễn Văn An' })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(100)
  hoTen: string;

  @ApiProperty({ pattern: '^0\\d{9}$', example: '0901234567' })
  @Matches(/^0\d{9}$/)
  soDienThoai: string;

  @ApiProperty({
    enum: [true],
    example: true,
    description: 'Phải có sự đồng ý của người đại diện; server ghi thời điểm.',
  })
  @Equals(true)
  dongYXuLyDuLieu: boolean;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    maxLength: 254,
    example: 'an@example.com',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    maxLength: 50,
    example: '0901234567',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  zalo?: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    maxLength: 255,
    example: 'Phường Bình Thạnh, TP.HCM',
  })
  @IsOptional()
  @IsString()
  @Matches(/\S/)
  @MaxLength(255)
  diaChi?: string | null;

  @ApiPropertyOptional({ maxLength: 100, example: 'Zalo' })
  @ValidateIf((_o, value) => value !== undefined)
  @IsString()
  @Matches(/\S/)
  @MaxLength(100)
  kenhTiepNhan?: string;

  @ApiPropertyOptional({
    maxLength: 2000,
    example: 'Ưu tiên liên hệ buổi tối',
    description: 'Ghi chú nội bộ; không trả trong response chung.',
  })
  @ValidateIf((_o, value) => value !== undefined)
  @IsString()
  @MaxLength(2000)
  ghiChu?: string;
}
