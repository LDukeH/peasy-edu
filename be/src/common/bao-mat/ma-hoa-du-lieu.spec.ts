import { randomBytes } from 'node:crypto';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import {
  bamHmac,
  cheCccd,
  cheSoTaiKhoan,
  docKhoa,
  giaiMa,
  maHoa,
} from './ma-hoa-du-lieu.js';
import { MaHoaDuLieuService } from './ma-hoa-du-lieu.service.js';

const khoa = randomBytes(32);
const khoaKhac = randomBytes(32);

describe('ma-hoa-du-lieu', () => {
  it('mã hóa rồi giải mã ra đúng bản rõ, mỗi lần mã hóa cho bản mã khác nhau', () => {
    const a = maHoa('079200001042', khoa);
    const b = maHoa('079200001042', khoa);
    expect(Buffer.from(a).equals(Buffer.from(b))).toBe(false);
    expect(Buffer.from(a).includes(Buffer.from('079200001042'))).toBe(false);
    expect(giaiMa(a, khoa)).toBe('079200001042');
    expect(giaiMa(b, khoa)).toBe('079200001042');
  });

  it('sai khóa hoặc bản mã bị sửa thì từ chối, không trả dữ liệu rác', () => {
    const banMa = maHoa('{"soTaiKhoan":"0123456789"}', khoa);
    expect(() => giaiMa(banMa, khoaKhac)).toThrow();
    const biSua = Buffer.from(banMa);
    biSua[biSua.length - 1] ^= 0xff;
    expect(() => giaiMa(biSua, khoa)).toThrow();
    expect(() => giaiMa(new Uint8Array([9, 9, 9]), khoa)).toThrow(
      'Bản mã không đúng định dạng',
    );
  });

  it('HMAC cố định cho cùng CCCD (dùng làm cột unique), khác khóa thì khác', () => {
    const h1 = Buffer.from(bamHmac('079200001042', khoa));
    expect(h1.equals(Buffer.from(bamHmac('079200001042', khoa)))).toBe(true);
    expect(h1.equals(Buffer.from(bamHmac('079200001043', khoa)))).toBe(false);
    expect(h1.equals(Buffer.from(bamHmac('079200001042', khoaKhac)))).toBe(
      false,
    );
  });

  it('đọc khóa base64 32 byte; chưa đặt → null; sai độ dài → lỗi', () => {
    expect(docKhoa(undefined, 'K')).toBeNull();
    expect(docKhoa('  ', 'K')).toBeNull();
    expect(docKhoa(khoa.toString('base64'), 'K')?.equals(khoa)).toBe(true);
    expect(() => docKhoa(randomBytes(16).toString('base64'), 'K')).toThrow(
      'K phải là chuỗi base64 của đúng 32 byte',
    );
  });

  it('che CCCD giữ 3 số đầu và 3 số cuối, che STK giữ 4 số cuối', () => {
    expect(cheCccd('079200001042')).toBe('079******042');
    expect(cheSoTaiKhoan('0123456789')).toBe('******6789');
    expect(cheSoTaiKhoan('1234')).toBe('****');
  });
});

describe('MaHoaDuLieuService', () => {
  beforeEach(() => {
    vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });
  afterEach(() => vi.restoreAllMocks());

  const taoService = (bien: Record<string, string | undefined>) =>
    new MaHoaDuLieuService({
      get: (ten: string) => bien[ten],
    } as unknown as ConfigService);

  it('dùng khóa từ biến môi trường', () => {
    const service = taoService({
      DATA_ENCRYPTION_KEY: khoa.toString('base64'),
      DATA_HMAC_KEY: khoaKhac.toString('base64'),
    });
    expect(service.giaiMa(service.maHoa('abc'))).toBe('abc');
    expect(
      Buffer.from(service.bamHmac('abc')).equals(
        Buffer.from(bamHmac('abc', khoaKhac)),
      ),
    ).toBe(true);
  });

  it('thiếu khóa: không sập lúc khởi động, chỉ thao tác cần khóa trả 500', () => {
    const service = taoService({});
    expect(() => service.maHoa('abc')).toThrow(InternalServerErrorException);
    expect(() => service.bamHmac('abc')).toThrow('DATA_HMAC_KEY');
  });

  it('không cho hai khóa trùng nhau', () => {
    expect(() =>
      taoService({
        DATA_ENCRYPTION_KEY: khoa.toString('base64'),
        DATA_HMAC_KEY: khoa.toString('base64'),
      }),
    ).toThrow('phải khác nhau');
  });

  it('giải mã sai khóa → 500 có hướng dẫn kiểm tra khóa', () => {
    const service = taoService({
      DATA_ENCRYPTION_KEY: khoa.toString('base64'),
      DATA_HMAC_KEY: khoaKhac.toString('base64'),
    });
    expect(() => service.giaiMa(maHoa('abc', khoaKhac))).toThrow(
      InternalServerErrorException,
    );
  });
});
