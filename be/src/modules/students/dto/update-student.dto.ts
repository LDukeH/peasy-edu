import { PartialType, PickType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto.js';

export class UpdateStudentDto extends PartialType(
  PickType(CreateStudentDto, [
    'hoTen',
    'capHoc',
    'khoiLop',
    'truong',
    'hocLuc',
    'soDienThoai',
    'email',
    'diaChi',
  ] as const),
  { skipNullProperties: false },
) {}
