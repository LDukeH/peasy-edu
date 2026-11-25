import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
} from 'node:crypto';

/**
 * Mã hóa tầng ứng dụng cho dữ liệu nhạy cảm (CCCD, số tài khoản ngân hàng).
 * Không import Nest để prisma/seed.ts dùng lại được.
 */

const THUAT_TOAN = 'aes-256-gcm';
const DO_DAI_KHOA = 32;
const DO_DAI_IV = 12;
const DO_DAI_TAG = 16;
/** Byte đầu bản mã: đổi thuật toán/khóa sau này vẫn phân biệt được dữ liệu cũ. */
const PHIEN_BAN = 1;
const DAU_BAN_MA = 1 + DO_DAI_IV + DO_DAI_TAG;

/** Khóa là chuỗi base64 của đúng 32 byte; chưa đặt → null; sai độ dài → lỗi ngay. */
export function docKhoa(
  giaTri: string | undefined,
  tenBien: string,
): Buffer | null {
  const chuoi = giaTri?.trim();
  if (!chuoi) return null;
  const khoa = Buffer.from(chuoi, 'base64');
  if (khoa.length !== DO_DAI_KHOA) {
    throw new Error(
      `${tenBien} phải là chuỗi base64 của đúng ${DO_DAI_KHOA} byte`,
    );
  }
  return khoa;
}

/** Kiểu cột Bytes của Prisma 6 (Buffer của Node có thể nằm trên SharedArrayBuffer). */
export type BytesDb = Uint8Array<ArrayBuffer>;

/** AES-256-GCM, IV ngẫu nhiên: [phiên bản | IV 12 byte | tag 16 byte | bản mã]. */
export function maHoa(banRo: string, khoa: Buffer): BytesDb {
  const iv = randomBytes(DO_DAI_IV);
  const cipher = createCipheriv(THUAT_TOAN, khoa, iv);
  const banMa = Buffer.concat([cipher.update(banRo, 'utf8'), cipher.final()]);
  return new Uint8Array(
    Buffer.concat([Buffer.from([PHIEN_BAN]), iv, cipher.getAuthTag(), banMa]),
  );
}

/** Sai khóa hoặc dữ liệu bị sửa → GCM từ chối (ném lỗi), không trả rác. */
export function giaiMa(duLieu: Uint8Array, khoa: Buffer): string {
  const buf = Buffer.from(duLieu);
  if (buf.length < DAU_BAN_MA || buf[0] !== PHIEN_BAN) {
    throw new Error('Bản mã không đúng định dạng');
  }
  const decipher = createDecipheriv(
    THUAT_TOAN,
    khoa,
    buf.subarray(1, 1 + DO_DAI_IV),
    { authTagLength: DO_DAI_TAG },
  );
  decipher.setAuthTag(buf.subarray(1 + DO_DAI_IV, DAU_BAN_MA));
  return Buffer.concat([
    decipher.update(buf.subarray(DAU_BAN_MA)),
    decipher.final(),
  ]).toString('utf8');
}

/**
 * HMAC-SHA256 cố định cho cùng một giá trị → dùng làm cột @unique
 * (GiaSu.cccdHmac) để phát hiện trùng CCCD mà không lưu bản rõ.
 */
export function bamHmac(giaTri: string, khoa: Buffer): BytesDb {
  return new Uint8Array(
    createHmac('sha256', khoa).update(giaTri, 'utf8').digest(),
  );
}

/** CCCD 12 số → giữ 3 số đầu và 3 số cuối: 079******042. */
export function cheCccd(soCccd: string): string {
  if (soCccd.length <= 6) return '*'.repeat(soCccd.length);
  return `${soCccd.slice(0, 3)}${'*'.repeat(soCccd.length - 6)}${soCccd.slice(-3)}`;
}

/** Số tài khoản → chỉ giữ 4 số cuối: ******6789. */
export function cheSoTaiKhoan(soTaiKhoan: string): string {
  if (soTaiKhoan.length <= 4) return '*'.repeat(soTaiKhoan.length);
  return `${'*'.repeat(soTaiKhoan.length - 4)}${soTaiKhoan.slice(-4)}`;
}
