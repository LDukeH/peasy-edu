import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, ValidateBy } from 'class-validator';
import { TrangThaiCapNhatYeuCau } from '../../../common/enums/yeu-cau.enum.js';
/** Chỉ validate payload; chuyển trạng thái từ bản ghi hiện tại thuộc task logic. */
export class UpdateRequestStatusDto {
  @ApiProperty({
    enum: TrangThaiCapNhatYeuCau,
    enumName: 'TrangThaiCapNhatYeuCau',
    example: TrangThaiCapNhatYeuCau.DA_TU_VAN,
  })
  @IsEnum(TrangThaiCapNhatYeuCau)
  trangThai: TrangThaiCapNhatYeuCau;
  @ApiPropertyOptional({
    type: String,
    minLength: 1,
    maxLength: 500,
    example: 'Gia đình thay đổi kế hoạch',
    description:
      'Bắt buộc có nội dung khi HUY; phải bỏ trường này khi đích khác HUY.',
  })
  @ValidateBy({
    name: 'lyDoHuyHopLe',
    validator: {
      validate(value: unknown, args) {
        const dto = args?.object as UpdateRequestStatusDto;
        return dto.trangThai === TrangThaiCapNhatYeuCau.HUY
          ? typeof value === 'string' &&
              /\S/.test(value) &&
              Array.from(value).length <= 500
          : value === undefined;
      },
      defaultMessage: () =>
        'lyDoHuy bắt buộc 1–500 ký tự có nội dung khi HUY; không gửi ở trạng thái khác',
    },
  })
  lyDoHuy?: string;
}
