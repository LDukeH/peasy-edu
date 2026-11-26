import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  Equals,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
  ValidateIf,
  ValidateNested,
  type ValidationArguments,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';
import { NGAY_YYYY_MM_DD } from '../../../common/dto/ngay.js';
import {
  GioiTinh,
  HinhThucDay,
  TrangThaiGiaSu,
} from '../../../common/enums/gia-su.enum.js';
import { HoSoNangLucInputDto } from './ho-so-nang-luc.dto.js';
import { LichRanhInputDto } from './lich-ranh.dto.js';
import { MonDayInputDto } from './mon-day.dto.js';

/** Đường dẫn tệp do API upload (W2-NỀN) trả về. */
const MO_TA_TEP = 'Đường dẫn tệp trong Storage, lấy từ API upload (W2-NỀN)';

/** Dạy tại nhà (TAI_NHA, CA_HAI) cần ít nhất 1 khu vực; ONLINE được gửi []. */
@ValidatorConstraint({ name: 'khuVucTheoHinhThucDay' })
class KhuVucTheoHinhThucDay implements ValidatorConstraintInterface {
  validate(khuVuc: unknown, args: ValidationArguments): boolean {
    const { hinhThucDay } = args.object as { hinhThucDay?: unknown };
    return (
      hinhThucDay === HinhThucDay.ONLINE ||
      (Array.isArray(khuVuc) && khuVuc.length > 0)
    );
  }

  defaultMessage(): string {
    return 'Cần ít nhất 1 khu vực nhận dạy khi dạy tại nhà (TAI_NHA hoặc CA_HAI)';
  }
}

/**
 * Biểu mẫu ứng tuyển công khai (Mục 4.2.3–4.2.5, 6.2). Hồ sơ vào trạng thái
 * CHO_DUYET; server tạo luôn tài khoản ứng viên vai trò GIA_SU với
 * tenDangNhap = soDienThoai để gia sư đăng nhập theo dõi kết quả.
 */
