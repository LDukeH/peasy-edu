import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
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
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { AuthUser } from '../../common/auth/auth-user.js';
import {
  CuaMinh,
  CurrentUser,
  Public,
  Roles,
} from '../../common/auth/auth.decorators.js';
import { ErrorResponseDto } from '../../common/dto/error-response.dto.js';
import { VaiTro } from '../../common/enums/tai-khoan.enum.js';
import { ApplyTutorDto, ApplyTutorResultDto } from './dto/apply-tutor.dto.js';
import {
  LichRanhDto,
  ReplaceTutorAvailabilityDto,
} from './dto/lich-ranh.dto.js';
import { ListTutorsQueryDto } from './dto/list-tutors-query.dto.js';
import { MonDayDto, ReplaceTutorSubjectsDto } from './dto/mon-day.dto.js';
import { ReviewTutorDto } from './dto/review-tutor.dto.js';
import { TutorListResponseDto } from './dto/tutor-list-response.dto.js';
import { TutorDetailDto } from './dto/tutor.dto.js';
import { UpdateTutorDto } from './dto/update-tutor.dto.js';
import {
  TutorApplyThrottlerGuard,
  UNG_TUYEN_KHOANG_THOI_GIAN_MS,
  UNG_TUYEN_SO_LAN_TOI_DA,
} from './tutor-apply-throttler.guard.js';
import { TutorsService } from './tutors.service.js';

const CHUA_DANG_NHAP = {
  type: ErrorResponseDto,
  description: 'Chưa đăng nhập hoặc access token hết hạn',
};
const KHONG_TIM_THAY = {
  type: ErrorResponseDto,
  description: 'Không tìm thấy gia sư',
};

/**
 * Hồ sơ gia sư, môn dạy, lịch rảnh và duyệt hồ sơ (Mục 6.2).
 * Bảng 9 "Hồ sơ gia sư, duyệt gia sư": NV ✔, Chủ TT xem, GS của mình, Khách gửi.
 * MVP: QUAN_LY chỉ xem; DIEU_PHOI sửa và duyệt; GIA_SU chỉ hồ sơ của mình.
 */
@ApiTags('Tutors')
@Controller('tutors')
export class TutorsController {
  constructor(private readonly tutors: TutorsService) {}

  @Post('apply')
  @Public()
  @UseGuards(TutorApplyThrottlerGuard)
  @Throttle({
    default: {
      limit: UNG_TUYEN_SO_LAN_TOI_DA,
      ttl: UNG_TUYEN_KHOANG_THOI_GIAN_MS,
    },
  })
  @ApiOperation({
    summary: 'Ứng tuyển làm gia sư (công khai)',
    description:
      'Tạo hồ sơ GSxxxxx ở trạng thái CHO_DUYET kèm môn dạy, lịch rảnh, giấy tờ; tạo tài khoản ứng viên vai trò GIA_SU (tenDangNhap = soDienThoai) để đăng nhập theo dõi kết quả. Không đăng nhập tự động. Các tệp (ảnh CCCD, chân dung, giấy tờ) tải lên trước qua API upload rồi gửi đường dẫn.',
  })
  @ApiCreatedResponse({ type: ApplyTutorResultDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description:
      'Dữ liệu không hợp lệ: thiếu thẻ sinh viên/bằng tốt nghiệp, môn không tồn tại hoặc ngừng sử dụng, cấp học không áp dụng cho môn, lịch rảnh chồng nhau…',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description:
      'Số CCCD, số điện thoại hoặc email đã có hồ sơ; hoặc số điện thoại đã là tên đăng nhập của tài khoản khác',
  })
  @ApiTooManyRequestsResponse({
    type: ErrorResponseDto,
    description: 'Gửi hồ sơ quá nhiều lần, vui lòng chờ',
  })
  apply(@Body() dto: ApplyTutorDto): Promise<ApplyTutorResultDto> {
    return this.tutors.apply(dto);
  }

