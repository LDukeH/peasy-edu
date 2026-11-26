import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AuthUser } from '../../common/auth/auth-user.js';
import { VaiTro } from '../../common/enums/tai-khoan.enum.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  type CreateUploadUrlDto,
  KICH_THUOC_TEP_TOI_DA,
  MucDichUpload,
  type UploadUrlResponseDto,
} from './dto/create-upload-url.dto.js';
import type {
  CreateSignedUrlDto,
  SignedUrlResponseDto,
} from './dto/signed-url.dto.js';

const BIEN_SUPABASE_URL = 'SUPABASE_URL';
const BIEN_SUPABASE_SECRET_KEY = 'SUPABASE_SECRET_KEY';
const BIEN_SUPABASE_BUCKET = 'SUPABASE_STORAGE_BUCKET';
const BUCKET_MAC_DINH = 'peasy-private';

const MIME_ANH: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const MIME_GIAY_TO: Record<string, string> = {
  ...MIME_ANH,
  'application/pdf': 'pdf',
};

const TEN_TEP_THEO_MUC_DICH: Record<MucDichUpload, string> = {
  [MucDichUpload.CCCD_MAT_TRUOC]: 'cccd-mat-truoc',
  [MucDichUpload.CCCD_MAT_SAU]: 'cccd-mat-sau',
  [MucDichUpload.ANH_CHAN_DUNG]: 'chan-dung',
  [MucDichUpload.GIAY_TO_NANG_LUC]: 'giay-to',
};

