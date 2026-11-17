BEGIN;

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- CreateEnum
CREATE TYPE "TrangThaiTaiKhoan" AS ENUM ('HOAT_DONG', 'BI_KHOA');

-- CreateEnum
CREATE TYPE "HinhThucHoc" AS ENUM ('TAI_NHA', 'ONLINE');

-- CreateEnum
CREATE TYPE "HinhThucDay" AS ENUM ('TAI_NHA', 'ONLINE', 'CA_HAI');

-- CreateEnum
CREATE TYPE "NhomMonHoc" AS ENUM ('VAN_HOA', 'NGOAI_NGU', 'NANG_KHIEU_KY_NANG', 'LUYEN_THI');

-- CreateEnum
CREATE TYPE "TrangThaiGiaSu" AS ENUM ('CHO_DUYET', 'DANG_HOAT_DONG', 'TAM_NGUNG', 'NGUNG_HOP_TAC', 'BI_TU_CHOI');

-- CreateEnum
CREATE TYPE "TrangThaiHoSoNangLuc" AS ENUM ('CHUA_XAC_MINH', 'DA_XAC_MINH', 'KHONG_HOP_LE');

-- CreateEnum
CREATE TYPE "TrangThaiYeuCau" AS ENUM ('MOI', 'DA_TU_VAN', 'DANG_TIM_GS', 'DA_DE_XUAT', 'DANG_HOC_THU', 'THANH_CONG', 'HUY');

-- CreateEnum
CREATE TYPE "PhanHoiDeXuatPhuHuynh" AS ENUM ('CHUA_PHAN_HOI', 'CHON', 'TU_CHOI');

-- CreateEnum
CREATE TYPE "PhanHoiDeXuatGiaSu" AS ENUM ('CHUA_PHAN_HOI', 'NHAN', 'TU_CHOI', 'QUA_HAN');

-- CreateEnum
CREATE TYPE "TrangThaiLopHoc" AS ENUM ('HOC_THU', 'DANG_HOC', 'TAM_DUNG', 'KET_THUC', 'HUY');

-- CreateEnum
CREATE TYPE "TrangThaiGhiDanh" AS ENUM ('DANG_HOC', 'DA_ROI');

-- CreateEnum
CREATE TYPE "LoaiPhanCong" AS ENUM ('CHINH', 'DAY_THAY');

-- CreateEnum
CREATE TYPE "LoaiBuoiHoc" AS ENUM ('HOC_THU', 'THUONG', 'HOC_BU');

-- CreateEnum
CREATE TYPE "TrangThaiBuoiHoc" AS ENUM ('CHUA_DIEN_RA', 'CHO_XAC_NHAN', 'DA_DIEN_RA', 'NGHI_CO_PHEP', 'NGHI_KHONG_PHEP', 'HUY');

-- CreateEnum
CREATE TYPE "BenNghi" AS ENUM ('HOC_VIEN', 'GIA_SU');

-- CreateEnum
CREATE TYPE "KetQuaHocThu" AS ENUM ('DAT', 'KHONG_DAT');

-- CreateEnum
CREATE TYPE "TrangThaiXacNhanBuoiHoc" AS ENUM ('CHUA_XAC_NHAN', 'DA_XAC_NHAN', 'PHAN_DOI', 'TU_DONG_XAC_NHAN');

-- CreateEnum
CREATE TYPE "TrangThaiDiemDanh" AS ENUM ('CO_MAT', 'VANG_CO_PHEP', 'VANG_KHONG_PHEP');

-- CreateEnum
CREATE TYPE "TrangThaiPhieuHocPhi" AS ENUM ('NHAP', 'DA_PHAT_HANH', 'THANH_TOAN_MOT_PHAN', 'DA_THANH_TOAN', 'QUA_HAN', 'DA_HUY');

-- CreateEnum
CREATE TYPE "PhuongThucThanhToan" AS ENUM ('TIEN_MAT', 'CHUYEN_KHOAN');

-- CreateEnum
CREATE TYPE "TrangThaiPhieuThu" AS ENUM ('HOP_LE', 'DA_HUY');

-- CreateEnum
CREATE TYPE "TrangThaiBangThuLao" AS ENUM ('NHAP', 'DA_CHOT', 'DA_CHI_TRA');

