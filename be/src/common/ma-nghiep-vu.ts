import { maLoiPrisma, truongBiTrung } from './prisma-errors.js';

const SO_LAN_THU_SINH_MA = 3;

/** Sinh mã kế tiếp theo số lớn nhất, ví dụ ('MH', 2, ['MH99']) → 'MH100'. */
export function maTiepTheo(
  tienTo: string,
  doRong: number,
  maHienCo: readonly string[],
): string {
  const soLonNhat = maHienCo.reduce((max, ma) => {
    const so = Number(ma.slice(tienTo.length));
    return Number.isInteger(so) ? Math.max(max, so) : max;
  }, 0);
  return `${tienTo}${String(soLonNhat + 1).padStart(doRong, '0')}`;
}

/** Hai request cùng sinh một mã: request thua sinh lại mã mới và thử lại. */
export async function thuLaiKhiTrungMa<T>(thucHien: () => Promise<T>): Promise<T> {
  for (let lan = 1; ; lan += 1) {
    try {
      return await thucHien();
    } catch (error) {
      const trungMa =
        maLoiPrisma(error) === 'P2002' && truongBiTrung(error).includes('ma');
      if (!trungMa || lan >= SO_LAN_THU_SINH_MA) throw error;
    }
  }
}
