import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDefined,
  IsInt,
  IsObject,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { RequestNeedsDto } from './request-needs.dto.js';
export class CreateRequestDto {
  @ApiProperty({
    type: 'integer',
    minimum: 1,
    example: 1,
    description:
      'Đúng một PH hoặc HV tự đại diện; PH chỉ dùng người thanh toán của mình.',
  })
  @IsInt()
  @Min(1)
  nguoiThanhToanId: number;
  @ApiProperty({
    type: 'array',
    items: { type: 'integer', minimum: 1 },
    minItems: 1,
    maxItems: 4,
    uniqueItems: true,
    example: [1],
    description: 'Cùng người thanh toán; tự đại diện chỉ chọn bản thân.',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(4)
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  hocVienIds: number[];
  @ApiProperty({ type: RequestNeedsDto })
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => RequestNeedsDto)
  nhuCau: RequestNeedsDto;
  @ApiPropertyOptional({
    maxLength: 100,
    example: 'Zalo',
    description: 'DIEU_PHOI bắt buộc ghi kênh; PH gửi trường này trả 403.',
  })
  @ValidateIf((_o, v) => v !== undefined)
  @IsString()
  @Matches(/\S/)
  @MaxLength(100)
  kenhTiepNhan?: string;
  @ApiPropertyOptional({
    type: 'integer',
    minimum: 1,
    example: 1,
    description:
      'Chỉ DIEU_PHOI được chỉ định; PH gửi trả 403. Bỏ qua: NV mặc định chính mình, PH tự gán NV.',
  })
  @ValidateIf((_o, v) => v !== undefined)
  @IsInt()
  @Min(1)
  nhanVienPhuTrachId?: number;
}
