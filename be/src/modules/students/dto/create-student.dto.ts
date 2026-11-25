import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { GioiTinh } from '../../../common/enums/gia-su.enum.js';
import { CapHoc } from '../../../common/enums/mon-hoc.enum.js';

/** Tuổi, đồng thuận phụ huynh và quan hệ sở hữu được kiểm tra ở task logic. */
export class CreateStudentDto {
  @ApiProperty({ maxLength: 100, example: 'Nguyễn Minh An' })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(100)
  hoTen: string;

  @ApiProperty({
    type: String,
    format: 'date',
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
    example: '2012-08-15',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsISO8601({ strict: true })
  ngaySinh: string;

  @ApiProperty({ enum: CapHoc, enumName: 'CapHoc', example: CapHoc.THCS })
  @IsEnum(CapHoc)
  capHoc: CapHoc;

  @ApiProperty({
    maxLength: 50,
    example: '8',
    description: 'DAI_HOC: Năm 2; NGUOI_DI_LAM: Không áp dụng.',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(50)
  khoiLop: string;

  @ApiProperty({ maxLength: 50, example: 'Con' })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(50)
  quanHeVoiNguoiDaiDien: string;

  @ApiPropertyOptional({
    type: 'integer',
    minimum: 1,
    example: 1,
    description: 'Bắt buộc nếu dưới 18 tuổi; PH chỉ thêm con thuộc hồ sơ mình.',
  })
  @ValidateIf((_o, value) => value !== undefined)
  @IsInt()
  @Min(1)
  phuHuynhId?: number;

  @ApiPropertyOptional({
    enum: GioiTinh,
    enumName: 'GioiTinh',
    example: GioiTinh.NAM,
  })
  @ValidateIf((_o, value) => value !== undefined)
  @IsEnum(GioiTinh)
  gioiTinh?: GioiTinh;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    maxLength: 200,
    example: 'THCS Nguyễn Du',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  truong?: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    maxLength: 2000,
    example: 'Cần củng cố kiến thức cơ bản',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  hocLuc?: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    pattern: '^0\\d{9}$',
    example: '0901234567',
  })
  @IsOptional()
  @Matches(/^0\d{9}$/)
  soDienThoai?: string | null;

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
    maxLength: 255,
    example: 'TP.HCM',
  })
  @IsOptional()
  @IsString()
  @Matches(/\S/)
  @MaxLength(255)
  diaChi?: string | null;
}
