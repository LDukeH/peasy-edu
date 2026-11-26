import { PrismaClient, type Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  bamHmac,
  docKhoa,
  maHoa,
} from '../src/common/bao-mat/ma-hoa-du-lieu.js';
import {
  HanhDongGiaSu,
  LOAI_DOI_TUONG_GIA_SU,
  gioSangDate,
  maHoSoNangLuc,
  maLichRanh,
  maMonDay,
  ngaySangDate,
} from '../src/modules/tutors/quy-tac-gia-su.js';

try {
  process.loadEnvFile('.env');
} catch {
  // Staging/Production đặt biến môi trường trực tiếp, không có file .env.
}

const prisma = new PrismaClient();

const vaiTroMacDinh: Prisma.VaiTroCreateManyInput[] = [
  {
    ma: 'QUAN_LY',
    ten: 'Quản lý',
    moTa: 'Gộp Chủ trung tâm, Quản trị viên và Kế toán trong MVP.',
  },
  {
    ma: 'DIEU_PHOI',
    ten: 'Nhân viên điều phối',
    moTa: 'Tiếp nhận yêu cầu, ghép gia sư, xếp lớp và theo dõi buổi học.',
  },
  { ma: 'GIA_SU', ten: 'Gia sư', moTa: 'Gia sư đã có tài khoản.' },
  {
    ma: 'PHU_HUYNH',
    ten: 'Phụ huynh',
    moTa: 'Phụ huynh; học viên dùng chung nhóm giao diện này trong MVP.',
  },
];

// Các môn được nêu trong Báo cáo Lần 1, Mục 4.2.6.
const monHocMacDinh: Prisma.MonHocCreateManyInput[] = [
  {
    ma: 'MH01',
    ten: 'Toán',
    nhom: 'VAN_HOA',
    capHocApDung: ['THCS', 'THPT'],
  },
  {
    ma: 'MH02',
    ten: 'Ngữ văn',
    nhom: 'VAN_HOA',
    capHocApDung: ['THCS', 'THPT'],
  },
  {
    ma: 'MH03',
    ten: 'Tiếng Anh',
    nhom: 'NGOAI_NGU',
    capHocApDung: ['THCS', 'THPT', 'DAI_HOC', 'NGUOI_DI_LAM'],
  },
  {
    ma: 'MH04',
    ten: 'IELTS',
    nhom: 'LUYEN_THI',
    capHocApDung: ['THPT', 'DAI_HOC', 'NGUOI_DI_LAM'],
  },
  {
    ma: 'MH05',
    ten: 'Piano',
    nhom: 'NANG_KHIEU_KY_NANG',
    capHocApDung: ['TIEU_HOC', 'THCS', 'THPT', 'DAI_HOC', 'NGUOI_DI_LAM'],
  },
];

/** Mật khẩu lấy từ biến môi trường để repo không chứa tài khoản đăng nhập được. */
async function seedTaiKhoanMau() {
  const matKhau = process.env.SEED_MAT_KHAU_MAU;
  if (!matKhau) {
    console.log('Bỏ qua tài khoản mẫu vì chưa đặt SEED_MAT_KHAU_MAU.');
    return;
  }
  const matKhauHash = await bcrypt.hash(matKhau, 12);

  await prisma.taiKhoan.upsert({
    where: { tenDangNhap: 'quanly01' },
    update: {},
    create: {
      tenDangNhap: 'quanly01',
      matKhauHash,
      vaiTro: { connect: { ma: 'QUAN_LY' } },
      nhanVien: {
        create: {
          ma: 'NV001',
          hoTen: 'Quản lý Mẫu',
          soDienThoai: '0900000001',
          email: 'quanly01@peasy.test',
        },
      },
    },
  });
  await prisma.taiKhoan.upsert({
    where: { tenDangNhap: 'dieuphoi01' },
    update: {},
    create: {
      tenDangNhap: 'dieuphoi01',
      matKhauHash,
      vaiTro: { connect: { ma: 'DIEU_PHOI' } },
      nhanVien: {
        create: {
          ma: 'NV002',
          hoTen: 'Điều phối Mẫu',
          soDienThoai: '0900000002',
          email: 'dieuphoi01@peasy.test',
        },
      },
    },
  });
  await prisma.taiKhoan.upsert({
    where: { tenDangNhap: '0900000003' },
    update: {},
    create: {
      tenDangNhap: '0900000003',
      matKhauHash,
      vaiTro: { connect: { ma: 'PHU_HUYNH' } },
      phuHuynh: {
        create: {
          ma: 'PH00001',
          hoTen: 'Phụ huynh Mẫu',
          soDienThoai: '0900000003',
        },
      },
    },
  });
  console.log('Đã kiểm tra 3 tài khoản mẫu.');
}

type CapHocMau = 'TIEU_HOC' | 'THCS' | 'THPT' | 'DAI_HOC' | 'NGUOI_DI_LAM';
type GiayToMau = {
  loai: string;
  ten: string;
  noiCap: string;
  ngayCap: string;
  ngayHetHan?: string;
};

