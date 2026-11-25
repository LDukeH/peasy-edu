import {
  Body,
  Controller,
  Get,
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
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthUser } from '../../common/auth/auth-user.js';
import {
  CuaMinh,
  CurrentUser,
  Roles,
} from '../../common/auth/auth.decorators.js';
import { ErrorResponseDto } from '../../common/dto/error-response.dto.js';
import { VaiTro } from '../../common/enums/tai-khoan.enum.js';
import { CreateParentDto } from './dto/create-parent.dto.js';
import { UpdateParentDto } from './dto/update-parent.dto.js';
import { ListParentsQueryDto } from './dto/list-parents-query.dto.js';
import { ParentDetailDto } from './dto/parent.dto.js';
import { ParentListResponseDto } from './dto/parent-list-response.dto.js';
const CHUA_CAI_DAT =
  'Chưa cài đặt – logic thuộc task BE Phụ huynh, Học viên và Yêu cầu';
@ApiTags('Parents')
@Controller('parents')
export class ParentsController {
  @Post()
  @Roles(VaiTro.DIEU_PHOI)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Tạo hồ sơ phụ huynh',
    description:
      'Hồ sơ nội bộ, không tự tạo tài khoản. Server sinh PHxxxxx, ngày/người tạo và thời điểm đồng ý; chỉ ghi nhận khi có sự đồng ý thật từ người đại diện.',
  })
  @ApiCreatedResponse({ type: ParentDetailDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Dữ liệu DTO, query hoặc ID không hợp lệ.',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Chưa đăng nhập hoặc access token không hợp lệ/hết hạn',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description:
      'Sai vai trò hoặc không có quyền sở hữu; PH trên route có CuaMinh nhận 403 cả khi ID không tồn tại để tránh dò dữ liệu.',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Số điện thoại hoặc tên đăng nhập đã được sử dụng.',
  })
  @ApiResponse({
    status: 501,
    type: ErrorResponseDto,
    description: CHUA_CAI_DAT,
  })
  create(
    @Body() _dto: CreateParentDto,
    @CurrentUser() _user: AuthUser,
  ): ParentDetailDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Get()
  @Roles(VaiTro.QUAN_LY, VaiTro.DIEU_PHOI)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Danh sách phụ huynh',
    description:
      'Tìm mã, tên, SĐT, email không phân biệt hoa thường; ngayTao desc rồi id desc.',
  })
  @ApiOkResponse({ type: ParentListResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Dữ liệu DTO, query hoặc ID không hợp lệ.',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Chưa đăng nhập hoặc access token không hợp lệ/hết hạn',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description:
      'Sai vai trò hoặc không có quyền sở hữu; PH trên route có CuaMinh nhận 403 cả khi ID không tồn tại để tránh dò dữ liệu.',
  })
  @ApiResponse({
    status: 501,
    type: ErrorResponseDto,
    description: CHUA_CAI_DAT,
  })
  findAll(@Query() _query: ListParentsQueryDto): ParentListResponseDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Get('me')
  @Roles(VaiTro.PHU_HUYNH)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Hồ sơ phụ huynh của tài khoản hiện tại',
    description:
      'Tài khoản học viên tự đại diện không có hồ sơ PH trả 404; dùng danh sách học viên để xem bản thân.',
  })
  @ApiOkResponse({ type: ParentDetailDto })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Chưa đăng nhập hoặc access token không hợp lệ/hết hạn',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description:
      'Sai vai trò hoặc không có quyền sở hữu; PH trên route có CuaMinh nhận 403 cả khi ID không tồn tại để tránh dò dữ liệu.',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description:
      'Bản ghi hoặc ID tham chiếu không tồn tại khi được phép tra cứu; PH có CuaMinh có thể nhận 403 trước handler.',
  })
  @ApiResponse({
    status: 501,
    type: ErrorResponseDto,
    description: CHUA_CAI_DAT,
  })
  findMe(@CurrentUser() _user: AuthUser): ParentDetailDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Get(':id')
  @Roles(VaiTro.QUAN_LY, VaiTro.DIEU_PHOI, VaiTro.PHU_HUYNH)
  @ApiCookieAuth()
  @CuaMinh('PHU_HUYNH')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID số nguyên dương',
    example: 1,
  })
  @ApiOperation({
    summary: 'Chi tiết phụ huynh',
    description: 'PH chỉ xem hồ sơ mình. Không trả ghi chú nội bộ.',
  })
  @ApiOkResponse({ type: ParentDetailDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Dữ liệu DTO, query hoặc ID không hợp lệ.',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Chưa đăng nhập hoặc access token không hợp lệ/hết hạn',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description:
      'Sai vai trò hoặc không có quyền sở hữu; PH trên route có CuaMinh nhận 403 cả khi ID không tồn tại để tránh dò dữ liệu.',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description:
      'Bản ghi hoặc ID tham chiếu không tồn tại khi được phép tra cứu; PH có CuaMinh có thể nhận 403 trước handler.',
  })
  @ApiResponse({
    status: 501,
    type: ErrorResponseDto,
    description: CHUA_CAI_DAT,
  })
  findOne(@Param('id', ParseIntPipe) _id: number): ParentDetailDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Patch(':id')
  @Roles(VaiTro.DIEU_PHOI, VaiTro.PHU_HUYNH)
  @ApiCookieAuth()
  @CuaMinh('PHU_HUYNH')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID số nguyên dương',
    example: 1,
  })
  @ApiOperation({
    summary: 'Sửa hồ sơ phụ huynh',
    description:
      'PH chỉ sửa hồ sơ mình. Đổi SĐT đồng bộ tên đăng nhập nếu có tài khoản và ghi lịch sử. Không sửa nguồn tiếp nhận, đồng thuận, tài khoản hoặc ghi chú nội bộ. Xóa địa chỉ khi còn ràng buộc học tại nhà trả 400.',
  })
  @ApiOkResponse({ type: ParentDetailDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Dữ liệu DTO, query hoặc ID không hợp lệ.',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Chưa đăng nhập hoặc access token không hợp lệ/hết hạn',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description:
      'Sai vai trò hoặc không có quyền sở hữu; PH trên route có CuaMinh nhận 403 cả khi ID không tồn tại để tránh dò dữ liệu.',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description:
      'Bản ghi hoặc ID tham chiếu không tồn tại khi được phép tra cứu; PH có CuaMinh có thể nhận 403 trước handler.',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Số điện thoại hoặc tên đăng nhập đã được sử dụng.',
  })
  @ApiResponse({
    status: 501,
    type: ErrorResponseDto,
    description: CHUA_CAI_DAT,
  })
  update(
    @Param('id', ParseIntPipe) _id: number,
    @Body() _dto: UpdateParentDto,
    @CurrentUser() _user: AuthUser,
  ): ParentDetailDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }
}
