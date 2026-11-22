import { ApiProperty } from '@nestjs/swagger';
import {
  GioiTinh,
  HinhThucDay,
  TrangThaiGiaSu,
} from '../../../common/enums/gia-su.enum.js';
import { HoSoNangLucDto } from './ho-so-nang-luc.dto.js';
import { LichRanhDto } from './lich-ranh.dto.js';
import { MonDayDto } from './mon-day.dto.js';

/** Tài khoản nhận thù lao, số tài khoản đã che (Mục 4.2.3). */
export class TaiKhoanNganHangDto {
  @ApiProperty({ example: 'Vietcombank' })
  nganHang: string;

  @ApiProperty({
    description: 'Số tài khoản đã che, chỉ giữ 4 số cuối',
    example: '******6789',
  })
  soTaiKhoanDaChe: string;

  @ApiProperty({ example: 'VU NGOC HAN' })
  chuTaiKhoan: string;
}

/** Một dòng trong danh sách gia sư / hồ sơ ứng tuyển (NV điều phối). */
export class TutorDto {
  @ApiProperty({
    description: 'Khóa kỹ thuật (không hiển thị cho người dùng)',
    type: 'integer',
    example: 16,
  })
  id: number;

  @ApiProperty({ description: 'Mã gia sư dạng GSxxxxx', example: 'GS00016' })
  ma: string;

  @ApiProperty({ example: 'Vũ Ngọc Hân' })
  hoTen: string;

  @ApiProperty({ type: String, format: 'date', example: '2000-08-15' })
  ngaySinh: string;

  @ApiProperty({ enum: GioiTinh, enumName: 'GioiTinh', example: GioiTinh.NU })
  gioiTinh: GioiTinh;

  @ApiProperty({ example: '0903826154' })
  soDienThoai: string;

  @ApiProperty({ example: 'han.vu@example.com' })
  email: string;

  @ApiProperty({
    description: 'Đường dẫn ảnh chân dung trong Storage',
    example: 'ung-tuyen/0903826154/chan-dung.jpg',
  })
  anhChanDung: string;

  @ApiProperty({ example: 'Sinh viên' })
  trinhDo: string;

  @ApiProperty({ example: 'ĐH Sư phạm TP.HCM' })
  truongDaoTao: string;

  @ApiProperty({ example: 'Sư phạm Toán' })
  chuyenNganh: string;

  @ApiProperty({
    enum: HinhThucDay,
    enumName: 'HinhThucDay',
    example: HinhThucDay.CA_HAI,
  })
  hinhThucDay: HinhThucDay;

  @ApiProperty({ type: [String], example: ['Bình Thạnh', 'Phú Nhuận'] })
  khuVucNhanDay: string[];

  @ApiProperty({
    description: 'VND/buổi',
    type: 'integer',
    nullable: true,
    example: 200000,
  })
  thuLaoMongMuon: number | null;

  @ApiProperty({ type: [MonDayDto] })
  monDay: MonDayDto[];

  @ApiProperty({
    enum: TrangThaiGiaSu,
    enumName: 'TrangThaiGiaSu',
    example: TrangThaiGiaSu.CHO_DUYET,
  })
  trangThai: TrangThaiGiaSu;

  @ApiProperty({
    description: 'Thời điểm nộp hồ sơ (lúc ghi nhận đồng ý xử lý dữ liệu)',
    type: String,
    format: 'date-time',
    nullable: true,
    example: '2026-11-23T03:15:00.000Z',
  })
  ngayUngTuyen: Date | null;
}

/**
 * Hồ sơ đầy đủ của một gia sư: NV điều phối, Quản lý, hoặc chính gia sư đó.
 * CCCD và số tài khoản luôn được che (kế hoạch nhóm – bảo mật tối thiểu).
 */
export class TutorDetailDto extends TutorDto {
  @ApiProperty({
    description: 'CCCD đã che, giữ 3 số đầu và 3 số cuối',
    example: '079******042',
  })
  soCccdDaChe: string;

  @ApiProperty({
    description: 'Đường dẫn ảnh CCCD mặt trước trong Storage',
    example: 'ung-tuyen/0903826154/cccd-mat-truoc.jpg',
  })
  anhCccdMatTruoc: string;

  @ApiProperty({
    description: 'Đường dẫn ảnh CCCD mặt sau trong Storage',
    example: 'ung-tuyen/0903826154/cccd-mat-sau.jpg',
  })
  anhCccdMatSau: string;

  @ApiProperty({ example: 'Phường Bình Thạnh, TP.HCM' })
  diaChi: string;

  @ApiProperty({ example: '2018–2022' })
  nienKhoa: string;

  @ApiProperty({ type: String, nullable: true, example: null })
  donViCongTac: string | null;

  @ApiProperty({ type: Boolean, nullable: true, example: null })
  laGiaoVienCongLap: boolean | null;

  @ApiProperty({
    description:
      'Số lớp tối đa riêng của gia sư; null = theo tham số chung (5 lớp)',
    type: 'integer',
    nullable: true,
    example: null,
  })
  soLopToiDa: number | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example:
      'Chia nhỏ kiến thức, luyện tập từng bước để học viên hiểu bản chất.',
  })
  gioiThieu: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '2 năm dạy kèm Toán lớp 6–9',
  })
  kinhNghiem: string | null;

  @ApiProperty({
    description: 'null nếu gia sư chưa khai báo (bắt buộc trước khi nhận lớp)',
    type: TaiKhoanNganHangDto,
    nullable: true,
  })
  taiKhoanNganHang: TaiKhoanNganHangDto | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    example: null,
  })
  ngayDuyet: Date | null;

  @ApiProperty({
    description: 'Họ tên nhân viên đã duyệt hoặc từ chối',
    type: String,
    nullable: true,
    example: null,
  })
  nguoiDuyet: string | null;

  @ApiProperty({
    description: 'Lý do từ chối gần nhất; null nếu không bị từ chối',
    type: String,
    nullable: true,
    example: null,
  })
  lyDoTuChoi: string | null;

  @ApiProperty({ type: [LichRanhDto] })
  lichRanh: LichRanhDto[];

  @ApiProperty({ type: [HoSoNangLucDto] })
  hoSoNangLuc: HoSoNangLucDto[];
}
