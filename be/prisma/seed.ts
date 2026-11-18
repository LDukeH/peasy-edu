import { PrismaClient, type Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

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
}

main()
  .catch((error) => {
    console.error('Lỗi khi seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
