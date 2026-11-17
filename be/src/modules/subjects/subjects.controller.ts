import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../common/dto/error-response.dto.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { ListSubjectsQueryDto } from './dto/list-subjects-query.dto.js';
import { SubjectDto } from './dto/subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';

const CHUA_CAI_DAT = 'Chưa cài đặt – logic thuộc task W1-BE2';

/**
 * Danh mục môn học. Đọc: công khai (khách cần để gửi yêu cầu tìm gia sư).
 * Ghi: chỉ QUAN_LY (Bảng 9 – "Tài khoản, phân quyền, danh mục").
 */
@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
  @Get()
  @ApiOperation({ summary: 'Danh sách môn học (công khai, có lọc)' })
  @ApiOkResponse({ type: [SubjectDto] })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Tham số lọc không hợp lệ',
  })
  findAll(@Query() _query: ListSubjectsQueryDto): SubjectDto[] {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết môn học (công khai)' })
  @ApiOkResponse({ type: SubjectDto })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Không tìm thấy môn học',
  })
  findOne(@Param('id', ParseIntPipe) _id: number): SubjectDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Post()
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Thêm môn học',
    description: 'Hệ thống tự sinh mã MHxx. Chỉ QUAN_LY.',
  })
  @ApiCreatedResponse({ type: SubjectDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description:
      'Dữ liệu không hợp lệ (vd. TIEU_HOC với nhóm không phải năng khiếu – kỹ năng)',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Chưa đăng nhập hoặc access token hết hạn',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Không phải vai trò QUAN_LY',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Tên môn đã tồn tại',
  })
  create(@Body() _dto: CreateSubjectDto): SubjectDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Patch(':id')
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Sửa môn học',
    description:
      'Đổi tên, nhóm, cấp học, mô tả hoặc trangThai (ngừng sử dụng). Chỉ QUAN_LY.',
  })
  @ApiOkResponse({ type: SubjectDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Chưa đăng nhập hoặc access token hết hạn',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Không phải vai trò QUAN_LY',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Không tìm thấy môn học',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Tên môn đã tồn tại',
  })
  update(
    @Param('id', ParseIntPipe) _id: number,
    @Body() _dto: UpdateSubjectDto,
  ): SubjectDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Delete(':id')
  @ApiCookieAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Xóa môn học',
    description:
      'Chỉ xóa được môn chưa gắn lớp/yêu cầu/môn dạy của gia sư; ngược lại trả 409 và FE gợi ý chuyển NGUNG_SU_DUNG. Chỉ QUAN_LY.',
  })
  @ApiNoContentResponse({ description: 'Đã xóa môn học' })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Chưa đăng nhập hoặc access token hết hạn',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Không phải vai trò QUAN_LY',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Không tìm thấy môn học',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Môn đã được sử dụng, chỉ có thể ngừng sử dụng',
  })
  remove(@Param('id', ParseIntPipe) _id: number): void {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }
}
