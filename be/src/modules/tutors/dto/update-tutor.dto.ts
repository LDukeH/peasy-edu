import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApplyTutorDto } from './apply-tutor.dto.js';

/** Tài khoản nhận thù lao. Lưu mã hóa, đổi phải ghi nhật ký (Mục 4.2.3). */
export class TaiKhoanNganHangInputDto {
  @ApiProperty({ maxLength: 100, example: 'Vietcombank' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nganHang: string;

  @ApiProperty({ description: '6–20 chữ số', example: '0123456789' })
  @Matches(/^\d{6,20}$/, { message: 'soTaiKhoan phải gồm 6–20 chữ số' })
  soTaiKhoan: string;

  @ApiProperty({
    description: 'Tên chủ tài khoản, nên trùng họ tên gia sư',
    maxLength: 100,
    example: 'VU NGOC HAN',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  chuTaiKhoan: string;
}

/**
 * Sửa hồ sơ gia sư: mọi trường tùy chọn. Không đổi được họ tên, ngày sinh,
 * giới tính, CCCD, trạng thái (duyệt qua /tutors/:id/review).
 * Đổi soDienThoai thì đổi luôn tenDangNhap của tài khoản gia sư.
 * Môn dạy và lịch rảnh sửa qua /tutors/:id/subjects và /tutors/:id/availability.
 */
export class UpdateTutorDto extends PartialType(
  PickType(ApplyTutorDto, [
    'soDienThoai',
    'email',
    'diaChi',
    'anhChanDung',
    'trinhDo',
    'truongDaoTao',
    'chuyenNganh',
    'nienKhoa',
    'donViCongTac',
    'laGiaoVienCongLap',
    'hinhThucDay',
    'khuVucNhanDay',
    'thuLaoMongMuon',
    'gioiThieu',
    'kinhNghiem',
  ] as const),
) {
  @ApiPropertyOptional({ type: TaiKhoanNganHangInputDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TaiKhoanNganHangInputDto)
  taiKhoanNganHang?: TaiKhoanNganHangInputDto;
}
