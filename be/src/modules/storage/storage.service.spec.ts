import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { vi } from 'vitest';
import type { AuthUser } from '../../common/auth/auth-user.js';
import { VaiTro } from '../../common/enums/tai-khoan.enum.js';
import type { PrismaService } from '../../prisma/prisma.service.js';
import {
  CreateUploadUrlDto,
  KICH_THUOC_TEP_TOI_DA,
  MucDichUpload,
} from './dto/create-upload-url.dto.js';
import { CreateSignedUrlDto } from './dto/signed-url.dto.js';
import {
  StorageService,
  THOI_HAN_SIGNED_URL_GIAY,
} from './storage.service.js';

const mockCreateSignedUploadUrl = vi.fn();
const mockCreateSignedUrl = vi.fn();
const mockFrom = vi.fn(() => ({
  createSignedUploadUrl: mockCreateSignedUploadUrl,
  createSignedUrl: mockCreateSignedUrl,
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    storage: { from: mockFrom },
  })),
}));

function taoConfig(giaTri: Record<string, string | undefined>): ConfigService {
  return {
    get: (khoa: string) => giaTri[khoa],
  } as unknown as ConfigService;
}

function taoPrisma(giaSu: unknown = null) {
  const findUnique = vi.fn().mockResolvedValue(giaSu);
  return {
    prisma: { giaSu: { findUnique } } as unknown as PrismaService,
    findUnique,
  };
}

const dieuPhoi: AuthUser = {
  id: 2,
  tenDangNhap: 'dieuphoi01',
  vaiTro: VaiTro.DIEU_PHOI,
};

const giaSuUser: AuthUser = {
  id: 10,
  tenDangNhap: '0911000001',
  vaiTro: VaiTro.GIA_SU,
};

async function loiDto<T extends object>(
  cls: new () => T,
  body: unknown,
): Promise<string[]> {
  const errors = await validate(plainToInstance(cls, body), {
    whitelist: true,
    forbidNonWhitelisted: true,
  });
  return errors.map((e) => e.property);
}

describe('Storage DTOs', () => {
  it('CreateUploadUrlDto nhận tệp <= 15 MB và chặn vượt giới hạn', async () => {
    expect(
      await loiDto(CreateUploadUrlDto, {
        mucDich: MucDichUpload.CCCD_MAT_TRUOC,
        loaiTep: 'image/jpeg',
        kichThuoc: KICH_THUOC_TEP_TOI_DA,
      }),
    ).toEqual([]);

    expect(
      await loiDto(CreateUploadUrlDto, {
        mucDich: MucDichUpload.CCCD_MAT_TRUOC,
        loaiTep: 'image/jpeg',
        kichThuoc: KICH_THUOC_TEP_TOI_DA + 1,
      }),
    ).toEqual(['kichThuoc']);
  });

  it('CreateSignedUrlDto từ chối path rỗng', async () => {
    expect(await loiDto(CreateSignedUrlDto, { path: '' })).toEqual(['path']);
  });
});

