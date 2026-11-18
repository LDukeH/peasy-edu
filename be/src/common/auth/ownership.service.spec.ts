import { VaiTro } from '../enums/tai-khoan.enum.js';
import type { AuthUser } from './auth-user.js';
import { OwnershipService, type TaiNguyenCuaMinh } from './ownership.service.js';

const giaSu: AuthUser = { id: 5, vaiTro: VaiTro.GIA_SU };
const phuHuynh: AuthUser = { id: 8, vaiTro: VaiTro.PHU_HUYNH };

describe('OwnershipService', () => {
  const taoBang = () => ({ count: vi.fn().mockResolvedValue(1) });
  const prisma = {
    phuHuynh: taoBang(),
    hocVien: taoBang(),
    giaSu: taoBang(),
    yeuCau: taoBang(),
    lopHoc: taoBang(),
    buoiHoc: taoBang(),
    phieuHocPhi: taoBang(),
    bangThuLao: taoBang(),
  };
  const service = new OwnershipService(prisma as never);

  beforeEach(() => vi.clearAllMocks());

  it.each<[AuthUser, TaiNguyenCuaMinh, keyof typeof prisma]>([
    [phuHuynh, 'PHU_HUYNH', 'phuHuynh'],
    [phuHuynh, 'HOC_VIEN', 'hocVien'],
    [phuHuynh, 'YEU_CAU', 'yeuCau'],
    [phuHuynh, 'LOP_HOC', 'lopHoc'],
    [phuHuynh, 'BUOI_HOC', 'buoiHoc'],
    [phuHuynh, 'PHIEU_HOC_PHI', 'phieuHocPhi'],
    [giaSu, 'GIA_SU', 'giaSu'],
    [giaSu, 'LOP_HOC', 'lopHoc'],
    [giaSu, 'BUOI_HOC', 'buoiHoc'],
    [giaSu, 'BANG_THU_LAO', 'bangThuLao'],
  ])('%o sở hữu %s: lọc theo id và tài khoản', async (user, taiNguyen, bang) => {
    await expect(service.laCuaMinh(user, taiNguyen, 9)).resolves.toBe(true);

    const { where } = prisma[bang].count.mock.calls[0][0] as {
      where: { id: number };
    };
    expect(where.id).toBe(9);
    expect(JSON.stringify(where)).toContain(`"taiKhoanId":${user.id}`);
  });

  it('không tìm thấy bản ghi khớp → false', async () => {
    prisma.lopHoc.count.mockResolvedValueOnce(0);

    await expect(service.laCuaMinh(giaSu, 'LOP_HOC', 9)).resolves.toBe(false);
  });

  it.each<[AuthUser, TaiNguyenCuaMinh]>([
    [giaSu, 'PHIEU_HOC_PHI'],
    [giaSu, 'HOC_VIEN'],
    [giaSu, 'YEU_CAU'],
    [phuHuynh, 'BANG_THU_LAO'],
    [phuHuynh, 'GIA_SU'],
  ])('%o không có quyền với %s → false, không truy vấn', async (user, taiNguyen) => {
    await expect(service.laCuaMinh(user, taiNguyen, 9)).resolves.toBe(false);

    Object.values(prisma).forEach((bang) => {
      expect(bang.count).not.toHaveBeenCalled();
    });
  });
});
