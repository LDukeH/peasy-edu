import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { AuthUser } from '../../common/auth/auth-user.js';
import {
  CurrentUser,
  Public,
  Roles,
} from '../../common/auth/auth.decorators.js';
import { ErrorResponseDto } from '../../common/dto/error-response.dto.js';
import { VaiTro } from '../../common/enums/tai-khoan.enum.js';
import {
  CreateUploadUrlDto,
  UploadUrlResponseDto,
} from './dto/create-upload-url.dto.js';
import {
  CreateSignedUrlDto,
  SignedUrlResponseDto,
} from './dto/signed-url.dto.js';
import {
  StorageUploadThrottlerGuard,
  UPLOAD_URL_KHOANG_THOI_GIAN_MS,
  UPLOAD_URL_SO_LAN_TOI_DA,
} from './storage-upload-throttler.guard.js';
import { StorageService } from './storage.service.js';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storage: StorageService) {}

  @Post('upload-url')
  @Public()
  @UseGuards(StorageUploadThrottlerGuard)
  @Throttle({
    default: {
      limit: UPLOAD_URL_SO_LAN_TOI_DA,
      ttl: UPLOAD_URL_KHOANG_THOI_GIAN_MS,
    },
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xin Presigned Upload URL cho hồ sơ ứng tuyển (công khai)',
    description:
      'FE gửi loại tệp và dung lượng để nhận uploadUrl và path, PUT tệp trực tiếp lên Supabase Storage rồi gửi path vào POST /api/tutors/apply.',
  })
  @ApiOkResponse({ type: UploadUrlResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Định dạng tệp hoặc dung lượng không hợp lệ',
  })
  @ApiTooManyRequestsResponse({
    type: ErrorResponseDto,
    description: 'Yêu cầu tạo URL tải tệp quá nhiều lần, vui lòng chờ',
  })
  createUploadUrl(
    @Body() dto: CreateUploadUrlDto,
  ): Promise<UploadUrlResponseDto> {
    return this.storage.createUploadUrl(dto);
  }

  @Post('signed-url')
  @Roles(VaiTro.QUAN_LY, VaiTro.DIEU_PHOI, VaiTro.GIA_SU)
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Cấp Signed URL tạm thời (5 phút) để xem tệp hồ sơ',
    description:
      'QUAN_LY và DIEU_PHOI xem được mọi tệp hồ sơ; GIA_SU chỉ xem được tệp thuộc hồ sơ của chính mình.',
  })
  @ApiOkResponse({ type: SignedUrlResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Đường dẫn tệp không hợp lệ',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDto,
    description: 'Chưa đăng nhập hoặc phiên đã hết hạn',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Sai vai trò hoặc gia sư xem tệp không phải của mình',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Không tìm thấy tệp trên Storage (vd. đường dẫn giả từ seed)',
  })
  createSignedUrl(
    @Body() dto: CreateSignedUrlDto,
    @CurrentUser() user: AuthUser,
  ): Promise<SignedUrlResponseDto> {
    return this.storage.createSignedUrl(dto, user);
  }
}
