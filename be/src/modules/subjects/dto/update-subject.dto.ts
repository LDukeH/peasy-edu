import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TrangThaiMonHoc } from '../../../common/enums/mon-hoc.enum.js';
import { CreateSubjectDto } from './create-subject.dto.js';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
  @ApiPropertyOptional({
    description: 'Ngừng sử dụng thay cho xóa khi môn đã có lớp',
    enum: TrangThaiMonHoc,
    enumName: 'TrangThaiMonHoc',
    example: TrangThaiMonHoc.NGUNG_SU_DUNG,
  })
  @IsOptional()
  @IsEnum(TrangThaiMonHoc)
  trangThai?: TrangThaiMonHoc;
}
