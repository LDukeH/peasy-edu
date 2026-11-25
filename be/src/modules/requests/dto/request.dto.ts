import { ApiProperty } from '@nestjs/swagger';
import { CapHoc } from '../../../common/enums/mon-hoc.enum.js';
import {
  HinhThucHoc,
  TrangThaiYeuCau,
} from '../../../common/enums/yeu-cau.enum.js';
import { KhungGioMongMuonDto } from './khung-gio-mong-muon.dto.js';
export class RequestDto {
  @ApiProperty({ type: 'integer', example: 1 })
  id: number;
  @ApiProperty({ example: 'YC00001' })
  ma: string;
  @ApiProperty({ type: 'integer', example: 1 })
  nguoiThanhToanId: number;
  @ApiProperty({ type: 'integer', example: 1 })
  monHocId: number;
  @ApiProperty({ type: 'integer', example: 1 })
  nhanVienPhuTrachId: number;
  @ApiProperty({ enum: CapHoc, enumName: 'CapHoc', example: CapHoc.THCS })
  capHoc: CapHoc;
  @ApiProperty({ example: '8' })
  khoiLop: string;
  @ApiProperty({ example: 'Củng cố kiến thức' })
  mucTieu: string;
  @ApiProperty({
    enum: HinhThucHoc,
    enumName: 'HinhThucHoc',
    example: HinhThucHoc.ONLINE,
  })
  hinhThuc: HinhThucHoc;
  @ApiProperty({
    enum: TrangThaiYeuCau,
    enumName: 'TrangThaiYeuCau',
    example: TrangThaiYeuCau.MOI,
  })
  trangThai: TrangThaiYeuCau;
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-11-25T03:00:00.000Z',
  })
  ngayTiepNhan: Date;
}
export class RequestDetailDto extends RequestDto {
  @ApiProperty({ type: 'array', items: { type: 'integer' }, example: [1] })
  hocVienIds: number[];
  @ApiProperty({ example: 'WEBSITE' })
  kenhTiepNhan: string;
  @ApiProperty({ type: String, nullable: true, example: null })
  diaChi: string | null;
  @ApiProperty({ type: 'integer', example: 2 })
  soBuoiMoiTuan: number;
  @ApiProperty({ type: 'integer', example: 90 })
  thoiLuongPhut: number;
  @ApiProperty({ type: [KhungGioMongMuonDto] })
  khungGioMongMuon: KhungGioMongMuonDto[];
  @ApiProperty({ type: String, nullable: true, example: null })
  hocLucHienTai: string | null;
  @ApiProperty({ type: String, nullable: true, example: null })
  tieuChiGiaSu: string | null;
  @ApiProperty({ type: String, nullable: true, example: null })
  lyDoHuy: string | null;
  @ApiProperty({ type: 'integer', nullable: true, example: 200000 })
  nganSachMoiBuoi: number | null;
  @ApiProperty({ type: String, format: 'date', nullable: true, example: null })
  ngayMuonBatDau: string | null;
}
