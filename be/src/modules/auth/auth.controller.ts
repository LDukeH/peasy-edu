import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
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
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import type { AuthUser } from '../../common/auth/auth-user.js';
import { CurrentUser, Public } from '../../common/auth/auth.decorators.js';
import { ErrorResponseDto } from '../../common/dto/error-response.dto.js';
import { UserDto } from '../users/dto/user.dto.js';
import { UsersService } from '../users/users.service.js';
import { AuthThrottlerGuard } from './auth-throttler.guard.js';
import {
  LOGIN_LIMIT_PER_MINUTE,
  REFRESH_COOKIE,
  REGISTER_LIMIT_PER_MINUTE,
  THROTTLE_TTL_MS,
} from './auth.constants.js';
import { clearAuthCookies, setAuthCookies } from './auth.cookies.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

/**
 * Token chỉ đi qua cookie httpOnly (SameSite=Lax): `access_token` và `refresh_token`.
 * Body không bao giờ chứa token. FE tự gọi POST /api/auth/refresh khi gặp 401.
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(AuthThrottlerGuard)
  @Throttle({
    default: { limit: LOGIN_LIMIT_PER_MINUTE, ttl: THROTTLE_TTL_MS },
  })
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
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto> {
    const { user, tokens } = await this.auth.login(dto);
    setAuthCookies(res, tokens);
    return user;
  }

  @Post('register')
  @Public()
  @UseGuards(AuthThrottlerGuard)
  @Throttle({
    default: { limit: REGISTER_LIMIT_PER_MINUTE, ttl: THROTTLE_TTL_MS },
  })
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
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDto> {
    const { user, tokens } = await this.auth.register(dto);
    setAuthCookies(res, tokens);
    return user;
  }

  @Post('refresh')
  @Public()
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
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const cookies = req.cookies as Record<string, unknown> | undefined;
    setAuthCookies(res, await this.auth.refresh(cookies?.[REFRESH_COOKIE]));
  }

  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Đăng xuất',
    description:
      'Xóa cookie `access_token` + `refresh_token`. Không yêu cầu access token còn hạn, luôn trả 204.',
  })
  @ApiNoContentResponse({ description: 'Đã đăng xuất' })
  logout(@Res({ passthrough: true }) res: Response): void {
    clearAuthCookies(res);
  }

  @Get('me')
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Thông tin tài khoản đang đăng nhập' })
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Chưa đăng nhập hoặc access token hết hạn',
  })
  me(@CurrentUser() user: AuthUser): Promise<UserDto> {
    return this.users.findOne(user.id);
  }
}