describe('StorageService', () => {
  const configDu = taoConfig({
    SUPABASE_URL: 'https://demo.supabase.co',
    SUPABASE_SECRET_KEY: 'sb_secret_test_key',
    SUPABASE_STORAGE_BUCKET: 'peasy-private',
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  describe('createUploadUrl', () => {
    it('tạo đường dẫn ung-tuyen/<uuid>/cccd-mat-truoc.jpg cho ảnh CCCD', async () => {
      mockCreateSignedUploadUrl.mockImplementation((path: string) =>
        Promise.resolve({
          data: {
            path,
            signedUrl: `https://demo.supabase.co/upload/${path}`,
            token: 'tok-123',
          },
          error: null,
        }),
      );
      const service = new StorageService(configDu, taoPrisma().prisma);

      const kq = await service.createUploadUrl({
        mucDich: MucDichUpload.CCCD_MAT_TRUOC,
        loaiTep: 'image/jpeg',
        kichThuoc: 500_000,
      });

      expect(mockFrom).toHaveBeenCalledWith('peasy-private');
      expect(kq.path).toMatch(/^ung-tuyen\/[0-9a-f-]+\/cccd-mat-truoc\.jpg$/);
      expect(kq.uploadUrl).toContain(kq.path);
      expect(kq.token).toBe('tok-123');
    });

    it('cho phép PDF cho GIAY_TO_NANG_LUC nhưng từ chối PDF cho ANH_CHAN_DUNG', async () => {
      mockCreateSignedUploadUrl.mockImplementation((path: string) =>
        Promise.resolve({
          data: { path, signedUrl: 'https://demo/upload', token: 'tok' },
          error: null,
        }),
      );
      const service = new StorageService(configDu, taoPrisma().prisma);

      const kqPdf = await service.createUploadUrl({
        mucDich: MucDichUpload.GIAY_TO_NANG_LUC,
        loaiTep: 'application/pdf',
        kichThuoc: 1_000_000,
      });
      expect(kqPdf.path).toMatch(/^ung-tuyen\/[0-9a-f-]+\/giay-to\.pdf$/);

      await expect(
        service.createUploadUrl({
          mucDich: MucDichUpload.ANH_CHAN_DUNG,
          loaiTep: 'application/pdf',
          kichThuoc: 100_000,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('trả 500 rõ tên biến khi thiếu cấu hình Supabase', async () => {
      const service = new StorageService(taoConfig({}), taoPrisma().prisma);
      await expect(
        service.createUploadUrl({
          mucDich: MucDichUpload.ANH_CHAN_DUNG,
          loaiTep: 'image/png',
          kichThuoc: 100_000,
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('createSignedUrl', () => {
    it('chặn đường dẫn chứa .. hoặc ký tự đường dẫn không hợp lệ', async () => {
      const service = new StorageService(configDu, taoPrisma().prisma);
      for (const path of ['../bi-mat.jpg', '/etc/passwd', 'a\\b.jpg']) {
        await expect(
          service.createSignedUrl({ path }, dieuPhoi),
        ).rejects.toThrow(BadRequestException);
      }
    });

    it('DIEU_PHOI xem được mọi tệp hồ sơ với thời hạn 300 giây', async () => {
      mockCreateSignedUrl.mockResolvedValue({
        data: { signedUrl: 'https://demo.supabase.co/signed/1' },
        error: null,
      });
      const { prisma, findUnique } = taoPrisma();
      const service = new StorageService(configDu, prisma);

      const kq = await service.createSignedUrl(
        { path: 'ung-tuyen/abc/cccd-mat-truoc.jpg' },
        dieuPhoi,
      );

      expect(kq).toEqual({
        url: 'https://demo.supabase.co/signed/1',
        expiresIn: THOI_HAN_SIGNED_URL_GIAY,
      });
      expect(mockCreateSignedUrl).toHaveBeenCalledWith(
        'ung-tuyen/abc/cccd-mat-truoc.jpg',
        THOI_HAN_SIGNED_URL_GIAY,
      );
      expect(findUnique).not.toHaveBeenCalled();
    });

    it('GIA_SU xem được tệp của mình nhưng bị 403 khi xem tệp người khác', async () => {
      mockCreateSignedUrl.mockResolvedValue({
        data: { signedUrl: 'https://demo.supabase.co/signed/mine' },
        error: null,
      });
      const { prisma } = taoPrisma({
        anhCccdMatTruoc: 'ung-tuyen/a/cccd-mat-truoc.jpg',
        anhCccdMatSau: 'ung-tuyen/a/cccd-mat-sau.jpg',
        anhChanDung: 'ung-tuyen/a/chan-dung.jpg',
        hoSoNangLuc: [{ tep: 'ung-tuyen/a/giay-to.pdf' }],
      });
      const service = new StorageService(configDu, prisma);

      const kq = await service.createSignedUrl(
        { path: 'ung-tuyen/a/giay-to.pdf' },
        giaSuUser,
      );
      expect(kq.url).toBe('https://demo.supabase.co/signed/mine');

      await expect(
        service.createSignedUrl(
          { path: 'ung-tuyen/nguoi-khac/cccd-mat-truoc.jpg' },
          giaSuUser,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('trả 404 khi tệp không tồn tại trên Storage (vd. đường dẫn giả từ seed)', async () => {
      mockCreateSignedUrl.mockResolvedValue({
        data: null,
        error: { message: 'Object not found' },
      });
      const service = new StorageService(configDu, taoPrisma().prisma);

      await expect(
        service.createSignedUrl(
          { path: 'seed/gia-su/GS00001/chan-dung.jpg' },
          dieuPhoi,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
