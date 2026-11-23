import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { KetQuaDuyetGiaSu } from '../../../common/enums/gia-su.enum.js';

/**
 * NV điều phối duyệt hồ sơ CHO_DUYET (Mục 6.2, Bảng 15):
 * DUYET → DANG_HOAT_DONG, TU_CHOI → BI_TU_CHOI (bắt buộc ghi lý do).
 */
export class ReviewTutorDto {
  @ApiProperty({
    enum: KetQuaDuyetGiaSu,
    enumName: 'KetQuaDuyetGiaSu',
    example: KetQuaDuyetGiaSu.DUYET,
  })
  @IsEnum(KetQuaDuyetGiaSu)
  ketQua: KetQuaDuyetGiaSu;

  @ApiPropertyOptional({
    description: 'Bắt buộc khi ketQua = TU_CHOI; gia sư xem được lý do',
    maxLength: 500,
    example: 'Thẻ sinh viên đã hết hạn, vui lòng bổ sung bằng tốt nghiệp',
  })
  @ValidateIf(
    (o: ReviewTutorDto) =>
      o.ketQua === KetQuaDuyetGiaSu.TU_CHOI || o.lyDo !== undefined,
  )
  @IsString()
  @IsNotEmpty({ message: 'Cần nhập lý do khi từ chối hồ sơ' })
  @MaxLength(500)
  lyDo?: string;
}
