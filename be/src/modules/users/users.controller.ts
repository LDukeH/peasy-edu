import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import type { AuthUser } from '../../common/auth/auth-user.js';
import { CurrentUser, Roles } from '../../common/auth/auth.decorators.js';
import { ErrorResponseDto } from '../../common/dto/error-response.dto.js';
import { VaiTro } from '../../common/enums/tai-khoan.enum.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { ListUsersQueryDto } from './dto/list-users-query.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserListResponseDto } from './dto/user-list-response.dto.js';
import { UserDto } from './dto/user.dto.js';
import { UsersService } from './users.service.js';

/** Bảng 9: "Tài khoản, phân quyền, danh mục" – chỉ QUAN_LY. */
@ApiTags('Users')
@Roles(VaiTro.QUAN_LY)
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
  constructor(private readonly users: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách tài khoản (phân trang, tìm kiếm, lọc)' })
  @ApiOkResponse({ type: UserListResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Tham số lọc không hợp lệ',
  })
  findAll(@Query() query: ListUsersQueryDto): Promise<UserListResponseDto> {
    return this.users.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết một tài khoản' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Không tìm thấy tài khoản',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.users.findOne(id);
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
  create(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.users.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Sửa tài khoản',
    description:
      'Đổi họ tên, liên hệ, vai trò, trạng thái; gửi matKhau để đặt lại mật khẩu. Không gửi trực tiếp tenDangNhap; với phụ huynh, đổi soDienThoai sẽ đổi luôn tenDangNhap.',
  })
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Email hoặc số điện thoại đã được sử dụng',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Không tìm thấy tài khoản',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthUser,
  ): Promise<UserDto> {
    return this.users.update(id, dto, user.id);
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
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ): Promise<void> {
    return this.users.remove(id, user.id);
  }
}
