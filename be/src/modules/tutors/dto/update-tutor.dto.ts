import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
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
 * skipNullProperties: false → trường bắt buộc gửi null bị 400; các trường
 * vốn tùy chọn (donViCongTac, thuLaoMongMuon, gioiThieu…) gửi null để xóa.
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
    'thuLaoMongMuon',
    'gioiThieu',
    'kinhNghiem',
  ] as const),
  { skipNullProperties: false },
) {
  @ApiPropertyOptional({
    description:
      'Thay toàn bộ khu vực nhận dạy. Được gửi [] (vd. khi chuyển sang ONLINE); sau cập nhật, TAI_NHA hoặc CA_HAI phải còn ít nhất 1 khu vực',
    type: [String],
    example: ['Bình Thạnh', 'Phú Nhuận'],
  })
  @ValidateIf((o: UpdateTutorDto) => o.khuVucNhanDay !== undefined)
  @IsArray()
  @ArrayMaxSize(20)
  @ArrayUnique()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(100, { each: true })
  khuVucNhanDay?: string[];

  @ApiPropertyOptional({
    description: 'Gửi đủ 3 trường để thay tài khoản; không xóa được bằng null',
    type: TaiKhoanNganHangInputDto,
  })
  @ValidateIf((o: UpdateTutorDto) => o.taiKhoanNganHang !== undefined)
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => TaiKhoanNganHangInputDto)
  taiKhoanNganHang?: TaiKhoanNganHangInputDto;
}