-- CreateTable
CREATE TABLE "VaiTro" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "ten" TEXT NOT NULL,
    "moTa" TEXT,

    CONSTRAINT "VaiTro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaiKhoan" (
    "id" SERIAL NOT NULL,
    "tenDangNhap" TEXT NOT NULL,
    "matKhauHash" TEXT NOT NULL,
    "vaiTroId" INTEGER NOT NULL,
    "trangThai" "TrangThaiTaiKhoan" NOT NULL DEFAULT 'HOAT_DONG',
    "lanDangNhapCuoi" TIMESTAMPTZ(3),

    -- Them ngay tao cho dong nhat
    "ngayTao" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaiKhoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NhanVien" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "hoTen" TEXT NOT NULL,
    "soDienThoai" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "trangThai" "TrangThaiTaiKhoan" NOT NULL DEFAULT 'HOAT_DONG',
    "taiKhoanId" INTEGER,

    CONSTRAINT "NhanVien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NhatKyThayDoi" (
    "id" SERIAL NOT NULL,
    "thoiDiem" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taiKhoanId" INTEGER,
    "hanhDong" TEXT NOT NULL,
    "loaiDoiTuong" TEXT NOT NULL,
    "maBanGhi" TEXT NOT NULL,
    "truong" TEXT,
    "giaTriCu" JSONB,
    "giaTriMoi" JSONB,
    "lyDo" TEXT,

    CONSTRAINT "NhatKyThayDoi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhuHuynh" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "hoTen" TEXT NOT NULL,
    "soDienThoai" TEXT NOT NULL,
    "email" TEXT,
    "zalo" TEXT,
    "diaChi" TEXT,
    "kenhTiepNhan" TEXT,
    "ghiChu" TEXT,
    "dongYXuLyDuLieu" BOOLEAN,
    "thoiDiemGhiNhanDongY" TIMESTAMPTZ(3),
    "ngayTao" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nguoiTaoId" INTEGER,
    "taiKhoanId" INTEGER,

    CONSTRAINT "PhuHuynh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HocVien" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "hoTen" TEXT NOT NULL,
    "ngaySinh" DATE NOT NULL,
    "capHoc" TEXT NOT NULL,
    "khoiLop" TEXT NOT NULL,
    "quanHeVoiNguoiDaiDien" TEXT NOT NULL,
    "phuHuynhId" INTEGER,
    "gioiTinh" TEXT,
    "truong" TEXT,
    "hocLuc" TEXT,
    "soDienThoai" TEXT,
    "email" TEXT,
    "diaChi" TEXT,
    "taiKhoanId" INTEGER,

    CONSTRAINT "HocVien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NguoiThanhToan" (
    "id" SERIAL NOT NULL,
    "phuHuynhId" INTEGER,
    "hocVienId" INTEGER,

    CONSTRAINT "NguoiThanhToan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiaSu" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "hoTen" TEXT NOT NULL,
    "ngaySinh" DATE NOT NULL,
    "gioiTinh" TEXT NOT NULL,
    "cccdMaHoa" BYTEA NOT NULL,
    "cccdHmac" BYTEA NOT NULL,
    "anhCccdMatTruoc" TEXT NOT NULL,
    "anhCccdMatSau" TEXT NOT NULL,
    "soDienThoai" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "diaChi" TEXT NOT NULL,
    "anhChanDung" TEXT NOT NULL,
    "trinhDo" TEXT NOT NULL,
    "truongDaoTao" TEXT NOT NULL,
    "chuyenNganh" TEXT NOT NULL,
    "nienKhoa" TEXT NOT NULL,
    "hinhThucDay" "HinhThucDay" NOT NULL,
    "trangThai" "TrangThaiGiaSu" NOT NULL DEFAULT 'CHO_DUYET',
    "dongYXuLyDuLieu" BOOLEAN,
    "thoiDiemGhiNhanDongY" TIMESTAMPTZ(3),
    "donViCongTac" TEXT,
    "laGiaoVienCongLap" BOOLEAN,
    "khuVucNhanDay" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "thuLaoMongMuon" INTEGER,
    "taiKhoanNganHangMaHoa" BYTEA,
    "soLopToiDa" INTEGER,
    "gioiThieu" TEXT,
    "kinhNghiem" TEXT,
    "nguoiDuyetId" INTEGER,
    "ngayDuyet" TIMESTAMPTZ(3),
    "taiKhoanId" INTEGER,

    CONSTRAINT "GiaSu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoSoNangLuc" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "giaSuId" INTEGER NOT NULL,
    "loai" TEXT NOT NULL,
    "ten" TEXT NOT NULL,
    "noiCap" TEXT NOT NULL,
    "ngayCap" DATE NOT NULL,
    "tep" TEXT NOT NULL,
    "ngayHetHan" DATE,
    "trangThai" "TrangThaiHoSoNangLuc" NOT NULL DEFAULT 'CHUA_XAC_MINH',
    "nguoiXacMinhId" INTEGER,

    CONSTRAINT "HoSoNangLuc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonHoc" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "ten" TEXT NOT NULL,
    "nhom" "NhomMonHoc" NOT NULL,
    "capHocApDung" TEXT[],
    "moTa" TEXT,
    "dangSuDung" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MonHoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonDay" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "giaSuId" INTEGER NOT NULL,
    "monHocId" INTEGER NOT NULL,
    "capLop" TEXT[],

    CONSTRAINT "MonDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LichRanh" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "giaSuId" INTEGER NOT NULL,
    "thu" INTEGER NOT NULL,
    "gioBatDau" TIME(0) NOT NULL,
    "gioKetThuc" TIME(0) NOT NULL,

    CONSTRAINT "LichRanh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThamSoNghiepVu" (
    "ma" TEXT NOT NULL,
    "giaTri" JSONB NOT NULL,
    "donVi" TEXT NOT NULL,
    "moTa" TEXT NOT NULL,
    "capNhatLuc" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThamSoNghiepVu_pkey" PRIMARY KEY ("ma")
);

-- CreateTable
CREATE TABLE "YeuCau" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "nguoiThanhToanId" INTEGER NOT NULL,
    "monHocId" INTEGER NOT NULL,
    "nhanVienPhuTrachId" INTEGER NOT NULL,
    "ngayTiepNhan" TIMESTAMPTZ(3) NOT NULL,
    "kenhTiepNhan" TEXT NOT NULL,
    "capHoc" TEXT NOT NULL,
    "khoiLop" TEXT NOT NULL,
    "mucTieu" TEXT NOT NULL,
    "hinhThuc" "HinhThucHoc" NOT NULL,
    "diaChi" TEXT,
    "soBuoiMoiTuan" INTEGER NOT NULL,
    "thoiLuongPhut" INTEGER NOT NULL,
    "khungGioMongMuon" JSONB NOT NULL,
    "hocLucHienTai" TEXT,
    "tieuChiGiaSu" TEXT,
    "nganSachMoiBuoi" INTEGER,
    "ngayMuonBatDau" DATE,
    "trangThai" "TrangThaiYeuCau" NOT NULL DEFAULT 'MOI',
    "lyDoHuy" TEXT,

    CONSTRAINT "YeuCau_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YeuCauHocVien" (
    "yeuCauId" INTEGER NOT NULL,
    "hocVienId" INTEGER NOT NULL,

    CONSTRAINT "YeuCauHocVien_pkey" PRIMARY KEY ("yeuCauId","hocVienId")
);

-- CreateTable
CREATE TABLE "DeXuatGiaSu" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "yeuCauId" INTEGER NOT NULL,
    "giaSuId" INTEGER NOT NULL,
    "dot" INTEGER NOT NULL,
    "thuTu" INTEGER NOT NULL,
    "diemPhuHop" DECIMAL(5,2) NOT NULL,
    "thoiDiemGui" TIMESTAMPTZ(3) NOT NULL,
    "hanPhanHoi" TIMESTAMPTZ(3) NOT NULL,
    "phanHoiPhuHuynh" "PhanHoiDeXuatPhuHuynh" NOT NULL DEFAULT 'CHUA_PHAN_HOI',
    "phanHoiGiaSu" "PhanHoiDeXuatGiaSu" NOT NULL DEFAULT 'CHUA_PHAN_HOI',
    "lyDoPhuHuynh" TEXT,
    "lyDoGiaSu" TEXT,

    CONSTRAINT "DeXuatGiaSu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LopHoc" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "yeuCauId" INTEGER NOT NULL,
    "monHocId" INTEGER NOT NULL,
    "nhanVienPhuTrachId" INTEGER NOT NULL,
    "capHoc" TEXT NOT NULL,
    "khoiLop" TEXT NOT NULL,
    "hinhThuc" "HinhThucHoc" NOT NULL,
    "diaDiem" TEXT,
    "urlHocOnline" TEXT,
    "soBuoiMoiTuan" INTEGER NOT NULL,
    "thoiLuongPhut" INTEGER NOT NULL,
    "ngayBatDau" DATE NOT NULL,
    "trangThai" "TrangThaiLopHoc" NOT NULL DEFAULT 'HOC_THU',
    "mucTieu" TEXT,
    "soBuoiDuKien" INTEGER,
    "ngayKetThucDuKien" DATE,
    "lyDoTamDungHoacHuy" TEXT,

    CONSTRAINT "LopHoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GhiDanh" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "lopHocId" INTEGER NOT NULL,
    "hocVienId" INTEGER NOT NULL,
    "nguoiThanhToanId" INTEGER NOT NULL,
    "hieuLucTuNgay" DATE NOT NULL,
    "hieuLucDenNgay" DATE,
    "trangThai" "TrangThaiGhiDanh" NOT NULL DEFAULT 'DANG_HOC',

    CONSTRAINT "GhiDanh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiaGhiDanh" (
    "id" SERIAL NOT NULL,
    "ghiDanhId" INTEGER NOT NULL,
    "hieuLucTuNgay" DATE NOT NULL,
    "hocPhiMoiBuoi" INTEGER NOT NULL,

    CONSTRAINT "GiaGhiDanh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhanCong" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "lopHocId" INTEGER NOT NULL,
    "giaSuId" INTEGER NOT NULL,
    "loai" "LoaiPhanCong" NOT NULL,
    "hieuLucTuNgay" DATE NOT NULL,
    "hieuLucDenNgay" DATE,
    "thuLaoMoiBuoi" INTEGER NOT NULL,
    "lyDoKetThuc" TEXT,

    CONSTRAINT "PhanCong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LichHocCoDinh" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "lopHocId" INTEGER NOT NULL,
    "thu" INTEGER NOT NULL,
    "gioBatDau" TIME(0) NOT NULL,
    "gioKetThuc" TIME(0) NOT NULL,
    "hieuLucTuNgay" DATE NOT NULL,
    "hieuLucDenNgay" DATE,

    CONSTRAINT "LichHocCoDinh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuoiHoc" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "lopHocId" INTEGER NOT NULL,
    "giaSuThucDayId" INTEGER NOT NULL,
    "phanCongThucDayId" INTEGER,
    "thoiGianBatDau" TIMESTAMPTZ(3) NOT NULL,
    "thoiGianKetThuc" TIMESTAMPTZ(3) NOT NULL,
    "loai" "LoaiBuoiHoc" NOT NULL,
    "trangThai" "TrangThaiBuoiHoc" NOT NULL DEFAULT 'CHUA_DIEN_RA',
    "buoiGocId" INTEGER,
    "lichHocCoDinhId" INTEGER,
    "thoiGianBatDauGoc" TIMESTAMPTZ(3),
    "benNghi" "BenNghi",
    "lyDoNghi" TEXT,
    "thoiDiemBaoNghi" TIMESTAMPTZ(3),
    "noiDungDaDay" TEXT,
    "baiTap" TEXT,
    "nhanXet" TEXT,
    "ketQuaHocThu" "KetQuaHocThu",
    "thuLaoSnapshot" INTEGER,
    "kyThuLao" VARCHAR(7),

    CONSTRAINT "BuoiHoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XacNhanBuoiHoc" (
    "id" SERIAL NOT NULL,
    "buoiHocId" INTEGER NOT NULL,
    "nguoiThanhToanId" INTEGER NOT NULL,
    "trangThai" "TrangThaiXacNhanBuoiHoc" NOT NULL DEFAULT 'CHUA_XAC_NHAN',
    "thoiDiemPhanHoi" TIMESTAMPTZ(3),
    "noiDungPhanDoi" TEXT,
    "nhanVienXuLyId" INTEGER,
    "thoiDiemXuLy" TIMESTAMPTZ(3),
    "lyDoXuLy" TEXT,

    CONSTRAINT "XacNhanBuoiHoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiemDanh" (
    "id" SERIAL NOT NULL,
    "buoiHocId" INTEGER NOT NULL,
    "lopHocId" INTEGER NOT NULL,
    "ghiDanhId" INTEGER NOT NULL,
    "hocVienId" INTEGER NOT NULL,
    "nguoiThanhToanId" INTEGER NOT NULL,
    "trangThai" "TrangThaiDiemDanh" NOT NULL,
    "ghiChu" TEXT,
    "donGiaSnapshot" INTEGER,
    "heSoTinhPhi" INTEGER,

    CONSTRAINT "DiemDanh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhieuHocPhi" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "nguoiThanhToanId" INTEGER NOT NULL,
    "kyThang" VARCHAR(7) NOT NULL,
    "nguoiLapId" INTEGER NOT NULL,
    "ngayLap" TIMESTAMPTZ(3) NOT NULL,
    "hanThanhToan" DATE NOT NULL,
    "tongTien" INTEGER NOT NULL,
    "daThanhToan" INTEGER NOT NULL DEFAULT 0,
    "conNo" INTEGER NOT NULL,
    "trangThai" "TrangThaiPhieuHocPhi" NOT NULL DEFAULT 'NHAP',
    "dieuChinh" INTEGER,
    "lyDoDieuChinh" TEXT,
    "thoiDiemPhatHanh" TIMESTAMPTZ(3),
    "thoiDiemHuy" TIMESTAMPTZ(3),
    "lyDoHuy" TEXT,

    CONSTRAINT "PhieuHocPhi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChiTietPhieuHocPhi" (
    "id" SERIAL NOT NULL,
    "phieuHocPhiId" INTEGER NOT NULL,
    "diemDanhId" INTEGER NOT NULL,
    "donGiaSnapshot" INTEGER NOT NULL,
    "heSoTinhPhi" INTEGER NOT NULL,
    "thanhTien" INTEGER NOT NULL,

    CONSTRAINT "ChiTietPhieuHocPhi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhieuThu" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "phieuHocPhiId" INTEGER NOT NULL,
    "nguoiGhiNhanId" INTEGER NOT NULL,
    "soTien" INTEGER NOT NULL,
    "ngayThanhToan" TIMESTAMPTZ(3) NOT NULL,
    "phuongThuc" "PhuongThucThanhToan" NOT NULL,
    "trangThai" "TrangThaiPhieuThu" NOT NULL DEFAULT 'HOP_LE',
    "maGiaoDich" TEXT,
    "lyDoHuy" TEXT,

    CONSTRAINT "PhieuThu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BangThuLao" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "giaSuId" INTEGER NOT NULL,
    "kyThang" VARCHAR(7) NOT NULL,
    "soBuoiDaDay" INTEGER NOT NULL,
    "soBuoiHvNghiKhongPhep" INTEGER NOT NULL,
    "tongThuLao" INTEGER NOT NULL,
    "dieuChinh" INTEGER,
    "lyDoDieuChinh" TEXT,
    "khauTru" INTEGER,
    "thucNhan" INTEGER NOT NULL,
    "trangThai" "TrangThaiBangThuLao" NOT NULL DEFAULT 'NHAP',
    "nguoiChiId" INTEGER,
    "ngayChi" TIMESTAMPTZ(3),
    "maGiaoDich" TEXT,

    CONSTRAINT "BangThuLao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChiTietBangThuLao" (
    "id" SERIAL NOT NULL,
    "bangThuLaoId" INTEGER NOT NULL,
    "buoiHocId" INTEGER NOT NULL,
    "thuLaoSnapshot" INTEGER NOT NULL,
    "heSoThuLao" INTEGER NOT NULL,
    "thanhTien" INTEGER NOT NULL,

    CONSTRAINT "ChiTietBangThuLao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VaiTro_ma_key" ON "VaiTro"("ma");

-- CreateIndex
CREATE UNIQUE INDEX "TaiKhoan_tenDangNhap_key" ON "TaiKhoan"("tenDangNhap");

-- CreateIndex
CREATE INDEX "TaiKhoan_vaiTroId_idx" ON "TaiKhoan"("vaiTroId");

-- CreateIndex
CREATE UNIQUE INDEX "NhanVien_ma_key" ON "NhanVien"("ma");
CREATE UNIQUE INDEX "NhanVien_email_key" ON "NhanVien"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NhanVien_taiKhoanId_key" ON "NhanVien"("taiKhoanId");

-- CreateIndex
CREATE INDEX "NhatKyThayDoi_loaiDoiTuong_maBanGhi_thoiDiem_idx" ON "NhatKyThayDoi"("loaiDoiTuong", "maBanGhi", "thoiDiem");

-- CreateIndex
CREATE INDEX "NhatKyThayDoi_taiKhoanId_idx" ON "NhatKyThayDoi"("taiKhoanId");

-- CreateIndex
CREATE UNIQUE INDEX "PhuHuynh_ma_key" ON "PhuHuynh"("ma");

-- CreateIndex
CREATE UNIQUE INDEX "PhuHuynh_soDienThoai_key" ON "PhuHuynh"("soDienThoai");

-- CreateIndex
CREATE UNIQUE INDEX "PhuHuynh_taiKhoanId_key" ON "PhuHuynh"("taiKhoanId");

-- CreateIndex
CREATE INDEX "PhuHuynh_nguoiTaoId_idx" ON "PhuHuynh"("nguoiTaoId");

-- CreateIndex
CREATE UNIQUE INDEX "HocVien_ma_key" ON "HocVien"("ma");

-- CreateIndex
CREATE UNIQUE INDEX "HocVien_taiKhoanId_key" ON "HocVien"("taiKhoanId");

-- CreateIndex
CREATE INDEX "HocVien_phuHuynhId_idx" ON "HocVien"("phuHuynhId");

-- CreateIndex
CREATE UNIQUE INDEX "NguoiThanhToan_phuHuynhId_key" ON "NguoiThanhToan"("phuHuynhId");

-- CreateIndex
CREATE UNIQUE INDEX "NguoiThanhToan_hocVienId_key" ON "NguoiThanhToan"("hocVienId");

-- CreateIndex
CREATE UNIQUE INDEX "GiaSu_ma_key" ON "GiaSu"("ma");

-- CreateIndex
CREATE UNIQUE INDEX "GiaSu_cccdHmac_key" ON "GiaSu"("cccdHmac");

-- CreateIndex
CREATE UNIQUE INDEX "GiaSu_soDienThoai_key" ON "GiaSu"("soDienThoai");

-- CreateIndex
CREATE UNIQUE INDEX "GiaSu_email_key" ON "GiaSu"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GiaSu_taiKhoanId_key" ON "GiaSu"("taiKhoanId");

-- CreateIndex
CREATE INDEX "GiaSu_nguoiDuyetId_idx" ON "GiaSu"("nguoiDuyetId");

-- CreateIndex
CREATE UNIQUE INDEX "HoSoNangLuc_ma_key" ON "HoSoNangLuc"("ma");

-- CreateIndex
CREATE INDEX "HoSoNangLuc_giaSuId_trangThai_idx" ON "HoSoNangLuc"("giaSuId", "trangThai");

-- CreateIndex
CREATE INDEX "HoSoNangLuc_nguoiXacMinhId_idx" ON "HoSoNangLuc"("nguoiXacMinhId");

-- CreateIndex
CREATE UNIQUE INDEX "MonHoc_ma_key" ON "MonHoc"("ma");
CREATE UNIQUE INDEX "MonHoc_ten_key" ON "MonHoc"("ten");

-- CreateIndex
CREATE UNIQUE INDEX "MonDay_ma_key" ON "MonDay"("ma");

-- CreateIndex
CREATE INDEX "MonDay_monHocId_idx" ON "MonDay"("monHocId");

-- CreateIndex
CREATE UNIQUE INDEX "MonDay_giaSuId_monHocId_key" ON "MonDay"("giaSuId", "monHocId");

-- CreateIndex
CREATE UNIQUE INDEX "LichRanh_ma_key" ON "LichRanh"("ma");

-- CreateIndex
CREATE UNIQUE INDEX "LichRanh_giaSuId_thu_gioBatDau_gioKetThuc_key" ON "LichRanh"("giaSuId", "thu", "gioBatDau", "gioKetThuc");

-- CreateIndex
CREATE UNIQUE INDEX "YeuCau_ma_key" ON "YeuCau"("ma");

-- CreateIndex
CREATE INDEX "YeuCau_nguoiThanhToanId_idx" ON "YeuCau"("nguoiThanhToanId");

-- CreateIndex
CREATE INDEX "YeuCau_monHocId_idx" ON "YeuCau"("monHocId");

-- CreateIndex
CREATE INDEX "YeuCau_nhanVienPhuTrachId_trangThai_idx" ON "YeuCau"("nhanVienPhuTrachId", "trangThai");

-- CreateIndex
CREATE INDEX "YeuCauHocVien_hocVienId_idx" ON "YeuCauHocVien"("hocVienId");

-- CreateIndex
CREATE UNIQUE INDEX "DeXuatGiaSu_ma_key" ON "DeXuatGiaSu"("ma");

-- CreateIndex
CREATE INDEX "DeXuatGiaSu_giaSuId_idx" ON "DeXuatGiaSu"("giaSuId");

-- CreateIndex
CREATE UNIQUE INDEX "DeXuatGiaSu_yeuCauId_dot_giaSuId_key" ON "DeXuatGiaSu"("yeuCauId", "dot", "giaSuId");

-- CreateIndex
CREATE UNIQUE INDEX "DeXuatGiaSu_yeuCauId_dot_thuTu_key" ON "DeXuatGiaSu"("yeuCauId", "dot", "thuTu");

-- CreateIndex
CREATE UNIQUE INDEX "LopHoc_ma_key" ON "LopHoc"("ma");

-- CreateIndex
CREATE INDEX "LopHoc_yeuCauId_trangThai_idx" ON "LopHoc"("yeuCauId", "trangThai");

-- CreateIndex
CREATE INDEX "LopHoc_monHocId_idx" ON "LopHoc"("monHocId");

-- CreateIndex
CREATE INDEX "LopHoc_nhanVienPhuTrachId_idx" ON "LopHoc"("nhanVienPhuTrachId");

-- CreateIndex
CREATE UNIQUE INDEX "GhiDanh_ma_key" ON "GhiDanh"("ma");

-- CreateIndex
CREATE INDEX "GhiDanh_lopHocId_hocVienId_hieuLucTuNgay_idx" ON "GhiDanh"("lopHocId", "hocVienId", "hieuLucTuNgay");

-- CreateIndex
CREATE INDEX "GhiDanh_hocVienId_idx" ON "GhiDanh"("hocVienId");

-- CreateIndex
CREATE INDEX "GhiDanh_nguoiThanhToanId_idx" ON "GhiDanh"("nguoiThanhToanId");

-- CreateIndex
CREATE UNIQUE INDEX "ghidanh_danh_tinh_key" ON "GhiDanh"("id", "lopHocId", "hocVienId", "nguoiThanhToanId");

-- CreateIndex
CREATE UNIQUE INDEX "GiaGhiDanh_ghiDanhId_hieuLucTuNgay_key" ON "GiaGhiDanh"("ghiDanhId", "hieuLucTuNgay");

-- CreateIndex
CREATE UNIQUE INDEX "PhanCong_ma_key" ON "PhanCong"("ma");

-- CreateIndex
CREATE INDEX "PhanCong_lopHocId_hieuLucTuNgay_idx" ON "PhanCong"("lopHocId", "hieuLucTuNgay");

-- CreateIndex
CREATE INDEX "PhanCong_giaSuId_idx" ON "PhanCong"("giaSuId");

-- CreateIndex
CREATE UNIQUE INDEX "PhanCong_id_lopHocId_giaSuId_key" ON "PhanCong"("id", "lopHocId", "giaSuId");

-- CreateIndex
CREATE UNIQUE INDEX "LichHocCoDinh_ma_key" ON "LichHocCoDinh"("ma");

-- CreateIndex
CREATE INDEX "LichHocCoDinh_lopHocId_thu_hieuLucTuNgay_idx" ON "LichHocCoDinh"("lopHocId", "thu", "hieuLucTuNgay");

-- CreateIndex
CREATE UNIQUE INDEX "LichHocCoDinh_id_lopHocId_key" ON "LichHocCoDinh"("id", "lopHocId");

-- CreateIndex
CREATE UNIQUE INDEX "BuoiHoc_ma_key" ON "BuoiHoc"("ma");

-- CreateIndex
CREATE INDEX "BuoiHoc_giaSuThucDayId_thoiGianBatDau_idx" ON "BuoiHoc"("giaSuThucDayId", "thoiGianBatDau");

-- CreateIndex
CREATE INDEX "BuoiHoc_phanCongThucDayId_idx" ON "BuoiHoc"("phanCongThucDayId");

-- CreateIndex
CREATE INDEX "BuoiHoc_buoiGocId_idx" ON "BuoiHoc"("buoiGocId");

-- CreateIndex
CREATE INDEX "BuoiHoc_kyThuLao_idx" ON "BuoiHoc"("kyThuLao");

-- CreateIndex
CREATE UNIQUE INDEX "BuoiHoc_id_lopHocId_key" ON "BuoiHoc"("id", "lopHocId");

-- CreateIndex
CREATE UNIQUE INDEX "BuoiHoc_lopHocId_thoiGianBatDau_key" ON "BuoiHoc"("lopHocId", "thoiGianBatDau");

-- CreateIndex
CREATE UNIQUE INDEX "BuoiHoc_lichHocCoDinhId_thoiGianBatDauGoc_key" ON "BuoiHoc"("lichHocCoDinhId", "thoiGianBatDauGoc");

-- CreateIndex
CREATE INDEX "XacNhanBuoiHoc_nguoiThanhToanId_idx" ON "XacNhanBuoiHoc"("nguoiThanhToanId");

-- CreateIndex
CREATE INDEX "XacNhanBuoiHoc_nhanVienXuLyId_idx" ON "XacNhanBuoiHoc"("nhanVienXuLyId");

-- CreateIndex
CREATE UNIQUE INDEX "XacNhanBuoiHoc_buoiHocId_nguoiThanhToanId_key" ON "XacNhanBuoiHoc"("buoiHocId", "nguoiThanhToanId");

-- CreateIndex
CREATE INDEX "DiemDanh_hocVienId_idx" ON "DiemDanh"("hocVienId");

-- CreateIndex
CREATE INDEX "DiemDanh_ghiDanhId_idx" ON "DiemDanh"("ghiDanhId");

-- CreateIndex
CREATE INDEX "DiemDanh_buoiHocId_nguoiThanhToanId_idx" ON "DiemDanh"("buoiHocId", "nguoiThanhToanId");

-- CreateIndex
CREATE UNIQUE INDEX "DiemDanh_buoiHocId_hocVienId_key" ON "DiemDanh"("buoiHocId", "hocVienId");

-- CreateIndex
CREATE UNIQUE INDEX "PhieuHocPhi_ma_key" ON "PhieuHocPhi"("ma");

-- CreateIndex
CREATE INDEX "PhieuHocPhi_kyThang_trangThai_idx" ON "PhieuHocPhi"("kyThang", "trangThai");

-- CreateIndex
CREATE INDEX "PhieuHocPhi_nguoiLapId_idx" ON "PhieuHocPhi"("nguoiLapId");

-- CreateIndex
CREATE UNIQUE INDEX "PhieuHocPhi_nguoiThanhToanId_kyThang_key" ON "PhieuHocPhi"("nguoiThanhToanId", "kyThang");

-- CreateIndex
CREATE UNIQUE INDEX "ChiTietPhieuHocPhi_diemDanhId_key" ON "ChiTietPhieuHocPhi"("diemDanhId");

-- CreateIndex
CREATE INDEX "ChiTietPhieuHocPhi_phieuHocPhiId_idx" ON "ChiTietPhieuHocPhi"("phieuHocPhiId");

-- CreateIndex
CREATE UNIQUE INDEX "PhieuThu_ma_key" ON "PhieuThu"("ma");

-- CreateIndex
CREATE INDEX "PhieuThu_phieuHocPhiId_idx" ON "PhieuThu"("phieuHocPhiId");

-- CreateIndex
CREATE INDEX "PhieuThu_nguoiGhiNhanId_idx" ON "PhieuThu"("nguoiGhiNhanId");

-- CreateIndex
CREATE INDEX "PhieuThu_maGiaoDich_idx" ON "PhieuThu"("maGiaoDich");

-- CreateIndex
CREATE UNIQUE INDEX "BangThuLao_ma_key" ON "BangThuLao"("ma");

-- CreateIndex
CREATE INDEX "BangThuLao_kyThang_trangThai_idx" ON "BangThuLao"("kyThang", "trangThai");

-- CreateIndex
CREATE INDEX "BangThuLao_nguoiChiId_idx" ON "BangThuLao"("nguoiChiId");

-- CreateIndex
CREATE UNIQUE INDEX "BangThuLao_giaSuId_kyThang_key" ON "BangThuLao"("giaSuId", "kyThang");

-- CreateIndex
CREATE UNIQUE INDEX "ChiTietBangThuLao_buoiHocId_key" ON "ChiTietBangThuLao"("buoiHocId");

-- CreateIndex
CREATE INDEX "ChiTietBangThuLao_bangThuLaoId_idx" ON "ChiTietBangThuLao"("bangThuLaoId");

-- AddForeignKey
ALTER TABLE "TaiKhoan" ADD CONSTRAINT "TaiKhoan_vaiTroId_fkey" FOREIGN KEY ("vaiTroId") REFERENCES "VaiTro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NhanVien" ADD CONSTRAINT "NhanVien_taiKhoanId_fkey" FOREIGN KEY ("taiKhoanId") REFERENCES "TaiKhoan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NhatKyThayDoi" ADD CONSTRAINT "NhatKyThayDoi_taiKhoanId_fkey" FOREIGN KEY ("taiKhoanId") REFERENCES "TaiKhoan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhuHuynh" ADD CONSTRAINT "PhuHuynh_nguoiTaoId_fkey" FOREIGN KEY ("nguoiTaoId") REFERENCES "NhanVien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhuHuynh" ADD CONSTRAINT "PhuHuynh_taiKhoanId_fkey" FOREIGN KEY ("taiKhoanId") REFERENCES "TaiKhoan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HocVien" ADD CONSTRAINT "HocVien_phuHuynhId_fkey" FOREIGN KEY ("phuHuynhId") REFERENCES "PhuHuynh"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HocVien" ADD CONSTRAINT "HocVien_taiKhoanId_fkey" FOREIGN KEY ("taiKhoanId") REFERENCES "TaiKhoan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NguoiThanhToan" ADD CONSTRAINT "NguoiThanhToan_phuHuynhId_fkey" FOREIGN KEY ("phuHuynhId") REFERENCES "PhuHuynh"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NguoiThanhToan" ADD CONSTRAINT "NguoiThanhToan_hocVienId_fkey" FOREIGN KEY ("hocVienId") REFERENCES "HocVien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiaSu" ADD CONSTRAINT "GiaSu_nguoiDuyetId_fkey" FOREIGN KEY ("nguoiDuyetId") REFERENCES "NhanVien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiaSu" ADD CONSTRAINT "GiaSu_taiKhoanId_fkey" FOREIGN KEY ("taiKhoanId") REFERENCES "TaiKhoan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoSoNangLuc" ADD CONSTRAINT "HoSoNangLuc_giaSuId_fkey" FOREIGN KEY ("giaSuId") REFERENCES "GiaSu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoSoNangLuc" ADD CONSTRAINT "HoSoNangLuc_nguoiXacMinhId_fkey" FOREIGN KEY ("nguoiXacMinhId") REFERENCES "NhanVien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonDay" ADD CONSTRAINT "MonDay_giaSuId_fkey" FOREIGN KEY ("giaSuId") REFERENCES "GiaSu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonDay" ADD CONSTRAINT "MonDay_monHocId_fkey" FOREIGN KEY ("monHocId") REFERENCES "MonHoc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LichRanh" ADD CONSTRAINT "LichRanh_giaSuId_fkey" FOREIGN KEY ("giaSuId") REFERENCES "GiaSu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YeuCau" ADD CONSTRAINT "YeuCau_nguoiThanhToanId_fkey" FOREIGN KEY ("nguoiThanhToanId") REFERENCES "NguoiThanhToan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YeuCau" ADD CONSTRAINT "YeuCau_monHocId_fkey" FOREIGN KEY ("monHocId") REFERENCES "MonHoc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YeuCau" ADD CONSTRAINT "YeuCau_nhanVienPhuTrachId_fkey" FOREIGN KEY ("nhanVienPhuTrachId") REFERENCES "NhanVien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YeuCauHocVien" ADD CONSTRAINT "YeuCauHocVien_yeuCauId_fkey" FOREIGN KEY ("yeuCauId") REFERENCES "YeuCau"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YeuCauHocVien" ADD CONSTRAINT "YeuCauHocVien_hocVienId_fkey" FOREIGN KEY ("hocVienId") REFERENCES "HocVien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeXuatGiaSu" ADD CONSTRAINT "DeXuatGiaSu_yeuCauId_fkey" FOREIGN KEY ("yeuCauId") REFERENCES "YeuCau"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeXuatGiaSu" ADD CONSTRAINT "DeXuatGiaSu_giaSuId_fkey" FOREIGN KEY ("giaSuId") REFERENCES "GiaSu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LopHoc" ADD CONSTRAINT "LopHoc_yeuCauId_fkey" FOREIGN KEY ("yeuCauId") REFERENCES "YeuCau"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LopHoc" ADD CONSTRAINT "LopHoc_monHocId_fkey" FOREIGN KEY ("monHocId") REFERENCES "MonHoc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LopHoc" ADD CONSTRAINT "LopHoc_nhanVienPhuTrachId_fkey" FOREIGN KEY ("nhanVienPhuTrachId") REFERENCES "NhanVien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GhiDanh" ADD CONSTRAINT "GhiDanh_lopHocId_fkey" FOREIGN KEY ("lopHocId") REFERENCES "LopHoc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GhiDanh" ADD CONSTRAINT "GhiDanh_hocVienId_fkey" FOREIGN KEY ("hocVienId") REFERENCES "HocVien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GhiDanh" ADD CONSTRAINT "GhiDanh_nguoiThanhToanId_fkey" FOREIGN KEY ("nguoiThanhToanId") REFERENCES "NguoiThanhToan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiaGhiDanh" ADD CONSTRAINT "GiaGhiDanh_ghiDanhId_fkey" FOREIGN KEY ("ghiDanhId") REFERENCES "GhiDanh"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhanCong" ADD CONSTRAINT "PhanCong_lopHocId_fkey" FOREIGN KEY ("lopHocId") REFERENCES "LopHoc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhanCong" ADD CONSTRAINT "PhanCong_giaSuId_fkey" FOREIGN KEY ("giaSuId") REFERENCES "GiaSu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LichHocCoDinh" ADD CONSTRAINT "LichHocCoDinh_lopHocId_fkey" FOREIGN KEY ("lopHocId") REFERENCES "LopHoc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuoiHoc" ADD CONSTRAINT "BuoiHoc_lopHocId_fkey" FOREIGN KEY ("lopHocId") REFERENCES "LopHoc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuoiHoc" ADD CONSTRAINT "BuoiHoc_giaSuThucDayId_fkey" FOREIGN KEY ("giaSuThucDayId") REFERENCES "GiaSu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuoiHoc" ADD CONSTRAINT "BuoiHoc_phanCongThucDayId_lopHocId_giaSuThucDayId_fkey" FOREIGN KEY ("phanCongThucDayId", "lopHocId", "giaSuThucDayId") REFERENCES "PhanCong"("id", "lopHocId", "giaSuId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuoiHoc" ADD CONSTRAINT "BuoiHoc_buoiGocId_lopHocId_fkey" FOREIGN KEY ("buoiGocId", "lopHocId") REFERENCES "BuoiHoc"("id", "lopHocId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuoiHoc" ADD CONSTRAINT "BuoiHoc_lichHocCoDinhId_lopHocId_fkey" FOREIGN KEY ("lichHocCoDinhId", "lopHocId") REFERENCES "LichHocCoDinh"("id", "lopHocId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XacNhanBuoiHoc" ADD CONSTRAINT "XacNhanBuoiHoc_buoiHocId_fkey" FOREIGN KEY ("buoiHocId") REFERENCES "BuoiHoc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XacNhanBuoiHoc" ADD CONSTRAINT "XacNhanBuoiHoc_nguoiThanhToanId_fkey" FOREIGN KEY ("nguoiThanhToanId") REFERENCES "NguoiThanhToan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XacNhanBuoiHoc" ADD CONSTRAINT "XacNhanBuoiHoc_nhanVienXuLyId_fkey" FOREIGN KEY ("nhanVienXuLyId") REFERENCES "NhanVien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiemDanh" ADD CONSTRAINT "diemdanh_buoi_lop_fkey" FOREIGN KEY ("buoiHocId", "lopHocId") REFERENCES "BuoiHoc"("id", "lopHocId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiemDanh" ADD CONSTRAINT "diemdanh_ghidanh_fkey" FOREIGN KEY ("ghiDanhId", "lopHocId", "hocVienId", "nguoiThanhToanId") REFERENCES "GhiDanh"("id", "lopHocId", "hocVienId", "nguoiThanhToanId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiemDanh" ADD CONSTRAINT "diemdanh_xac_nhan_fkey" FOREIGN KEY ("buoiHocId", "nguoiThanhToanId") REFERENCES "XacNhanBuoiHoc"("buoiHocId", "nguoiThanhToanId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhieuHocPhi" ADD CONSTRAINT "PhieuHocPhi_nguoiThanhToanId_fkey" FOREIGN KEY ("nguoiThanhToanId") REFERENCES "NguoiThanhToan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhieuHocPhi" ADD CONSTRAINT "PhieuHocPhi_nguoiLapId_fkey" FOREIGN KEY ("nguoiLapId") REFERENCES "NhanVien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiTietPhieuHocPhi" ADD CONSTRAINT "ChiTietPhieuHocPhi_phieuHocPhiId_fkey" FOREIGN KEY ("phieuHocPhiId") REFERENCES "PhieuHocPhi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiTietPhieuHocPhi" ADD CONSTRAINT "ChiTietPhieuHocPhi_diemDanhId_fkey" FOREIGN KEY ("diemDanhId") REFERENCES "DiemDanh"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhieuThu" ADD CONSTRAINT "PhieuThu_phieuHocPhiId_fkey" FOREIGN KEY ("phieuHocPhiId") REFERENCES "PhieuHocPhi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhieuThu" ADD CONSTRAINT "PhieuThu_nguoiGhiNhanId_fkey" FOREIGN KEY ("nguoiGhiNhanId") REFERENCES "NhanVien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BangThuLao" ADD CONSTRAINT "BangThuLao_giaSuId_fkey" FOREIGN KEY ("giaSuId") REFERENCES "GiaSu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BangThuLao" ADD CONSTRAINT "BangThuLao_nguoiChiId_fkey" FOREIGN KEY ("nguoiChiId") REFERENCES "NhanVien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiTietBangThuLao" ADD CONSTRAINT "ChiTietBangThuLao_bangThuLaoId_fkey" FOREIGN KEY ("bangThuLaoId") REFERENCES "BangThuLao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiTietBangThuLao" ADD CONSTRAINT "ChiTietBangThuLao_buoiHocId_fkey" FOREIGN KEY ("buoiHocId") REFERENCES "BuoiHoc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- SQL constraints outside the Prisma schema

ALTER TABLE "BuoiHoc"
  ADD CONSTRAINT "buoihoc_thoi_gian_hop_le"
  CHECK (
    isfinite("thoiGianBatDau")
    AND isfinite("thoiGianKetThuc")
    AND "thoiGianKetThuc" > "thoiGianBatDau"
  );

ALTER TABLE "BuoiHoc"
  ADD CONSTRAINT "buoihoc_giasu_no_overlap"
  EXCLUDE USING gist (
    "giaSuThucDayId" WITH =,
    tstzrange("thoiGianBatDau", "thoiGianKetThuc", '[)') WITH &&
  )
  WHERE ("trangThai" NOT IN ('HUY', 'NGHI_CO_PHEP', 'NGHI_KHONG_PHEP'));

ALTER TABLE "GhiDanh"
  ADD CONSTRAINT "ghidanh_hieu_luc_hop_le"
  CHECK (
    isfinite("hieuLucTuNgay")
    AND (
      "hieuLucDenNgay" IS NULL
      OR (isfinite("hieuLucDenNgay") AND "hieuLucDenNgay" > "hieuLucTuNgay")
    )
  ),
  ADD CONSTRAINT "ghidanh_hocvien_lop_no_overlap"
  EXCLUDE USING gist (
    "lopHocId" WITH =,
    "hocVienId" WITH =,
    daterange("hieuLucTuNgay", "hieuLucDenNgay", '[)') WITH &&
  );

ALTER TABLE "PhanCong"
  ADD CONSTRAINT "phancong_hieu_luc_hop_le"
  CHECK (
    isfinite("hieuLucTuNgay")
    AND (
      "hieuLucDenNgay" IS NULL
      OR (isfinite("hieuLucDenNgay") AND "hieuLucDenNgay" > "hieuLucTuNgay")
    )
  ),
  ADD CONSTRAINT "phancong_chinh_lop_no_overlap"
  EXCLUDE USING gist (
    "lopHocId" WITH =,
    daterange("hieuLucTuNgay", "hieuLucDenNgay", '[)') WITH &&
  )
  WHERE ("loai" = 'CHINH');

ALTER TABLE "NguoiThanhToan"
  ADD CONSTRAINT "nguoithanhtoan_mot_ho_so"
  CHECK (num_nonnulls("phuHuynhId", "hocVienId") = 1);

ALTER TABLE "PhuHuynh"
  ADD CONSTRAINT "phuhuynh_dong_y_va_thoi_diem"
  CHECK (("dongYXuLyDuLieu" IS NULL) = ("thoiDiemGhiNhanDongY" IS NULL));

ALTER TABLE "GiaSu"
  ADD CONSTRAINT "giasu_dong_y_va_thoi_diem"
  CHECK (("dongYXuLyDuLieu" IS NULL) = ("thoiDiemGhiNhanDongY" IS NULL));

ALTER TABLE "YeuCau"
  ADD CONSTRAINT "yeucau_dia_chi_hoc_tai_nha"
  CHECK ("hinhThuc" <> 'TAI_NHA' OR "diaChi" IS NOT NULL);

ALTER TABLE "LopHoc"
  ADD CONSTRAINT "lophoc_dia_diem_theo_hinh_thuc"
  CHECK (
    ("hinhThuc" = 'TAI_NHA' AND "diaDiem" IS NOT NULL)
    OR ("hinhThuc" = 'ONLINE' AND "urlHocOnline" IS NOT NULL)
  );

ALTER TABLE "LichRanh"
  ADD CONSTRAINT "lichranh_gio_hop_le"
  CHECK ("gioKetThuc" > "gioBatDau");

ALTER TABLE "LichHocCoDinh"
  ADD CONSTRAINT "lichhoc_gio_va_hieu_luc_hop_le"
  CHECK (
    "gioKetThuc" > "gioBatDau"
    AND isfinite("hieuLucTuNgay")
    AND ("hieuLucDenNgay" IS NULL OR (isfinite("hieuLucDenNgay") AND "hieuLucDenNgay" > "hieuLucTuNgay"))
  );

ALTER TABLE "BuoiHoc"
  ADD CONSTRAINT "buoihoc_goc_cua_buoi_bu"
  CHECK (
    ("loai" = 'HOC_BU') = ("buoiGocId" IS NOT NULL)
    AND "buoiGocId" IS DISTINCT FROM id
  ),
  ADD CONSTRAINT "buoihoc_cap_khoa_sinh"
  CHECK (("lichHocCoDinhId" IS NULL) = ("thoiGianBatDauGoc" IS NULL)),
  ADD CONSTRAINT "buoihoc_ky_thu_lao_hop_le"
  CHECK ("kyThuLao" ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  ADD CONSTRAINT "buoihoc_thu_lao_snapshot_hop_le"
  CHECK ("thuLaoSnapshot" >= 0);

ALTER TABLE "GiaGhiDanh"
  ADD CONSTRAINT "giaghidanh_hoc_phi_duong"
  CHECK ("hocPhiMoiBuoi" > 0);

ALTER TABLE "PhanCong"
  ADD CONSTRAINT "phancong_thu_lao_duong"
  CHECK ("thuLaoMoiBuoi" > 0);

ALTER TABLE "DiemDanh"
  ADD CONSTRAINT "diemdanh_don_gia_va_he_so"
  CHECK ("donGiaSnapshot" >= 0 AND "heSoTinhPhi" BETWEEN 0 AND 100);

ALTER TABLE "PhieuHocPhi"
  ADD CONSTRAINT "phieuhocphi_ky_hop_le"
  CHECK ("kyThang" ~ '^[0-9]{4}-(0[1-9]|1[0-2])$');

ALTER TABLE "ChiTietPhieuHocPhi"
  ADD CONSTRAINT "chitiethocphi_don_gia_va_he_so"
  CHECK ("donGiaSnapshot" >= 0 AND "heSoTinhPhi" BETWEEN 0 AND 100 AND "thanhTien" >= 0);

ALTER TABLE "PhieuThu"
  ADD CONSTRAINT "phieuthu_so_tien_duong"
  CHECK ("soTien" > 0),
  ADD CONSTRAINT "phieuthu_ma_giao_dich_chuyen_khoan"
  CHECK ("phuongThuc" <> 'CHUYEN_KHOAN' OR "maGiaoDich" IS NOT NULL);

ALTER TABLE "BangThuLao"
  ADD CONSTRAINT "bangthulao_ky_hop_le"
  CHECK ("kyThang" ~ '^[0-9]{4}-(0[1-9]|1[0-2])$');

ALTER TABLE "ChiTietBangThuLao"
  ADD CONSTRAINT "chitietthulao_don_gia_va_he_so"
  CHECK ("thuLaoSnapshot" >= 0 AND "heSoThuLao" BETWEEN 0 AND 100 AND "thanhTien" >= 0);

COMMIT;
