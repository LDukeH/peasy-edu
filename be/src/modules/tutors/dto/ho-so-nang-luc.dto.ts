import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { NGAY_YYYY_MM_DD } from '../../../common/dto/ngay.js';
import {
  LoaiHoSoNangLuc,
  TrangThaiHoSoNangLuc,
} from '../../../common/enums/gia-su.enum.js';

/** Một giấy tờ nộp kèm hồ sơ ứng tuyển (Mục 4.2.4). */
export class HoSoNangLucInputDto {
  @ApiProperty({
    enum: LoaiHoSoNangLuc,
    enumName: 'LoaiHoSoNangLuc',
    example: LoaiHoSoNangLuc.BANG_TOT_NGHIEP,
  })
  @IsEnum(LoaiHoSoNangLuc)
  loai: LoaiHoSoNangLuc;

  @ApiProperty({ maxLength: 200, example: 'Bằng Cử nhân Sư phạm Toán' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  ten: string;

  @ApiProperty({ maxLength: 200, example: 'Trường ĐH Sư phạm TP.HCM' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  noiCap: string;

  @ApiProperty({
    type: String,
    format: 'date',
    pattern: NGAY_YYYY_MM_DD.source,
    example: '2022-07-15',
  })
  @Matches(NGAY_YYYY_MM_DD, { message: 'ngayCap phải có dạng YYYY-MM-DD' })
  @IsISO8601({ strict: true })
  ngayCap: string;

  @ApiPropertyOptional({
    description:
      'Ngày hết hạn (thẻ sinh viên, chứng chỉ ngoại ngữ…); không trước ngày cấp',
    type: String,
    format: 'date',
    pattern: NGAY_YYYY_MM_DD.source,
    example: '2026-07-15',
  })
  @IsOptional()
  @Matches(NGAY_YYYY_MM_DD, { message: 'ngayHetHan phải có dạng YYYY-MM-DD' })
  @IsISO8601({ strict: true })
  ngayHetHan?: string;

  @ApiProperty({
    description:
      'Đường dẫn tệp ảnh/scan trong Storage, lấy từ API upload (W2-NỀN)',
    maxLength: 500,
    example: 'ung-tuyen/0903826154/bang-tot-nghiep.pdf',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  tep: string;
}

export class HoSoNangLucDto {
  @ApiProperty({
    description: 'Khóa kỹ thuật (không hiển thị cho người dùng)',
    type: 'integer',
    example: 7,
  })
  id: number;

  @ApiProperty({
    enum: LoaiHoSoNangLuc,
    enumName: 'LoaiHoSoNangLuc',
    example: LoaiHoSoNangLuc.BANG_TOT_NGHIEP,
  })
  loai: LoaiHoSoNangLuc;

  @ApiProperty({ example: 'Bằng Cử nhân Sư phạm Toán' })
  ten: string;

  @ApiProperty({ example: 'Trường ĐH Sư phạm TP.HCM' })
  noiCap: string;

  @ApiProperty({ type: String, format: 'date', example: '2022-07-15' })
  ngayCap: string;

  @ApiProperty({
    type: String,
    format: 'date',
    nullable: true,
    example: null,
  })
  ngayHetHan: string | null;

  @ApiProperty({
    description: 'Đường dẫn tệp trong Storage',
    example: 'ung-tuyen/0903826154/bang-tot-nghiep.pdf',
  })
  tep: string;

  @ApiProperty({
    enum: TrangThaiHoSoNangLuc,
    enumName: 'TrangThaiHoSoNangLuc',
    example: TrangThaiHoSoNangLuc.CHUA_XAC_MINH,
  })
  trangThai: TrangThaiHoSoNangLuc;
}
