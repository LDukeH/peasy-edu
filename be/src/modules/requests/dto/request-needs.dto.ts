import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CapHoc } from '../../../common/enums/mon-hoc.enum.js';
import { HinhThucHoc } from '../../../common/enums/yeu-cau.enum.js';
import { KhungGioMongMuonDto } from './khung-gio-mong-muon.dto.js';

/** Tách trường chung để PATCH không kế thừa điều kiện bắt buộc địa chỉ khi tạo. */
export class RequestNeedsFieldsDto {
  @ApiProperty({ type: 'integer', minimum: 1, example: 1 })
  @IsInt()
  @Min(1)
  monHocId: number;
  @ApiProperty({ enum: CapHoc, enumName: 'CapHoc', example: CapHoc.THCS })
  @IsEnum(CapHoc)
  capHoc: CapHoc;
  @ApiProperty({ maxLength: 50, example: '8' })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(50)
  khoiLop: string;
  @ApiProperty({ maxLength: 2000, example: 'Củng cố kiến thức' })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(2000)
  mucTieu: string;
  @ApiProperty({
    enum: HinhThucHoc,
    enumName: 'HinhThucHoc',
    example: HinhThucHoc.ONLINE,
  })
  @IsEnum(HinhThucHoc)
  hinhThuc: HinhThucHoc;
  @ApiProperty({ type: 'integer', minimum: 1, maximum: 7, example: 2 })
  @IsInt()
  @Min(1)
  @Max(7)
  soBuoiMoiTuan: number;
  @ApiProperty({ type: 'integer', minimum: 1, maximum: 1440, example: 90 })
  @IsInt()
  @Min(1)
  @Max(1440)
  thoiLuongPhut: number;
  @ApiProperty({
    type: [KhungGioMongMuonDto],
    minItems: 1,
    maxItems: 50,
    description:
      'Các lựa chọn lịch; không bắt buộc số khung bằng số buổi/tuần.',
  })
  @IsArray()
  @IsObject({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => KhungGioMongMuonDto)
  khungGioMongMuon: KhungGioMongMuonDto[];
  @ApiPropertyOptional({
    type: String,
    nullable: true,
    maxLength: 2000,
    example: 'Cần ôn kiến thức lớp 7',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  hocLucHienTai?: string | null;
  @ApiPropertyOptional({
    type: String,
    nullable: true,
    maxLength: 2000,
    example: 'Kiên nhẫn, có kinh nghiệm THCS',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  tieuChiGiaSu?: string | null;
  @ApiPropertyOptional({
    type: 'integer',
    nullable: true,
    minimum: 1,
    maximum: 2147483647,
    example: 200000,
    description: 'VND/buổi',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2147483647)
  nganSachMoiBuoi?: number | null;
  @ApiPropertyOptional({
    type: String,
    nullable: true,
    format: 'date',
    pattern: '^\\d{4}-\\d{2}-\\d{2}$',
    example: '2026-12-01',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsISO8601({ strict: true })
  ngayMuonBatDau?: string | null;
}
export class RequestNeedsDto extends RequestNeedsFieldsDto {
  @ApiPropertyOptional({
    type: String,
    nullable: true,
    maxLength: 255,
    example: 'TP.HCM',
    description: 'Bắt buộc có nội dung khi hinhThuc=TAI_NHA.',
  })
  @ValidateIf(
    (o: RequestNeedsDto) =>
      o.hinhThuc === HinhThucHoc.TAI_NHA ||
      (o.diaChi !== undefined && o.diaChi !== null),
  )
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(255)
  diaChi?: string | null;
}
export class UpdateRequestNeedsDto extends PartialType(RequestNeedsFieldsDto, {
  skipNullProperties: false,
}) {
  @ApiPropertyOptional({
    type: String,
    nullable: true,
    maxLength: 255,
    example: 'TP.HCM',
    description:
      'Kiểm tra địa chỉ trên dữ liệu sau merge; null xóa nếu ràng buộc cho phép.',
  })
  @IsOptional()
  @IsString()
  @Matches(/\S/)
  @MaxLength(255)
  diaChi?: string | null;
}