  @Get()
  @Roles(VaiTro.QUAN_LY, VaiTro.DIEU_PHOI)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Danh sách gia sư và hồ sơ ứng tuyển (lọc, phân trang)',
    description:
      'Lọc trangThai=CHO_DUYET để lấy hồ sơ ứng tuyển cần xử lý. Hồ sơ mới nộp đứng trước.',
  })
  @ApiOkResponse({ type: TutorListResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Tham số lọc không hợp lệ',
  })
  @ApiUnauthorizedResponse(CHUA_DANG_NHAP)
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Không phải vai trò QUAN_LY hoặc DIEU_PHOI',
  })
  findAll(@Query() query: ListTutorsQueryDto): Promise<TutorListResponseDto> {
    return this.tutors.findAll(query);
  }

  // Khai báo trước ':id' để "me" không bị ParseIntPipe bắt.
  @Get('me')
  @Roles(VaiTro.GIA_SU)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Hồ sơ gia sư của tài khoản đang đăng nhập',
    description:
      'Dùng cho Gia sư · Tổng quan và Chỉnh sửa hồ sơ; lấy id để gọi các API /tutors/:id.',
  })
  @ApiOkResponse({ type: TutorDetailDto })
  @ApiUnauthorizedResponse(CHUA_DANG_NHAP)
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Không phải vai trò GIA_SU',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Tài khoản chưa liên kết hồ sơ gia sư',
  })
  findMe(@CurrentUser() user: AuthUser): Promise<TutorDetailDto> {
    return this.tutors.findMe(user);
  }

  @Get(':id')
  @Roles(VaiTro.QUAN_LY, VaiTro.DIEU_PHOI, VaiTro.GIA_SU)
  @CuaMinh('GIA_SU')
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Chi tiết hồ sơ gia sư',
    description:
      'Kèm môn dạy, lịch rảnh, giấy tờ. CCCD và số tài khoản luôn được che. Gia sư chỉ xem được hồ sơ của mình.',
  })
  @ApiOkResponse({ type: TutorDetailDto })
  @ApiUnauthorizedResponse(CHUA_DANG_NHAP)
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Sai vai trò, hoặc gia sư xem hồ sơ không phải của mình',
  })
  @ApiNotFoundResponse(KHONG_TIM_THAY)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TutorDetailDto> {
    return this.tutors.findOne(id);
  }

  @Patch(':id')
  @Roles(VaiTro.DIEU_PHOI, VaiTro.GIA_SU)
  @CuaMinh('GIA_SU')
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Sửa hồ sơ gia sư',
    description:
      'Liên hệ, địa chỉ, học vấn, hình thức và khu vực nhận dạy, thù lao mong muốn, giới thiệu, tài khoản nhận thù lao. Đổi soDienThoai thì đổi luôn tenDangNhap. Thay đổi được ghi nhật ký.',
  })
  @ApiOkResponse({ type: TutorDetailDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description:
      'Dữ liệu không hợp lệ (vd. chuyển sang dạy tại nhà mà chưa có khu vực nhận dạy)',
  })
  @ApiUnauthorizedResponse(CHUA_DANG_NHAP)
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Sai vai trò, hoặc gia sư sửa hồ sơ không phải của mình',
  })
  @ApiNotFoundResponse(KHONG_TIM_THAY)
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Số điện thoại hoặc email đã được sử dụng',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTutorDto,
    @CurrentUser() user: AuthUser,
  ): Promise<TutorDetailDto> {
    return this.tutors.update(id, dto, user);
  }

  @Put(':id/subjects')
  @Roles(VaiTro.DIEU_PHOI, VaiTro.GIA_SU)
  @CuaMinh('GIA_SU')
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Cập nhật môn dạy (thay toàn bộ danh sách)',
    description:
      'Gửi đủ danh sách môn dạy mới; môn không có trong danh sách sẽ bị bỏ. Trả về danh sách sau khi lưu.',
  })
  @ApiOkResponse({ type: [MonDayDto] })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description:
      'Môn không tồn tại hoặc ngừng sử dụng, cấp học không áp dụng cho môn, môn bị lặp',
  })
  @ApiUnauthorizedResponse(CHUA_DANG_NHAP)
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Sai vai trò, hoặc gia sư sửa hồ sơ không phải của mình',
  })
  @ApiNotFoundResponse(KHONG_TIM_THAY)
  replaceSubjects(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReplaceTutorSubjectsDto,
    @CurrentUser() user: AuthUser,
  ): Promise<MonDayDto[]> {
    return this.tutors.replaceSubjects(id, dto, user);
  }

  @Put(':id/availability')
  @Roles(VaiTro.DIEU_PHOI, VaiTro.GIA_SU)
  @CuaMinh('GIA_SU')
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Cập nhật lịch rảnh tuần (thay toàn bộ danh sách)',
    description:
      'Gửi đủ các khung giờ rảnh hằng tuần; chỉ giữ bản hiện hành, thay đổi được ghi nhật ký. Trả về danh sách đã sắp theo thứ và giờ bắt đầu.',
  })
  @ApiOkResponse({ type: [LichRanhDto] })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description:
      'Giờ kết thúc không sau giờ bắt đầu, hoặc các khung cùng thứ chồng nhau',
  })
  @ApiUnauthorizedResponse(CHUA_DANG_NHAP)
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Sai vai trò, hoặc gia sư sửa hồ sơ không phải của mình',
  })
  @ApiNotFoundResponse(KHONG_TIM_THAY)
  replaceAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReplaceTutorAvailabilityDto,
    @CurrentUser() user: AuthUser,
  ): Promise<LichRanhDto[]> {
    return this.tutors.replaceAvailability(id, dto, user);
  }

  @Post(':id/review')
  @Roles(VaiTro.DIEU_PHOI)
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Duyệt hoặc từ chối hồ sơ ứng tuyển',
    description:
      'Chỉ hồ sơ CHO_DUYET. DUYET → DANG_HOAT_DONG, ghi ngày và người duyệt, các giấy tờ chuyển DA_XAC_MINH (MVP chưa xác minh từng giấy tờ riêng). TU_CHOI → BI_TU_CHOI kèm lý do. Ghi nhật ký thay đổi.',
  })
  @ApiOkResponse({ type: TutorDetailDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Dữ liệu không hợp lệ (vd. từ chối mà không có lý do)',
  })
  @ApiUnauthorizedResponse(CHUA_DANG_NHAP)
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Không phải vai trò DIEU_PHOI',
  })
  @ApiNotFoundResponse(KHONG_TIM_THAY)
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Hồ sơ không ở trạng thái CHO_DUYET',
  })
  review(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReviewTutorDto,
    @CurrentUser() user: AuthUser,
  ): Promise<TutorDetailDto> {
    return this.tutors.review(id, dto, user);
  }
}