interface GiaSuMau {
  hoTen: string;
  ngaySinh: string;
  gioiTinh: 'NAM' | 'NU';
  trinhDo: string;
  truongDaoTao: string;
  chuyenNganh: string;
  nienKhoa: string;
  donViCongTac?: string;
  laGiaoVienCongLap?: boolean;
  hinhThucDay: 'TAI_NHA' | 'ONLINE' | 'CA_HAI';
  khuVucNhanDay: string[];
  thuLaoMongMuon: number;
  gioiThieu: string;
  kinhNghiem: string;
  /** [mã môn, cấp dạy] – mã theo monHocMacDinh. */
  monDay: [string, CapHocMau[]][];
  /** [thứ ISO 1 = Thứ Hai … 7 = Chủ nhật, giờ bắt đầu, giờ kết thúc]. */
  lichRanh: [number, string, string][];
  giayTo: GiayToMau[];
  trangThai: 'DANG_HOAT_DONG' | 'CHO_DUYET' | 'BI_TU_CHOI';
  /** Ngày nộp hồ sơ (thoiDiemGhiNhanDongY), giờ Việt Nam 09:00. */
  ngayNop: string;
  nganHang?: string;
  lyDoTuChoi?: string;
}

const theSinhVien = (truong: string, ngayCap = '2023-09-05'): GiayToMau => ({
  loai: 'THE_SINH_VIEN',
  ten: 'Thẻ sinh viên',
  noiCap: truong,
  ngayCap,
  ngayHetHan: '2027-06-30',
});
const bangTotNghiep = (ten: string, truong: string, ngayCap: string): GiayToMau => ({
  loai: 'BANG_TOT_NGHIEP',
  ten,
  noiCap: truong,
  ngayCap,
});

const DH_SU_PHAM = 'ĐH Sư phạm TP.HCM';
const DH_KHTN = 'ĐH Khoa học Tự nhiên – ĐHQG TP.HCM';
const DH_KHXH = 'ĐH Khoa học Xã hội và Nhân văn – ĐHQG TP.HCM';
const NHAC_VIEN = 'Nhạc viện TP.HCM';