/** Thời hạn Signed URL xem ảnh/giấy tờ nhạy cảm: 5 phút. */
export const THOI_HAN_SIGNED_URL_GIAY = 300;

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly supabase: SupabaseClient | null;
  private readonly bucket: string;
  /** Đồng bộ giới hạn 15 MB & MIME lên bucket một lần mỗi tiến trình trước khi cấp URL upload. */
  private dongBoBucket: Promise<void> | null = null;

  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const url = config.get<string>(BIEN_SUPABASE_URL)?.trim();
    const secretKey = config.get<string>(BIEN_SUPABASE_SECRET_KEY)?.trim();
    this.bucket =
      config.get<string>(BIEN_SUPABASE_BUCKET)?.trim() || BUCKET_MAC_DINH;

    if (url && secretKey) {
      this.supabase = createClient(url, secretKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
    } else {
      this.supabase = null;
      const thieu = [
        !url && BIEN_SUPABASE_URL,
        !secretKey && BIEN_SUPABASE_SECRET_KEY,
      ].filter(Boolean);
      if (process.env.SKIP_DB_CONNECT !== 'true') {
        this.logger.warn(
          `Chưa đặt ${thieu.join(', ')}: các API storage sẽ trả 500`,
        );
      }
    }
  }

  async createUploadUrl(dto: CreateUploadUrlDto): Promise<UploadUrlResponseDto> {
    const loaiTep = dto.loaiTep.trim().toLowerCase();
    const bangMime =
      dto.mucDich === MucDichUpload.GIAY_TO_NANG_LUC ? MIME_GIAY_TO : MIME_ANH;
    const duoiTep = bangMime[loaiTep];
    if (!duoiTep) {
      throw new BadRequestException(
        `Định dạng tệp không được hỗ trợ cho ${dto.mucDich}: ${dto.loaiTep}`,
      );
    }

    const client = this.layClient();
    await this.damBaoGioiHanBucket(client);

    const path = `ung-tuyen/${randomUUID()}/${TEN_TEP_THEO_MUC_DICH[dto.mucDich]}.${duoiTep}`;
    const { data, error } = await client.storage
      .from(this.bucket)
      .createSignedUploadUrl(path);

    if (error || !data) {
      this.logger.error('Không tạo được Presigned Upload URL', error);
      throw new InternalServerErrorException(
        'Không tạo được đường dẫn tải tệp lên Storage',
      );
    }

    return {
      path: data.path,
      uploadUrl: data.signedUrl,
      token: data.token,
    };
  }

  async createSignedUrl(
    dto: CreateSignedUrlDto,
    user: AuthUser,
  ): Promise<SignedUrlResponseDto> {
    const path = dto.path.trim();
    if (
      !path ||
      path.includes('..') ||
      path.startsWith('/') ||
      path.includes('\\')
    ) {
      throw new BadRequestException('Đường dẫn tệp không hợp lệ');
    }

    if (user.vaiTro === VaiTro.GIA_SU) {
      await this.kiemTraQuyenGiaSu(user.id, path);
    }

    const { data, error } = await this.layClient()
      .storage.from(this.bucket)
      .createSignedUrl(path, THOI_HAN_SIGNED_URL_GIAY);

    if (error || !data) {
      const maTrangThai = (error as { statusCode?: string | number } | null)
        ?.statusCode;
      const thongDiep = error?.message?.toLowerCase() ?? '';
      if (
        maTrangThai === '404' ||
        maTrangThai === 404 ||
        thongDiep.includes('not found')
      ) {
        throw new NotFoundException('Không tìm thấy tệp trên Storage');
      }
      this.logger.error('Không tạo được Signed URL', error);
      throw new InternalServerErrorException(
        'Không tạo được đường dẫn xem tệp',
      );
    }

    return {
      url: data.signedUrl,
      expiresIn: THOI_HAN_SIGNED_URL_GIAY,
    };
  }

  private async kiemTraQuyenGiaSu(
    taiKhoanId: number,
    path: string,
  ): Promise<void> {
    const giaSu = await this.prisma.giaSu.findUnique({
      where: { taiKhoanId },
      select: {
        anhCccdMatTruoc: true,
        anhCccdMatSau: true,
        anhChanDung: true,
        hoSoNangLuc: { select: { tep: true } },
      },
    });
    const cacTepCuaMinh = new Set(
      [
        giaSu?.anhCccdMatTruoc,
        giaSu?.anhCccdMatSau,
        giaSu?.anhChanDung,
        ...(giaSu?.hoSoNangLuc.map((hoSo) => hoSo.tep) ?? []),
      ].filter(Boolean),
    );
    if (!cacTepCuaMinh.has(path)) {
      throw new ForbiddenException('Bạn không có quyền xem tệp này');
    }
  }

  /**
   * Ép giới hạn 15 MB, private và danh sách MIME ở tầng bucket Supabase để
   * client không thể lách bằng cách gửi kichThuoc nhỏ rồi PUT tệp lớn hơn.
   * Lưu ý MVP: bucket cho phép hợp của cả 4 MIME (jpeg/png/webp/pdf), nên
   * phân biệt MIME riêng theo từng mucDich chỉ kiểm ở bước khai báo.
   */
  private damBaoGioiHanBucket(client: SupabaseClient): Promise<void> {
    if (!this.dongBoBucket) {
      this.dongBoBucket = client.storage
        .updateBucket(this.bucket, {
          public: false,
          fileSizeLimit: KICH_THUOC_TEP_TOI_DA,
          allowedMimeTypes: Object.keys(MIME_GIAY_TO),
        })
        .then(({ error }) => {
          if (error) {
            this.dongBoBucket = null;
            this.logger.error('Không đồng bộ được giới hạn bucket Storage', error);
            throw new InternalServerErrorException(
              'Không cấu hình được giới hạn tải tệp trên Storage',
            );
          }
        })
        .catch((err) => {
          this.dongBoBucket = null;
          throw err;
        });
    }
    return this.dongBoBucket;
  }

  private layClient(): SupabaseClient {
    if (!this.supabase) {
      throw new InternalServerErrorException(
        `Máy chủ chưa cấu hình ${BIEN_SUPABASE_URL} hoặc ${BIEN_SUPABASE_SECRET_KEY}`,
      );
    }
    return this.supabase;
  }
}
