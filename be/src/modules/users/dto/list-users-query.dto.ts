import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto.js';
import {
  TrangThaiTaiKhoan,
  VaiTro,
} from '../../../common/enums/tai-khoan.enum.js';

export class ListUsersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Tìm theo tên đăng nhập, họ tên, email hoặc số điện thoại',
    example: 'an',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @ApiPropertyOptional({ enum: VaiTro, enumName: 'VaiTro' })
  @IsOptional()
  @IsEnum(VaiTro)
  vaiTro?: VaiTro;

  @ApiPropertyOptional({
    enum: TrangThaiTaiKhoan,
    enumName: 'TrangThaiTaiKhoan',
  })
  @IsOptional()
  @IsEnum(TrangThaiTaiKhoan)
  trangThai?: TrangThaiTaiKhoan;
}
