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
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthUser } from '../../common/auth/auth-user.js';
import {
  CuaMinh,
  CurrentUser,
  Public,
  Roles,
} from '../../common/auth/auth.decorators.js';
import { ErrorResponseDto } from '../../common/dto/error-response.dto.js';
import { VaiTro } from '../../common/enums/tai-khoan.enum.js';
import {
  SubmitRequestDto,
  SubmitRequestResultDto,
} from './dto/submit-request.dto.js';
import { CreateRequestDto } from './dto/create-request.dto.js';
import { UpdateRequestDto } from './dto/update-request.dto.js';
import { UpdateRequestStatusDto } from './dto/update-request-status.dto.js';
import { ListRequestsQueryDto } from './dto/list-requests-query.dto.js';
import { RequestDetailDto } from './dto/request.dto.js';
import { RequestListResponseDto } from './dto/request-list-response.dto.js';
const CHUA_CAI_DAT =
  'Chưa cài đặt – logic thuộc task BE Phụ huynh, Học viên và Yêu cầu';
@ApiTags('Requests')
@Controller('requests')
export class RequestsController {
  @Post('submit')
  @Public()
  @ApiOperation({
    summary: 'Gửi yêu cầu tìm gia sư lần đầu (công khai)',
    description:
      'Hai nhánh PHU_HUYNH và BAN_THAN (từ đủ 18 tuổi). Tạo nguyên tử hồ sơ, tài khoản quyền PHU_HUYNH và YC MOI; không tự đăng nhập, không trả token/cookie. SĐT là tên đăng nhập. Trùng tài khoản hoặc hồ sơ PH trả 409, yêu cầu đăng nhập hoặc liên hệ trung tâm; không tự ghép theo SĐT. Mỗi YC một môn, 1–4 HV cùng người thanh toán và địa điểm; BAN_THAN chỉ một HV và không tạo PH giả. Kênh WEBSITE, server chọn NV DIEU_PHOI hoạt động có id nhỏ nhất; không có NV trả 409 và không tạo dở dữ liệu. Ghi thời điểm/đồng thuận PH; BAN_THAN ghi sự kiện đồng thuận vào NhatKyThayDoi hiện có. Các hành vi tạo/tuổi/đồng thuận/phân công và giới hạn tần suất thuộc task logic sau.',
  })
  @ApiCreatedResponse({ type: SubmitRequestResultDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description:
      'Dữ liệu DTO, query hoặc ID không hợp lệ. Nhu cầu: môn phải tồn tại, đang dùng và áp dụng đúng cấp (tiểu học chỉ nhóm năng khiếu/kỹ năng); địa chỉ bắt buộc khi tại nhà; kết thúc sau bắt đầu cùng ngày, khung giờ không chồng nhau. Quan hệ người thanh toán/học viên và tuổi/đồng thuận phải hợp lệ. Các kiểm tra cần dữ liệu do task logic thực hiện.',
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description:
      'Trùng SĐT/tài khoản/hồ sơ PH, không có NV tiếp nhận, nguồn/trạng thái hiện tại không cho phép thao tác hoặc chuyển trạng thái không hợp lệ (kể cả lặp cùng trạng thái).',
  })
  @ApiTooManyRequestsResponse({
    type: ErrorResponseDto,
    description:
      'Gửi form quá nhiều lần, vui lòng chờ; giới hạn thực thi ở task logic sau.',
  })
  @ApiResponse({
    status: 501,
    type: ErrorResponseDto,
    description: CHUA_CAI_DAT,
  })
  submit(@Body() _dto: SubmitRequestDto): SubmitRequestResultDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Post()
  @Roles(VaiTro.DIEU_PHOI, VaiTro.PHU_HUYNH)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Tạo yêu cầu từ hồ sơ có sẵn',
    description:
      'Người thanh toán trỏ đúng một PH hoặc HV tự đại diện; tất cả 1–4 hocVienIds không trùng, cùng người thanh toán. Tự đại diện chỉ chọn chính mình. PH chỉ dùng hồ sơ sở hữu; gửi NV/kênh tiếp nhận trả 403. PH được server gán kênh WEBSITE và NV DIEU_PHOI hoạt động id nhỏ nhất; không có NV trả 409. NV nhập hộ phải ghi kênh, có thể chọn NV hợp lệ hoặc mặc định chính mình. Server sinh YCxxxxx, ngày tiếp nhận và trạng thái MOI. Không tự cấp tài khoản; bảo đảm NguoiThanhToan đã được tạo ở task logic.',
  })
  @ApiCreatedResponse({ type: RequestDetailDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description:
      'Dữ liệu DTO không hợp lệ; môn ngừng sử dụng/không áp dụng đúng cấp, quan hệ người thanh toán/học viên hoặc NV phụ trách không hợp lệ; địa chỉ tại nhà hoặc khung giờ không hợp lệ.',
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
    description:
      'Trùng SĐT/tài khoản/hồ sơ PH, không có NV tiếp nhận, nguồn/trạng thái hiện tại không cho phép thao tác hoặc chuyển trạng thái không hợp lệ (kể cả lặp cùng trạng thái).',
  })
  @ApiResponse({
    status: 501,
    type: ErrorResponseDto,
    description: CHUA_CAI_DAT,
  })
  create(
    @Body() _dto: CreateRequestDto,
    @CurrentUser() _user: AuthUser,
  ): RequestDetailDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Get()
  @Roles(VaiTro.QUAN_LY, VaiTro.DIEU_PHOI, VaiTro.PHU_HUYNH)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Danh sách yêu cầu theo trạng thái và bộ lọc',
    description:
      'PH chỉ thấy YC thuộc người thanh toán của mình; query ID không mở rộng quyền. Filter dùng đủ 7 trạng thái Prisma; tìm mã không phân biệt hoa thường. Sắp ngayTiepNhan desc rồi id desc.',
  })
  @ApiOkResponse({ type: RequestListResponseDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Tham số lọc hoặc phân trang không hợp lệ.',
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
  findAll(
    @Query() _query: ListRequestsQueryDto,
    @CurrentUser() _user: AuthUser,
  ): RequestListResponseDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Get(':id')
  @Roles(VaiTro.QUAN_LY, VaiTro.DIEU_PHOI, VaiTro.PHU_HUYNH)
  @ApiCookieAuth()
  @CuaMinh('YEU_CAU')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID số nguyên dương',
    example: 1,
  })
  @ApiOperation({
    summary: 'Chi tiết yêu cầu tìm gia sư',
    description:
      'PH chỉ xem YC sở hữu; trả nhu cầu, ID học viên và người thanh toán, không lộ thông tin tài khoản.',
  })
  @ApiOkResponse({ type: RequestDetailDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'ID đường dẫn không hợp lệ.',
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
  findOne(@Param('id', ParseIntPipe) _id: number): RequestDetailDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Patch(':id')
  @Roles(VaiTro.DIEU_PHOI)
  @ApiCookieAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID số nguyên dương',
    example: 1,
  })
  @ApiOperation({
    summary: 'Sửa nhu cầu hoặc nhân viên phụ trách',
    description:
      'Chỉ MOI, DA_TU_VAN, DANG_TIM_GS; trạng thái khác trả 409. Body nhuCau lồng, từng trường optional. Không đổi người thanh toán, học viên, kênh, mã, ngày tiếp nhận hoặc trạng thái. Kiểm tra sau merge: TAI_NHA phải có địa chỉ hợp lệ kể cả địa chỉ cũ; không bắt gửi lại khi PATCH. Đổi NV ghi nhật ký.',
  })
  @ApiOkResponse({ type: RequestDetailDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description:
      'Dữ liệu DTO, query hoặc ID không hợp lệ. Nhu cầu: môn phải tồn tại, đang dùng và áp dụng đúng cấp (tiểu học chỉ nhóm năng khiếu/kỹ năng); địa chỉ bắt buộc khi tại nhà; kết thúc sau bắt đầu cùng ngày, khung giờ không chồng nhau. Quan hệ người thanh toán/học viên và tuổi/đồng thuận phải hợp lệ. Các kiểm tra cần dữ liệu do task logic thực hiện.',
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
    description:
      'Trùng SĐT/tài khoản/hồ sơ PH, không có NV tiếp nhận, nguồn/trạng thái hiện tại không cho phép thao tác hoặc chuyển trạng thái không hợp lệ (kể cả lặp cùng trạng thái).',
  })
  @ApiResponse({
    status: 501,
    type: ErrorResponseDto,
    description: CHUA_CAI_DAT,
  })
  update(
    @Param('id', ParseIntPipe) _id: number,
    @Body() _dto: UpdateRequestDto,
    @CurrentUser() _user: AuthUser,
  ): RequestDetailDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }

  @Patch(':id/status')
  @Roles(VaiTro.DIEU_PHOI, VaiTro.PHU_HUYNH)
  @ApiCookieAuth()
  @CuaMinh('YEU_CAU')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID số nguyên dương',
    example: 1,
  })
  @ApiOperation({
    summary: 'Cập nhật trạng thái yêu cầu giai đoạn đầu',
    description:
      'DIEU_PHOI: MOI → DA_TU_VAN → DANG_TIM_GS; DIEU_PHOI hoặc PH sở hữu: từ bất kỳ trạng thái nào trong ba trạng thái đầu → HUY, bắt buộc lý do. PH chuyển tiến trả 403. Đích chỉ DA_TU_VAN/DANG_TIM_GS/HUY; enum sai hoặc lý do không hợp lệ trả 400. Nhảy bước, chuyển ngược, lặp chính trạng thái, mở lại HUY hoặc nguồn DA_DE_XUAT/DANG_HOC_THU/THANH_CONG/HUY trả 409. Chuyển giai đoạn ghép/học thử thuộc task sau. Auth/quyền sở hữu kiểm tra trước chuyển trạng thái; thay đổi được ghi nhật ký ở task logic.',
  })
  @ApiOkResponse({ type: RequestDetailDto })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description:
      'ID hoặc trạng thái đích không hợp lệ; HUY thiếu lý do, lý do chỉ có khoảng trắng/quá 500 ký tự, hoặc gửi lý do ở đích khác HUY.',
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
    description:
      'Trùng SĐT/tài khoản/hồ sơ PH, không có NV tiếp nhận, nguồn/trạng thái hiện tại không cho phép thao tác hoặc chuyển trạng thái không hợp lệ (kể cả lặp cùng trạng thái).',
  })
  @ApiResponse({
    status: 501,
    type: ErrorResponseDto,
    description: CHUA_CAI_DAT,
  })
  updateStatus(
    @Param('id', ParseIntPipe) _id: number,
    @Body() _dto: UpdateRequestStatusDto,
    @CurrentUser() _user: AuthUser,
  ): RequestDetailDto {
    throw new NotImplementedException(CHUA_CAI_DAT);
  }
}
