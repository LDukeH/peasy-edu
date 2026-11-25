import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  type BytesDb,
  bamHmac,
  docKhoa,
  giaiMa,
  maHoa,
} from './ma-hoa-du-lieu.js';

const BIEN_KHOA_MA_HOA = 'DATA_ENCRYPTION_KEY';
const BIEN_KHOA_HMAC = 'DATA_HMAC_KEY';

/**
 * Bọc các hàm mã hóa bằng khóa lấy từ biến môi trường.
 * Thiếu khóa không làm sập cả API (đăng nhập, danh mục vẫn chạy): chỉ các
 * thao tác cần mã hóa/giải mã trả 500 kèm tên biến còn thiếu.
 * DB Supabase dùng chung → cả nhóm (và Render nếu trỏ cùng DB) phải dùng
 * cùng một cặp khóa, nếu không sẽ không giải mã được dữ liệu của nhau.
 */
@Injectable()
export class MaHoaDuLieuService {
  private readonly logger = new Logger(MaHoaDuLieuService.name);
  private readonly khoaMaHoa: Buffer | null;
  private readonly khoaHmac: Buffer | null;

  constructor(config: ConfigService) {
    this.khoaMaHoa = docKhoa(
      config.get<string>(BIEN_KHOA_MA_HOA),
      BIEN_KHOA_MA_HOA,
    );
    this.khoaHmac = docKhoa(config.get<string>(BIEN_KHOA_HMAC), BIEN_KHOA_HMAC);

    if (this.khoaMaHoa && this.khoaHmac?.equals(this.khoaMaHoa)) {
      throw new Error(`${BIEN_KHOA_MA_HOA} và ${BIEN_KHOA_HMAC} phải khác nhau`);
    }
    const thieu = [
      !this.khoaMaHoa && BIEN_KHOA_MA_HOA,
      !this.khoaHmac && BIEN_KHOA_HMAC,
    ].filter(Boolean);
    if (thieu.length > 0 && process.env.SKIP_DB_CONNECT !== 'true') {
      this.logger.warn(
        `Chưa đặt ${thieu.join(', ')}: các API hồ sơ gia sư sẽ trả 500`,
      );
    }
  }

  maHoa(banRo: string): BytesDb {
    return maHoa(banRo, this.layKhoa(this.khoaMaHoa, BIEN_KHOA_MA_HOA));
  }

  giaiMa(duLieu: Uint8Array): string {
    const khoa = this.layKhoa(this.khoaMaHoa, BIEN_KHOA_MA_HOA);
    try {
      return giaiMa(duLieu, khoa);
    } catch (error) {
      this.logger.error('Giải mã thất bại', error);
      throw new InternalServerErrorException(
        `Không giải mã được dữ liệu, kiểm tra ${BIEN_KHOA_MA_HOA} có trùng với khóa đã dùng khi ghi`,
      );
    }
  }

  bamHmac(giaTri: string): BytesDb {
    return bamHmac(giaTri, this.layKhoa(this.khoaHmac, BIEN_KHOA_HMAC));
  }

  private layKhoa(khoa: Buffer | null, tenBien: string): Buffer {
    if (!khoa) {
      throw new InternalServerErrorException(
        `Máy chủ chưa cấu hình ${tenBien}`,
      );
    }
    return khoa;
  }
}
