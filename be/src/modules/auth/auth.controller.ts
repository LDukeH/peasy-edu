import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../common/dto/error-response.dto.js';
import { UserDto } from '../users/dto/user.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

const CHUA_CAI_DAT = 'Chưa cài đặt – logic thuộc task W1-BE2';

/**
 * Token chỉ đi qua cookie httpOnly (SameSite=Lax): `access_token` và `refresh_token`.
 * Body không bao giờ chứa token. FE tự gọi POST /api/auth/refresh khi gặp 401.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập',
    description:
      'Đúng tên đăng nhập và mật khẩu → đặt cookie `access_token` + `refresh_token`, trả thông tin tài khoản (cùng hình dạng với GET /auth/me).',
  })
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Sai tên đăng nhập hoặc mật khẩu',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Tài khoản đã bị khóa',
  })
  @ApiTooManyRequestsResponse({
    type: ErrorResponseDto,
    description: 'Thử đăng nhập quá nhiều lần, vui lòng chờ',
  })
  login(@Body() _dto: LoginDto): UserDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Phụ huynh tự đăng ký tài khoản',
    description:
      'Tạo tài khoản vai trò PHU_HUYNH, tenDangNhap = soDienThoai; đăng nhập luôn (đặt cookie như /auth/login).',
  })
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Dữ liệu không hợp lệ',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Số điện thoại đã được đăng ký',
  })
  @ApiTooManyRequestsResponse({
    type: ErrorResponseDto,
    description: 'Đăng ký quá nhiều lần, vui lòng chờ',
  })
  register(@Body() _dto: RegisterDto): UserDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Cấp lại access token',
    description:
      'Không có body. Đọc cookie `refresh_token`, đặt lại cả hai cookie. FE gọi tự động khi gặp 401.',
  })
  @ApiNoContentResponse({ description: 'Đã cấp lại token' })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description:
      'Thiếu, sai hoặc hết hạn refresh token; tài khoản bị khóa → FE chuyển về /login',
  })
  refresh(): void {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Đăng xuất',
    description:
      'Xóa cookie `access_token` + `refresh_token`. Không yêu cầu access token còn hạn, luôn trả 204.',
  })
  @ApiNoContentResponse({ description: 'Đã đăng xuất' })
  logout(): void {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Get('me')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Thông tin tài khoản đang đăng nhập' })
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Chưa đăng nhập hoặc access token hết hạn',
  })
  me(): UserDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }
}
