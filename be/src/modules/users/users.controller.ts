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
import { CreateUserDto } from './dto/create-user.dto.js';
import { ListUsersQueryDto } from './dto/list-users-query.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserListResponseDto } from './dto/user-list-response.dto.js';
import { UserDto } from './dto/user.dto.js';

const CHUA_CAI_DAT = 'Chưa cài đặt – logic thuộc task W1-BE2';

/** Bảng 9: "Tài khoản, phân quyền, danh mục" – chỉ QUAN_LY. */
@ApiTags('Users')
@ApiCookieAuth()
@ApiUnauthorizedResponse({
  type: ErrorResponseDto,
  description: 'Chưa đăng nhập hoặc access token hết hạn',
})
@ApiForbiddenResponse({
  type: ErrorResponseDto,
  description: 'Không phải vai trò QUAN_LY',
})
@Controller('users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'Danh sách tài khoản (phân trang, tìm kiếm, lọc)' })
  @ApiOkResponse({ type: UserListResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Tham số lọc không hợp lệ',
  })
  findAll(@Query() _query: ListUsersQueryDto): UserListResponseDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết một tài khoản' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Không tìm thấy tài khoản',
  })
  findOne(@Param('id', ParseIntPipe) _id: number): UserDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo tài khoản',
    description: 'Mật khẩu được băm bằng bcrypt trước khi lưu.',
  })
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Tên đăng nhập đã tồn tại',
  })
  create(@Body() _dto: CreateUserDto): UserDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Sửa tài khoản',
    description:
      'Đổi họ tên, liên hệ, vai trò, trạng thái; gửi matKhau để đặt lại mật khẩu. Không đổi được tenDangNhap.',
  })
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Không tìm thấy tài khoản',
  })
  update(
    @Param('id', ParseIntPipe) _id: number,
    @Body() _dto: UpdateUserDto,
  ): UserDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Khóa tài khoản (xóa mềm)',
    description:
      'Chuyển trangThai = BI_KHOA, không xóa bản ghi vì còn liên kết nhật ký và dữ liệu nghiệp vụ. Không tự khóa tài khoản đang đăng nhập.',
  })
  @ApiNoContentResponse({ description: 'Đã khóa tài khoản' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Không thể tự khóa tài khoản của mình',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Không tìm thấy tài khoản',
  })
  remove(@Param('id', ParseIntPipe) _id: number): void {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }
}