/** 15 gia sư: 12 đang hoạt động, 2 chờ duyệt, 1 bị từ chối; đủ 5 môn mẫu, mọi cấp học. */
const giaSuMau: GiaSuMau[] = [
  {
    hoTen: 'Nguyễn Minh Khoa',
    ngaySinh: '2004-03-12',
    gioiTinh: 'NAM',
    trinhDo: 'Sinh viên',
    truongDaoTao: DH_KHTN,
    chuyenNganh: 'Toán học',
    nienKhoa: '2022–2026',
    hinhThucDay: 'CA_HAI',
    khuVucNhanDay: ['Bình Thạnh', 'Phú Nhuận'],
    thuLaoMongMuon: 180000,
    gioiThieu: 'Giảng chậm, chắc từng dạng bài, giao bài tập về nhà có chữa.',
    kinhNghiem: '2 năm kèm Toán lớp 8–10',
    monDay: [['MH01', ['THCS', 'THPT']]],
    lichRanh: [
      [1, '18:00', '21:00'],
      [3, '18:00', '21:00'],
      [5, '18:00', '21:00'],
    ],
    giayTo: [theSinhVien(DH_KHTN, '2022-09-05')],
    trangThai: 'DANG_HOAT_DONG',
    ngayNop: '2026-10-01',
    nganHang: 'Vietcombank',
  },
  {
    hoTen: 'Trần Thu Hà',
    ngaySinh: '2003-11-02',
    gioiTinh: 'NU',
    trinhDo: 'Sinh viên',
    truongDaoTao: DH_SU_PHAM,
    chuyenNganh: 'Sư phạm Ngữ văn',
    nienKhoa: '2021–2025',
    hinhThucDay: 'TAI_NHA',
    khuVucNhanDay: ['Gò Vấp', 'Phú Nhuận'],
    thuLaoMongMuon: 170000,
    gioiThieu: 'Rèn cách lập dàn ý và viết đoạn nghị luận.',
    kinhNghiem: 'Ôn thi vào lớp 10 môn Văn cho 6 học sinh',
    monDay: [['MH02', ['THCS', 'THPT']]],
    lichRanh: [
      [2, '18:30', '20:30'],
      [4, '18:30', '20:30'],
      [6, '08:00', '11:00'],
    ],
    giayTo: [bangTotNghiep('Bằng Cử nhân Sư phạm Ngữ văn', DH_SU_PHAM, '2025-07-20')],
    trangThai: 'DANG_HOAT_DONG',
    ngayNop: '2026-10-03',
    nganHang: 'Techcombank',
  },
  {
    hoTen: 'Lê Quốc Bảo',
    ngaySinh: '1999-06-25',
    gioiTinh: 'NAM',
    trinhDo: 'Cử nhân',
    truongDaoTao: DH_KHXH,
    chuyenNganh: 'Ngôn ngữ Anh',
    nienKhoa: '2017–2021',
    hinhThucDay: 'ONLINE',
    khuVucNhanDay: [],
    thuLaoMongMuon: 300000,
    gioiThieu: 'Tập trung Speaking và Writing, có lộ trình theo band mục tiêu.',
    kinhNghiem: '4 năm dạy IELTS online',
    monDay: [
      ['MH03', ['THCS', 'THPT', 'DAI_HOC']],
      ['MH04', ['THPT', 'DAI_HOC', 'NGUOI_DI_LAM']],
    ],
    lichRanh: [
      [1, '19:30', '21:30'],
      [2, '19:30', '21:30'],
      [3, '19:30', '21:30'],
      [4, '19:30', '21:30'],
      [5, '19:30', '21:30'],
    ],
    giayTo: [
      bangTotNghiep('Bằng Cử nhân Ngôn ngữ Anh', DH_KHXH, '2021-08-10'),
      {
        loai: 'CHUNG_CHI_NGOAI_NGU',
        ten: 'IELTS Academic 8.0',
        noiCap: 'IDP Việt Nam',
        ngayCap: '2025-03-15',
        ngayHetHan: '2027-03-15',
      },
    ],
    trangThai: 'DANG_HOAT_DONG',
    ngayNop: '2026-10-05',
    nganHang: 'ACB',
  },
  {
    hoTen: 'Phạm Ngọc Ánh',
    ngaySinh: '1992-01-18',
    gioiTinh: 'NU',
    trinhDo: 'Giáo viên',
    truongDaoTao: DH_SU_PHAM,
    chuyenNganh: 'Sư phạm Toán',
    nienKhoa: '2010–2014',
    donViCongTac: 'THCS Nguyễn Du',
    laGiaoVienCongLap: true,
    hinhThucDay: 'TAI_NHA',
    khuVucNhanDay: ['Tân Bình'],
    thuLaoMongMuon: 250000,
    gioiThieu: 'Chỉ nhận học sinh ngoài trường đang công tác (TT 29/2024).',
    kinhNghiem: '10 năm dạy Toán THCS',
    monDay: [['MH01', ['THCS']]],
    lichRanh: [
      [6, '14:00', '17:00'],
      [7, '08:00', '11:00'],
    ],
    giayTo: [
      bangTotNghiep('Bằng Cử nhân Sư phạm Toán', DH_SU_PHAM, '2014-07-15'),
      {
        loai: 'XAC_NHAN_NOI_CONG_TAC',
        ten: 'Giấy xác nhận công tác',
        noiCap: 'THCS Nguyễn Du',
        ngayCap: '2026-09-01',
      },
    ],
    trangThai: 'DANG_HOAT_DONG',
    ngayNop: '2026-10-08',
    nganHang: 'BIDV',
  },
  {
    hoTen: 'Võ Hoàng Long',
    ngaySinh: '2002-09-09',
    gioiTinh: 'NAM',
    trinhDo: 'Sinh viên',
    truongDaoTao: NHAC_VIEN,
    chuyenNganh: 'Biểu diễn Piano',
    nienKhoa: '2020–2026',
    hinhThucDay: 'TAI_NHA',
    khuVucNhanDay: ['Bình Thạnh', 'Thủ Đức'],
    thuLaoMongMuon: 220000,
    gioiThieu: 'Dạy piano cơ bản đến nâng cao, luyện thi chứng chỉ ABRSM.',
    kinhNghiem: '3 năm dạy piano cho thiếu nhi',
    monDay: [['MH05', ['TIEU_HOC', 'THCS', 'THPT']]],
    lichRanh: [
      [2, '17:00', '19:00'],
      [4, '17:00', '19:00'],
      [7, '14:00', '18:00'],
    ],
    giayTo: [theSinhVien(NHAC_VIEN, '2020-09-10')],
    trangThai: 'DANG_HOAT_DONG',
    ngayNop: '2026-10-10',
    nganHang: 'Vietcombank',
  },
  {
    hoTen: 'Đặng Thùy Linh',
    ngaySinh: '1996-04-30',
    gioiTinh: 'NU',
    trinhDo: 'Thạc sĩ',
    truongDaoTao: DH_KHXH,
    chuyenNganh: 'Lý luận và phương pháp dạy học tiếng Anh',
    nienKhoa: '2019–2021',
    hinhThucDay: 'CA_HAI',
    khuVucNhanDay: ['Phú Nhuận', 'Bình Thạnh'],
    thuLaoMongMuon: 350000,
    gioiThieu: 'Luyện IELTS 6.5+ cho học sinh THPT và người đi làm.',
    kinhNghiem: '6 năm giảng dạy tại trung tâm Anh ngữ',
    monDay: [
      ['MH04', ['THPT', 'DAI_HOC', 'NGUOI_DI_LAM']],
      ['MH03', ['DAI_HOC', 'NGUOI_DI_LAM']],
    ],
    lichRanh: [
      [1, '19:00', '21:00'],
      [3, '19:00', '21:00'],
      [6, '09:00', '12:00'],
    ],
    giayTo: [
      bangTotNghiep('Bằng Thạc sĩ Lý luận và PPDH tiếng Anh', DH_KHXH, '2021-12-20'),
      {
        loai: 'CHUNG_CHI_NGOAI_NGU',
        ten: 'IELTS Academic 8.5',
        noiCap: 'British Council',
        ngayCap: '2025-06-01',
        ngayHetHan: '2027-06-01',
      },
    ],
    trangThai: 'DANG_HOAT_DONG',
    ngayNop: '2026-10-13',
    nganHang: 'MB Bank',
  },
  {
    hoTen: 'Bùi Gia Huy',
    ngaySinh: '2004-12-01',
    gioiTinh: 'NAM',
    trinhDo: 'Sinh viên',
    truongDaoTao: 'ĐH Bách khoa – ĐHQG TP.HCM',
    chuyenNganh: 'Khoa học Máy tính',
    nienKhoa: '2022–2026',
    hinhThucDay: 'ONLINE',
    khuVucNhanDay: [],
    thuLaoMongMuon: 200000,
    gioiThieu: 'Ôn thi THPT môn Toán, chữa đề theo cấu trúc mới.',
    kinhNghiem: 'Thủ khoa đầu vào khối A00, 1 năm dạy online',
    monDay: [['MH01', ['THPT']]],
    lichRanh: [
      [2, '20:00', '22:00'],
      [4, '20:00', '22:00'],
      [6, '20:00', '22:00'],
    ],
    giayTo: [theSinhVien('ĐH Bách khoa – ĐHQG TP.HCM', '2022-09-05')],
    trangThai: 'DANG_HOAT_DONG',
    ngayNop: '2026-10-16',
  },
  {
    hoTen: 'Hoàng Mai Anh',
    ngaySinh: '2003-07-14',
    gioiTinh: 'NU',
    trinhDo: 'Sinh viên',
    truongDaoTao: DH_SU_PHAM,
    chuyenNganh: 'Sư phạm Tiếng Anh',
    nienKhoa: '2021–2025',
    hinhThucDay: 'TAI_NHA',
    khuVucNhanDay: ['Gò Vấp', 'Tân Bình'],
    thuLaoMongMuon: 170000,
    gioiThieu: 'Củng cố ngữ pháp và từ vựng theo sách giáo khoa.',
    kinhNghiem: '2 năm kèm Tiếng Anh THCS',
    monDay: [['MH03', ['THCS', 'THPT']]],
    lichRanh: [
      [1, '17:30', '19:30'],
      [3, '17:30', '19:30'],
      [5, '17:30', '19:30'],
    ],
    giayTo: [bangTotNghiep('Bằng Cử nhân Sư phạm Tiếng Anh', DH_SU_PHAM, '2025-07-20')],
    trangThai: 'DANG_HOAT_DONG',
    ngayNop: '2026-10-19',
    nganHang: 'VietinBank',
  },
  {
    hoTen: 'Ngô Đức Thịnh',
    ngaySinh: '1998-02-20',
    gioiTinh: 'NAM',
    trinhDo: 'Cử nhân',
    truongDaoTao: DH_KHXH,
    chuyenNganh: 'Văn học',
    nienKhoa: '2016–2020',
    hinhThucDay: 'ONLINE',
    khuVucNhanDay: [],
    thuLaoMongMuon: 190000,
    gioiThieu: 'Đọc hiểu và nghị luận văn học cho học sinh THPT.',
    kinhNghiem: '3 năm dạy Văn online',
    monDay: [['MH02', ['THCS', 'THPT']]],
    lichRanh: [
      [6, '19:00', '21:00'],
      [7, '19:00', '21:00'],
    ],
    giayTo: [bangTotNghiep('Bằng Cử nhân Văn học', DH_KHXH, '2020-08-01')],
    trangThai: 'DANG_HOAT_DONG',
    ngayNop: '2026-10-22',
    nganHang: 'Sacombank',
  },
  {
    hoTen: 'Lý Bảo Ngọc',
    ngaySinh: '1994-10-05',
    gioiTinh: 'NU',
    trinhDo: 'Giáo viên',
    truongDaoTao: NHAC_VIEN,
    chuyenNganh: 'Sư phạm Âm nhạc',
    nienKhoa: '2012–2016',
    donViCongTac: 'Trung tâm Âm nhạc Hòa Âm',
    laGiaoVienCongLap: false,
    hinhThucDay: 'CA_HAI',
    khuVucNhanDay: ['Bến Thành', 'Phú Nhuận'],
    thuLaoMongMuon: 280000,
    gioiThieu: 'Dạy piano mọi lứa tuổi, từ trẻ em đến người đi làm.',
    kinhNghiem: '9 năm dạy piano',
    monDay: [['MH05', ['TIEU_HOC', 'THCS', 'THPT', 'DAI_HOC', 'NGUOI_DI_LAM']]],
    lichRanh: [
      [1, '15:00', '18:00'],
      [3, '15:00', '18:00'],
    ],
    giayTo: [
      bangTotNghiep('Bằng Cử nhân Sư phạm Âm nhạc', NHAC_VIEN, '2016-07-01'),
      {
        loai: 'CHUNG_CHI_SU_PHAM',
        ten: 'Chứng chỉ nghiệp vụ sư phạm',
        noiCap: DH_SU_PHAM,
        ngayCap: '2017-05-10',
      },
    ],
    trangThai: 'DANG_HOAT_DONG',
    ngayNop: '2026-10-25',
    nganHang: 'Vietcombank',
  },
  {
    hoTen: 'Trương Khánh Vy',
    ngaySinh: '2004-05-22',
    gioiTinh: 'NU',
    trinhDo: 'Sinh viên',
    truongDaoTao: 'ĐH Kinh tế TP.HCM',
    chuyenNganh: 'Tài chính – Ngân hàng',
    nienKhoa: '2022–2026',
    hinhThucDay: 'TAI_NHA',
    khuVucNhanDay: ['Bình Thạnh', 'Thủ Đức'],
    thuLaoMongMuon: 160000,
    gioiThieu: 'Kèm Toán và Tiếng Anh THCS, theo sát bài trên lớp.',
    kinhNghiem: '1 năm kèm học sinh lớp 6–7',
    monDay: [
      ['MH01', ['THCS']],
      ['MH03', ['THCS']],
    ],
    lichRanh: [
      [2, '18:00', '20:00'],
      [4, '18:00', '20:00'],
      [6, '14:00', '16:00'],
    ],
    giayTo: [theSinhVien('ĐH Kinh tế TP.HCM')],
    trangThai: 'DANG_HOAT_DONG',
    ngayNop: '2026-10-28',
  },
  {
    hoTen: 'Phan Tuấn Kiệt',
    ngaySinh: '1995-08-08',
    gioiTinh: 'NAM',
    trinhDo: 'Thạc sĩ',
    truongDaoTao: DH_KHTN,
    chuyenNganh: 'Toán ứng dụng',
    nienKhoa: '2018–2020',
    hinhThucDay: 'CA_HAI',
    khuVucNhanDay: ['Tân Bình', 'Phú Nhuận'],
    thuLaoMongMuon: 320000,
    gioiThieu: 'Luyện thi chuyên Toán, học sinh giỏi THCS và THPT.',
    kinhNghiem: '7 năm luyện thi chuyên',
    monDay: [['MH01', ['THCS', 'THPT']]],
    lichRanh: [
      [1, '19:00', '21:00'],
      [2, '19:00', '21:00'],
      [3, '19:00', '21:00'],
      [4, '19:00', '21:00'],
    ],
    giayTo: [bangTotNghiep('Bằng Thạc sĩ Toán ứng dụng', DH_KHTN, '2020-11-30')],
    trangThai: 'DANG_HOAT_DONG',
    ngayNop: '2026-11-02',
    nganHang: 'Techcombank',
  },
  {
    hoTen: 'Đỗ Thanh Tâm',
    ngaySinh: '2005-01-27',
    gioiTinh: 'NU',
    trinhDo: 'Sinh viên',
    truongDaoTao: DH_SU_PHAM,
    chuyenNganh: 'Sư phạm Ngữ văn',
    nienKhoa: '2023–2027',
    hinhThucDay: 'TAI_NHA',
    khuVucNhanDay: ['Gò Vấp'],
    thuLaoMongMuon: 150000,
    gioiThieu: 'Kèm Văn THCS, luyện chữ và chính tả.',
    kinhNghiem: 'Chưa có kinh nghiệm dạy kèm',
    monDay: [['MH02', ['THCS']]],
    lichRanh: [
      [6, '08:00', '10:00'],
      [7, '08:00', '10:00'],
    ],
    giayTo: [theSinhVien(DH_SU_PHAM, '2023-09-05')],
    trangThai: 'CHO_DUYET',
    ngayNop: '2026-11-24',
  },
  {
    hoTen: 'Mai Phương Thảo',
    ngaySinh: '2000-12-12',
    gioiTinh: 'NU',
    trinhDo: 'Cử nhân',
    truongDaoTao: 'ĐH Ngoại thương – Cơ sở II',
    chuyenNganh: 'Kinh tế đối ngoại',
    nienKhoa: '2018–2022',
    hinhThucDay: 'ONLINE',
    khuVucNhanDay: [],
    thuLaoMongMuon: 280000,
    gioiThieu: 'Luyện IELTS Reading và Listening.',
    kinhNghiem: '2 năm trợ giảng IELTS',
    monDay: [['MH04', ['THPT', 'DAI_HOC']]],
    lichRanh: [
      [1, '20:00', '22:00'],
      [3, '20:00', '22:00'],
      [5, '20:00', '22:00'],
    ],
    giayTo: [
      bangTotNghiep('Bằng Cử nhân Kinh tế đối ngoại', 'ĐH Ngoại thương', '2022-09-15'),
      {
        loai: 'CHUNG_CHI_NGOAI_NGU',
        ten: 'IELTS Academic 7.5',
        noiCap: 'IDP Việt Nam',
        ngayCap: '2025-10-20',
        ngayHetHan: '2027-10-20',
      },
    ],
    trangThai: 'CHO_DUYET',
    ngayNop: '2026-11-25',
  },
  {
    hoTen: 'Huỳnh Nhật Nam',
    ngaySinh: '2003-03-03',
    gioiTinh: 'NAM',
    trinhDo: 'Sinh viên',
    truongDaoTao: NHAC_VIEN,
    chuyenNganh: 'Piano',
    nienKhoa: '2021–2027',
    hinhThucDay: 'TAI_NHA',
    khuVucNhanDay: ['Bình Thạnh'],
    thuLaoMongMuon: 200000,
    gioiThieu: 'Dạy piano cơ bản cho học sinh THCS.',
    kinhNghiem: '1 năm',
    monDay: [['MH05', ['THCS']]],
    lichRanh: [[5, '18:00', '20:00']],
    giayTo: [theSinhVien(NHAC_VIEN, '2021-09-10')],
    trangThai: 'BI_TU_CHOI',
    ngayNop: '2026-11-10',
    lyDoTuChoi: 'Ảnh CCCD mặt sau bị mờ, vui lòng chụp lại và nộp hồ sơ mới',
  },
];

