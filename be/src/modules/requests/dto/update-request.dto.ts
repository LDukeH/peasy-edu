import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsObject,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { UpdateRequestNeedsDto } from './request-needs.dto.js';
export class UpdateRequestDto {
  @ApiPropertyOptional({ type: UpdateRequestNeedsDto })
  @ValidateIf((_o, v) => v !== undefined)
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateRequestNeedsDto)
  nhuCau?: UpdateRequestNeedsDto;
  @ApiPropertyOptional({ type: 'integer', minimum: 1, example: 2 })
  @ValidateIf((_o, v) => v !== undefined)
  @IsInt()
  @Min(1)
  nhanVienPhuTrachId?: number;
}
