import { PartialType, PickType } from '@nestjs/swagger';
import { CreateParentDto } from './create-parent.dto.js';

/** Đổi SĐT đồng bộ tên đăng nhập nếu có tài khoản; không sửa metadata/ghi chú nội bộ. */
export class UpdateParentDto extends PartialType(
  PickType(CreateParentDto, [
    'hoTen',
    'soDienThoai',
    'email',
    'zalo',
    'diaChi',
  ] as const),
  { skipNullProperties: false },
) {}