/** "Vũ Ngọc Hân" → "VU NGOC HAN" (tên chủ tài khoản ngân hàng). */
function khongDau(hoTen: string): string {
  return hoTen
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toUpperCase();
}

/** Ngày YYYY-MM-DD lúc 09:00 giờ Việt Nam. */
const luc9GioSang = (ngay: string, congNgay = 0) =>
  new Date(Date.parse(`${ngay}T09:00:00+07:00`) + congNgay * 86_400_000);

/**
 * Gia sư mẫu: SĐT 09110000xx, CCCD 07920000xxxx, email giasuxx@peasy.test,
 * đăng nhập bằng SĐT + SEED_MAT_KHAU_MAU. Bỏ qua người đã có (theo SĐT) nên
 * chạy lại seed không tạo trùng. Cần khóa mã hóa giống máy chủ để API giải mã được.
 */
async function seedGiaSuMau() {
  const matKhau = process.env.SEED_MAT_KHAU_MAU;
  const khoaMaHoa = docKhoa(process.env.DATA_ENCRYPTION_KEY, 'DATA_ENCRYPTION_KEY');
  const khoaHmac = docKhoa(process.env.DATA_HMAC_KEY, 'DATA_HMAC_KEY');
  if (!matKhau || !khoaMaHoa || !khoaHmac) {
    console.log(
      'Bỏ qua gia sư mẫu vì chưa đặt đủ SEED_MAT_KHAU_MAU, DATA_ENCRYPTION_KEY, DATA_HMAC_KEY.',
    );
    return;
  }
  const matKhauHash = await bcrypt.hash(matKhau, 12);
  const monHoc = new Map(
    (await prisma.monHoc.findMany({ select: { id: true, ma: true } })).map(
      (mon) => [mon.ma, mon.id],
    ),
  );
  const nguoiDuyet = await prisma.nhanVien.findFirst({
    where: { taiKhoan: { tenDangNhap: 'dieuphoi01' } },
    select: { id: true, taiKhoanId: true },
  });

  let soTaoMoi = 0;
  for (const [i, mau] of giaSuMau.entries()) {
    const stt = String(i + 1).padStart(2, '0');
    const soDienThoai = `09110000${stt}`;
    const [daCoGiaSu, daCoTaiKhoan] = await Promise.all([
      prisma.giaSu.findUnique({ where: { soDienThoai }, select: { id: true } }),
      prisma.taiKhoan.findUnique({
        where: { tenDangNhap: soDienThoai },
        select: { id: true },
      }),
    ]);
    if (daCoGiaSu || daCoTaiKhoan) continue;

    const moiNhat = await prisma.giaSu.findFirst({
      where: { ma: { startsWith: 'GS' } },
      orderBy: { ma: 'desc' },
      select: { ma: true },
    });
    const ma = `GS${String(Number(moiNhat?.ma.slice(2) ?? 0) + 1).padStart(5, '0')}`;
    const soCccd = `07920000${String(i + 1).padStart(4, '0')}`;
    const daXuLy = mau.trangThai !== 'CHO_DUYET';
    const duocDuyet = mau.trangThai === 'DANG_HOAT_DONG';
    const ngayDuyet = daXuLy ? luc9GioSang(mau.ngayNop, 3) : null;

    await prisma.$transaction(async (tx) => {
      const giaSu = await tx.giaSu.create({
        data: {
          ma,
          hoTen: mau.hoTen,
          ngaySinh: ngaySangDate(mau.ngaySinh),
          gioiTinh: mau.gioiTinh,
          cccdMaHoa: maHoa(soCccd, khoaMaHoa),
          cccdHmac: bamHmac(soCccd, khoaHmac),
          anhCccdMatTruoc: `seed/gia-su/${ma}/cccd-mat-truoc.jpg`,
          anhCccdMatSau: `seed/gia-su/${ma}/cccd-mat-sau.jpg`,
          soDienThoai,
          email: `giasu${stt}@peasy.test`,
          diaChi: `${mau.khuVucNhanDay[0] ?? 'Phú Nhuận'}, TP.HCM`,
          anhChanDung: `seed/gia-su/${ma}/chan-dung.jpg`,
          trinhDo: mau.trinhDo,
          truongDaoTao: mau.truongDaoTao,
          chuyenNganh: mau.chuyenNganh,
          nienKhoa: mau.nienKhoa,
          donViCongTac: mau.donViCongTac ?? null,
          laGiaoVienCongLap: mau.laGiaoVienCongLap ?? null,
          hinhThucDay: mau.hinhThucDay,
          khuVucNhanDay: mau.khuVucNhanDay,
          thuLaoMongMuon: mau.thuLaoMongMuon,
          gioiThieu: mau.gioiThieu,
          kinhNghiem: mau.kinhNghiem,
          trangThai: mau.trangThai,
          dongYXuLyDuLieu: true,
          thoiDiemGhiNhanDongY: luc9GioSang(mau.ngayNop),
          taiKhoanNganHangMaHoa: mau.nganHang
            ? maHoa(
                JSON.stringify({
                  nganHang: mau.nganHang,
                  soTaiKhoan: `10${String(i + 1).padStart(8, '0')}`,
                  chuTaiKhoan: khongDau(mau.hoTen),
                }),
                khoaMaHoa,
              )
            : null,
          ...(daXuLy &&
            nguoiDuyet && { nguoiDuyet: { connect: { id: nguoiDuyet.id } } }),
          ngayDuyet,
          taiKhoan: {
            create: {
              tenDangNhap: soDienThoai,
              matKhauHash,
              vaiTro: { connect: { ma: 'GIA_SU' } },
            },
          },
          monDay: {
            create: mau.monDay.map(([maMon, capLop]) => {
              const monHocId = monHoc.get(maMon);
              if (!monHocId) throw new Error(`Thiếu môn ${maMon}, seed môn học trước`);
              return { ma: maMonDay(ma, maMon), monHocId, capLop };
            }),
          },
          lichRanh: {
            create: mau.lichRanh.map(([thu, gioBatDau, gioKetThuc]) => ({
              ma: maLichRanh(ma, { thu, gioBatDau, gioKetThuc }),
              thu,
              gioBatDau: gioSangDate(gioBatDau),
              gioKetThuc: gioSangDate(gioKetThuc),
            })),
          },
          hoSoNangLuc: {
            create: mau.giayTo.map((giayTo, j) => ({
              ma: maHoSoNangLuc(ma, j + 1),
              loai: giayTo.loai,
              ten: giayTo.ten,
              noiCap: giayTo.noiCap,
              ngayCap: ngaySangDate(giayTo.ngayCap),
              ngayHetHan: giayTo.ngayHetHan ? ngaySangDate(giayTo.ngayHetHan) : null,
              tep: `seed/gia-su/${ma}/giay-to-${j + 1}.jpg`,
              trangThai: duocDuyet ? 'DA_XAC_MINH' : 'CHUA_XAC_MINH',
              nguoiXacMinhId: duocDuyet ? (nguoiDuyet?.id ?? null) : null,
            })),
          },
        },
        select: { taiKhoanId: true },
      });

      // Lịch sử trạng thái giống luồng thật; lý do từ chối đọc từ bản ghi TU_CHOI.
      const nhatKy: Prisma.NhatKyThayDoiCreateManyInput[] = [
        {
          thoiDiem: luc9GioSang(mau.ngayNop),
          taiKhoanId: giaSu.taiKhoanId,
          hanhDong: HanhDongGiaSu.UNG_TUYEN,
          loaiDoiTuong: LOAI_DOI_TUONG_GIA_SU,
          maBanGhi: ma,
          truong: 'trangThai',
          giaTriMoi: 'CHO_DUYET',
        },
      ];
      if (ngayDuyet) {
        nhatKy.push({
          thoiDiem: ngayDuyet,
          taiKhoanId: nguoiDuyet?.taiKhoanId ?? null,
          hanhDong: duocDuyet ? HanhDongGiaSu.DUYET : HanhDongGiaSu.TU_CHOI,
          loaiDoiTuong: LOAI_DOI_TUONG_GIA_SU,
          maBanGhi: ma,
          truong: 'trangThai',
          giaTriCu: 'CHO_DUYET',
          giaTriMoi: mau.trangThai,
          lyDo: mau.lyDoTuChoi ?? null,
        });
      }
      await tx.nhatKyThayDoi.createMany({ data: nhatKy });
    });
    soTaoMoi += 1;
  }
  console.log(`Đã thêm ${soTaoMoi}/${giaSuMau.length} gia sư mẫu còn thiếu.`);
}