export class ApplyTutorDto {
  @ApiProperty({ maxLength: 100, example: 'Vũ Ngọc Hân' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  hoTen: string;

  @ApiProperty({
    type: String,
    format: 'date',
    pattern: NGAY_YYYY_MM_DD.source,
    example: '2000-08-15',
  })
  @Matches(NGAY_YYYY_MM_DD, { message: 'ngaySinh phải có dạng YYYY-MM-DD' })
  @IsISO8601({ strict: true })
  ngaySinh: string;

  @ApiProperty({ enum: GioiTinh, enumName: 'GioiTinh', example: GioiTinh.NU })
  @IsEnum(GioiTinh)
  gioiTinh: GioiTinh;

  @ApiProperty({
    description:
      'Số CCCD 12 chữ số, duy nhất. Lưu mã hóa; API chỉ trả bản đã che',
    example: '079200001042',
  })
  @Matches(/^\d{12}$/, { message: 'soCccd phải gồm đúng 12 chữ số' })
  soCccd: string;

  @ApiProperty({
    description: MO_TA_TEP,
    maxLength: 500,
    example: 'ung-tuyen/0903826154/cccd-mat-truoc.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  anhCccdMatTruoc: string;

  @ApiProperty({
    description: MO_TA_TEP,
    maxLength: 500,
    example: 'ung-tuyen/0903826154/cccd-mat-sau.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  anhCccdMatSau: string;

  @ApiProperty({
    description:
      'Số điện thoại Việt Nam (10 chữ số, bắt đầu bằng 0), duy nhất; dùng làm tên đăng nhập',
    example: '0903826154',
  })
  @Matches(/^0\d{9}$/, {
    message: 'soDienThoai phải gồm 10 chữ số, bắt đầu bằng 0',
  })
  soDienThoai: string;

  @ApiProperty({ description: 'Duy nhất', example: 'han.vu@example.com' })
  @IsEmail()
  @MaxLength(254)
  email: string;

  @ApiProperty({ maxLength: 255, example: 'Phường Bình Thạnh, TP.HCM' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  diaChi: string;

  @ApiProperty({
    description: MO_TA_TEP,
    maxLength: 500,
    example: 'ung-tuyen/0903826154/chan-dung.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  anhChanDung: string;

  @ApiProperty({
    description: 'Trình độ hiện tại: Sinh viên, Giáo viên, Cử nhân, Thạc sĩ…',
    maxLength: 50,
    example: 'Sinh viên',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  trinhDo: string;

  @ApiProperty({ maxLength: 200, example: 'ĐH Sư phạm TP.HCM' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  truongDaoTao: string;

  @ApiProperty({ maxLength: 200, example: 'Sư phạm Toán' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  chuyenNganh: string;

  @ApiProperty({ maxLength: 20, example: '2018–2022' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  nienKhoa: string;

  @ApiPropertyOptional({
    description: 'Bắt buộc nếu là giáo viên (kiểm tra theo TT 29/2024)',
    maxLength: 200,
    example: 'THCS Lê Văn Tám',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  donViCongTac?: string;

  @ApiPropertyOptional({
    description: 'Có phải giáo viên trường công lập (TT 29/2024)',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  laGiaoVienCongLap?: boolean;

  @ApiProperty({
    enum: HinhThucDay,
    enumName: 'HinhThucDay',
    example: HinhThucDay.CA_HAI,
  })
  @IsEnum(HinhThucDay)
  hinhThucDay: HinhThucDay;

  @ApiPropertyOptional({
    description:
      'Khu vực nhận dạy (nhóm phường/xã). Bắt buộc ít nhất 1 khi hinhThucDay là TAI_NHA hoặc CA_HAI; ONLINE được bỏ trống hoặc gửi []',
    type: [String],
    example: ['Bình Thạnh', 'Phú Nhuận'],
  })
  @ValidateIf(
    (o: ApplyTutorDto) =>
      o.hinhThucDay !== HinhThucDay.ONLINE || o.khuVucNhanDay !== undefined,
  )
  @IsArray()
  @Validate(KhuVucTheoHinhThucDay)
  @ArrayMaxSize(20)
  @ArrayUnique()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(100, { each: true })
  khuVucNhanDay?: string[];

  @ApiPropertyOptional({
    description: 'Mức thù lao mong muốn (VND/buổi)',
    type: 'integer',
    minimum: 0,
    example: 200000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(10_000_000)
  thuLaoMongMuon?: number;

  @ApiPropertyOptional({
    description: 'Giới thiệu bản thân, phương pháp giảng dạy',
    maxLength: 2000,
    example:
      'Chia nhỏ kiến thức, luyện tập từng bước để học viên hiểu bản chất.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  gioiThieu?: string;

  @ApiPropertyOptional({
    maxLength: 2000,
    example: '2 năm dạy kèm Toán lớp 6–9',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  kinhNghiem?: string;

  @ApiProperty({
    description: 'Môn dạy và các cấp dạy được, ít nhất 1 môn',
    type: [MonDayInputDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ArrayUnique((monDay: MonDayInputDto) => monDay.monHocId, {
    message: 'Mỗi môn học chỉ được khai báo một lần',
  })
  @ValidateNested({ each: true })
  @Type(() => MonDayInputDto)
  monDay: MonDayInputDto[];

  @ApiPropertyOptional({
    description: 'Lịch rảnh hằng tuần; có thể bổ sung sau khi đăng nhập',
    type: [LichRanhInputDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => LichRanhInputDto)
  lichRanh?: LichRanhInputDto[];

  @ApiProperty({
    description:
      'Giấy tờ năng lực; bắt buộc có thẻ sinh viên còn hạn hoặc bằng tốt nghiệp',
    type: [HoSoNangLucInputDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => HoSoNangLucInputDto)
  hoSoNangLuc: HoSoNangLucInputDto[];

  @ApiProperty({
    description:
      'Mật khẩu tài khoản ứng viên, 8–72 ký tự (giới hạn của bcrypt)',
    minLength: 8,
    maxLength: 72,
    example: 'MatKhau@123',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  matKhau: string;

  @ApiProperty({
    description:
      'Đồng ý để trung tâm xử lý dữ liệu cá nhân, kể cả giấy tờ định danh. Phải là true; server ghi nhận thời điểm đồng ý',
    type: Boolean,
    example: true,
  })
  @Equals(true, {
    message: 'Cần đồng ý xử lý dữ liệu cá nhân để gửi hồ sơ',
  })
  dongYXuLyDuLieu: boolean;
}

/** Kết quả gửi hồ sơ: đủ để FE báo thành công và hướng dẫn đăng nhập. */
export class ApplyTutorResultDto {
  @ApiProperty({ description: 'Mã gia sư dạng GSxxxxx', example: 'GS00016' })
  ma: string;

  @ApiProperty({ example: 'Vũ Ngọc Hân' })
  hoTen: string;

  @ApiProperty({
    enum: TrangThaiGiaSu,
    enumName: 'TrangThaiGiaSu',
    example: TrangThaiGiaSu.CHO_DUYET,
  })
  trangThai: TrangThaiGiaSu;

  @ApiProperty({
    description: 'Tên đăng nhập của tài khoản ứng viên (= soDienThoai)',
    example: '0903826154',
  })
  tenDangNhap: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-11-23T03:15:00.000Z',
  })
  ngayUngTuyen: Date;
}
