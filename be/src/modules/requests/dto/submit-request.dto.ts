import {
  ApiExtraModels,
  ApiSchema,
  ApiProperty,
  getSchemaPath,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  Equals,
  IsArray,
  IsDefined,
  IsEnum,
  IsObject,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  LoaiDangKyYeuCau,
  TrangThaiYeuCau,
} from '../../../common/enums/yeu-cau.enum.js';
import { CreateParentDto } from '../../parents/dto/create-parent.dto.js';
import { CreateStudentDto } from '../../students/dto/create-student.dto.js';
import { RequestNeedsDto } from './request-needs.dto.js';

export class SubmitParentProfileDto extends PickType(CreateParentDto, [
  'hoTen',
  'soDienThoai',
  'dongYXuLyDuLieu',
  'email',
  'zalo',
  'diaChi',
] as const) {}
export class SubmitStudentProfileDto extends PickType(CreateStudentDto, [
  'hoTen',
  'ngaySinh',
  'capHoc',
  'khoiLop',
  'quanHeVoiNguoiDaiDien',
  'gioiTinh',
  'truong',
  'hocLuc',
  'soDienThoai',
  'email',
  'diaChi',
] as const) {}
export class SubmitSelfProfileDto extends PickType(CreateStudentDto, [
  'hoTen',
  'ngaySinh',
  'capHoc',
  'khoiLop',
  'gioiTinh',
  'truong',
  'hocLuc',
  'email',
  'diaChi',
] as const) {
  @ApiProperty({ pattern: '^0\\d{9}$', example: '0901234567' })
  @Matches(/^0\d{9}$/)
  soDienThoai: string;
}
export class SubmitRegistrationBaseDto {
  @ApiProperty({ enum: LoaiDangKyYeuCau })
  @IsEnum(LoaiDangKyYeuCau)
  loaiDangKy: LoaiDangKyYeuCau;
  @ApiProperty({
    minLength: 8,
    maxLength: 72,
    writeOnly: true,
    example: 'MatKhau@123',
  })
  @IsString()
  @Matches(/\S/)
  @MinLength(8)
  @MaxLength(72)
  matKhau: string;
}
// Swagger's schema factory preserves class schema metadata, including additionalProperties.
const registrationSchema = {
  description: 'Chỉ nhận thuộc tính của đúng nhánh đăng ký.',
  additionalProperties: false,
};
@ApiSchema(registrationSchema)
export class SubmitParentRegistrationDto extends SubmitRegistrationBaseDto {
  @ApiProperty({
    enum: [LoaiDangKyYeuCau.PHU_HUYNH],
    example: LoaiDangKyYeuCau.PHU_HUYNH,
  })
  @Equals(LoaiDangKyYeuCau.PHU_HUYNH)
  declare loaiDangKy: LoaiDangKyYeuCau.PHU_HUYNH;
  @ApiProperty({ type: SubmitParentProfileDto })
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SubmitParentProfileDto)
  phuHuynh: SubmitParentProfileDto;
  @ApiProperty({ type: [SubmitStudentProfileDto], minItems: 1, maxItems: 4 })
  @IsArray()
  @IsObject({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @ValidateNested({ each: true })
  @Type(() => SubmitStudentProfileDto)
  hocVien: SubmitStudentProfileDto[];
}
@ApiSchema(registrationSchema)
export class SubmitSelfRegistrationDto extends SubmitRegistrationBaseDto {
  @ApiProperty({
    enum: [LoaiDangKyYeuCau.BAN_THAN],
    example: LoaiDangKyYeuCau.BAN_THAN,
  })
  @Equals(LoaiDangKyYeuCau.BAN_THAN)
  declare loaiDangKy: LoaiDangKyYeuCau.BAN_THAN;
  @ApiProperty({
    type: SubmitSelfProfileDto,
    description:
      'Từ đủ 18 tuổi; server gán quan hệ Bản thân, không tạo PH giả.',
  })
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => SubmitSelfProfileDto)
  banThan: SubmitSelfProfileDto;
  @ApiProperty({
    enum: [true],
    example: true,
    description: 'Server ghi sự kiện và thời điểm đồng ý trong nhật ký.',
  })
  @Equals(true)
  dongYXuLyDuLieu: boolean;
}
@ApiExtraModels(SubmitParentRegistrationDto, SubmitSelfRegistrationDto)
export class SubmitRequestDto {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(SubmitParentRegistrationDto) },
      { $ref: getSchemaPath(SubmitSelfRegistrationDto) },
    ],
    discriminator: {
      propertyName: 'loaiDangKy',
      mapping: {
        PHU_HUYNH: getSchemaPath(SubmitParentRegistrationDto),
        BAN_THAN: getSchemaPath(SubmitSelfRegistrationDto),
      },
    },
  })
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type((options) => {
    // Validate malformed shapes normally; the built-in discriminator dereferences null array elements.
    const value: unknown = options?.object?.dangKy;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const kind = (value as { loaiDangKy?: unknown }).loaiDangKy;
      if (kind === LoaiDangKyYeuCau.PHU_HUYNH)
        return SubmitParentRegistrationDto;
      if (kind === LoaiDangKyYeuCau.BAN_THAN) return SubmitSelfRegistrationDto;
    }
    return SubmitRegistrationBaseDto;
  })
  dangKy: SubmitParentRegistrationDto | SubmitSelfRegistrationDto;
  @ApiProperty({ type: RequestNeedsDto })
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RequestNeedsDto)
  nhuCau: RequestNeedsDto;
}
export class SubmitRequestResultDto {
  @ApiProperty({ example: 'YC00001' })
  ma: string;
  @ApiProperty({ enum: [TrangThaiYeuCau.MOI], example: TrangThaiYeuCau.MOI })
  trangThai: TrangThaiYeuCau.MOI;
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-11-25T03:00:00.000Z',
  })
  ngayTiepNhan: Date;
  @ApiProperty({
    example: '0901234567',
    description: 'Tên đăng nhập bằng SĐT; không tự đăng nhập sau submit.',
  })
  tenDangNhap: string;
  @ApiProperty({ enum: LoaiDangKyYeuCau, enumName: 'LoaiDangKyYeuCau' })
  loaiDangKy: LoaiDangKyYeuCau;
}