const thamSoMacDinh: Prisma.ThamSoNghiepVuCreateManyInput[] = [
  {
    ma: 'lop_so_hoc_vien_toi_da',
    giaTri: 4,
    donVi: 'học viên',
    moTa: 'Số học viên tối đa trong một lớp.',
  },
  {
    ma: 'gia_su_so_lop_hoat_dong_toi_da',
    giaTri: 5,
    donVi: 'lớp',
    moTa: 'Số lớp đang hoạt động tối đa của một gia sư.',
  },
  {
    ma: 'de_xuat_so_ho_so_toi_da',
    giaTri: 3,
    donVi: 'hồ sơ',
    moTa: 'Số hồ sơ gia sư tối đa trong mỗi lần đề xuất.',
  },
  {
    ma: 'gia_su_han_phan_hoi_loi_moi_gio',
    giaTri: 24,
    donVi: 'giờ',
    moTa: 'Hạn gia sư phản hồi lời mời.',
  },
  {
    ma: 'yeu_cau_han_tu_van_gio_lam_viec',
    giaTri: 24,
    donVi: 'giờ làm việc',
    moTa: 'Hạn tư vấn yêu cầu mới.',
  },
  {
    ma: 'tim_gia_su_han_noi_tieu_chi_ngay',
    giaTri: 7,
    donVi: 'ngày',
    moTa: 'Thời gian tìm gia sư trước khi đề nghị nới tiêu chí.',
  },
  {
    ma: 'hoc_thu_so_buoi',
    giaTri: 1,
    donVi: 'buổi',
    moTa: 'Số buổi học thử.',
  },
  {
    ma: 'hoc_thu_khong_dat_thu_lao_phan_tram',
    giaTri: 50,
    donVi: '%',
    moTa: 'Tỷ lệ thù lao gia sư cho buổi học thử không đạt.',
  },
  {
    ma: 'buoi_hoc_thoi_luong_phut',
    giaTri: [90, 120],
    donVi: 'phút',
    moTa: 'Các thời lượng mặc định của buổi học.',
  },
  {
    ma: 'lich_dem_di_chuyen_phut',
    giaTri: 30,
    donVi: 'phút',
    moTa: 'Khoảng đệm giữa hai buổi học tại nhà khác địa điểm.',
  },
  {
    ma: 'hoc_vien_bao_nghi_truoc_gio',
    giaTri: 12,
    donVi: 'giờ',
    moTa: 'Ngưỡng báo nghỉ trước của học viên.',
  },
  {
    ma: 'gia_su_bao_nghi_truoc_gio',
    giaTri: 24,
    donVi: 'giờ',
    moTa: 'Ngưỡng báo nghỉ trước của gia sư.',
  },
  {
    ma: 'hoc_vien_vang_khong_phep_phan_tram',
    giaTri: { hocPhi: 50, thuLao: 50 },
    donVi: '%',
    moTa: 'Tỷ lệ học phí và thù lao khi học viên vắng không phép.',
  },
  {
    ma: 'day_bu_han_ngay',
    giaTri: 14,
    donVi: 'ngày',
    moTa: 'Hạn dạy bù khi gia sư nghỉ.',
  },
  {
    ma: 'buoi_hoc_han_xu_ly_gio',
    giaTri: { giaSuCapNhat: 24, phuHuynhXacNhan: 48, nhanVienXacMinh: 72 },
    donVi: 'giờ',
    moTa: 'Hạn gia sư cập nhật, phụ huynh xác nhận và nhân viên xác minh buổi học.',
  },
  {
    ma: 'gia_su_cham_cap_nhat_nguong_vi_pham',
    giaTri: 3,
    donVi: 'lần/tháng',
    moTa: 'Ghi nhận vi phạm từ ngưỡng số lần cập nhật chậm trong tháng.',
  },
  {
    ma: 'lop_tam_dung_toi_da_ngay',
    giaTri: 30,
    donVi: 'ngày',
    moTa: 'Thời hạn tạm dừng lớp tối đa.',
  },
  {
    ma: 'gia_su_thoi_day_bao_truoc_ngay',
    giaTri: 7,
    donVi: 'ngày',
    moTa: 'Thời gian gia sư báo trước khi thôi dạy một lớp.',
  },
  {
    ma: 'thanh_toan_loai_ky',
    giaTri: 'THANG_DUONG_LICH',
    donVi: 'loại kỳ',
    moTa: 'Kỳ thanh toán tính theo tháng dương lịch.',
  },
  {
    ma: 'tai_chinh_lich_theo_thang',
    giaTri: { lapNhap: 1, phatHanhVaChot: 3, hanThanhToan: 10, chiThuLao: 15 },
    donVi: 'ngày trong tháng',
    moTa: 'Ngày lập nháp, ngày phát hành hoặc chốt, hạn thanh toán và ngày chi thù lao.',
  },
  {
    ma: 'cong_no_nhac_va_tam_dung',
    giaTri: { nhacNgayTrongThang: [11, 15], tamDungSauSoNgayQuaHan: 30 },
    donVi: 'ngày',
    moTa: 'Lịch nhắc nợ tự động và số ngày quá hạn trước khi tạm dừng lớp.',
  },
  {
    ma: 'phi_dich_vu_vi_du',
    giaTri: { phanTram: 20, chiLaViDu: true },
    donVi: '%',
    moTa: 'Tỷ lệ phí dịch vụ minh họa trong báo cáo, chờ nhóm chốt mức vận hành.',
  },
  {
    ma: 'danh_gia_khong_tot_diem_toi_da',
    giaTri: 2,
    donVi: 'điểm trên thang 5',
    moTa: 'Đánh giá bằng hoặc dưới ngưỡng này được xem là không tốt.',
  },
  {
    ma: 'gia_su_dieu_kien_gan_co',
    giaTri: { soThang: 3, trungBinhDuoi: 3.0, soDanhGiaKhongTotTu: 2 },
    donVi: 'tháng, điểm và lượt đánh giá',
    moTa: 'Gắn cờ khi điểm trung bình dưới ngưỡng hoặc số đánh giá không tốt đạt ngưỡng trong khoảng xét.',
  },
  {
    ma: 'gia_su_tam_ngung_nhan_lop_ngay',
    giaTri: 30,
    donVi: 'ngày',
    moTa: 'Thời gian tạm ngưng nhận lớp khi gia sư vi phạm.',
  },
  {
    ma: 'danh_gia_han_sua_ngay',
    giaTri: 7,
    donVi: 'ngày',
    moTa: 'Hạn sửa đánh giá.',
  },
  {
    ma: 'khieu_nai_han_xu_ly',
    giaTri: { phanHoiGio: 24, giaiQuyetNgayLamViec: 3 },
    donVi: 'giờ và ngày làm việc',
    moTa: 'Hạn phản hồi và hạn giải quyết khiếu nại.',
  },
  {
    ma: 'sinh_buoi_so_tuan_truoc',
    giaTri: 4,
    donVi: 'tuần',
    moTa: 'Số tuần sinh buổi học trước.',
  },
];

async function main() {
  const { count } = await prisma.thamSoNghiepVu.createMany({
    data: thamSoMacDinh.map((thamSo) => ({
      ...thamSo,
      moTa: `${thamSo.moTa} Nguồn: Báo cáo Lần 1, Phụ lục A, Bảng 32.`,
    })),
    skipDuplicates: true,
  });
  console.log(`Đã thêm ${count} tham số nghiệp vụ còn thiếu.`);

  const vaiTro = await prisma.vaiTro.createMany({
    data: vaiTroMacDinh,
    skipDuplicates: true,
  });
  console.log(`Đã thêm ${vaiTro.count} vai trò còn thiếu.`);

  const monHoc = await prisma.monHoc.createMany({
    data: monHocMacDinh,
    skipDuplicates: true,
  });
  console.log(`Đã thêm ${monHoc.count} môn học còn thiếu.`);

  await seedTaiKhoanMau();
  await seedGiaSuMau();
}

main()
  .catch((error) => {
    console.error('Lỗi khi seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
