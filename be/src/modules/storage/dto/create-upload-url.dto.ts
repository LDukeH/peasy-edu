import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/** Mục đích tệp tải lên cho hồ sơ ứng tuyển gia sư (W2-NỀN). */
export enum MucDichUpload {
  CCCD_MAT_TRUOC = 'CCCD_MAT_TRUOC',
  CCCD_MAT_SAU = 'CCCD_MAT_SAU',
  ANH_CHAN_DUNG = 'ANH_CHAN_DUNG',
  GIAY_TO_NANG_LUC = 'GIAY_TO_NANG_LUC',
}

/** Tối đa 15 MB mỗi tệp (phù hợp ảnh độ phân giải cao và PDF nhiều trang). */
export const KICH_THUOC_TEP_TOI_DA = 15 * 1024 * 1024;

export class CreateUploadUrlDto {
  @ApiProperty({
    description: 'Loại tệp trong hồ sơ ứng tuyển',
    enum: MucDichUpload,
    enumName: 'MucDichUpload',
    example: MucDichUpload.CCCD_MAT_TRUOC,
  })
  @IsEnum(MucDichUpload)
  mucDich: MucDichUpload;

  @ApiProperty({
    description:
      'MIME type của tệp. Ảnh nhận image/jpeg, image/png, image/webp; giấy tờ năng lực nhận thêm application/pdf',
    example: 'image/jpeg',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  loaiTep: string;

  @ApiProperty({
    description: 'Dung lượng tệp (byte), tối đa 15 MB',
    type: 'integer',
    minimum: 1,
    maximum: KICH_THUOC_TEP_TOI_DA,
    example: 350000,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(KICH_THUOC_TEP_TOI_DA)
  kichThuoc: number;
}

export class UploadUrlResponseDto {
  @ApiProperty({
    description:
      'Đường dẫn tệp trên Storage — gửi giá trị này vào POST /api/tutors/apply',
    example:
      'ung-tuyen/550e8400-e29b-41d4-a716-446655440000/cccd-mat-truoc.jpg',
  })
  path: string;

  @ApiProperty({
    description: 'Presigned URL để FE PUT tệp trực tiếp lên Supabase Storage',
    example:
      'https://project-ref.supabase.co/storage/v1/object/upload/sign/peasy-private/ung-tuyen/...',
  })
  uploadUrl: string;

  @ApiProperty({
    description: 'Token đi kèm của Supabase (dùng nếu gọi uploadToSignedUrl)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}
