import { Prisma } from '@prisma/client';

export function maLoiPrisma(error: unknown): string | undefined {
  return error instanceof Prisma.PrismaClientKnownRequestError
    ? error.code
    : undefined;
}

/** Tên các trường gây lỗi trùng P2002 (Prisma trả mảng trường hoặc tên index). */
export function truongBiTrung(error: unknown): string[] {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return [];
  const target = error.meta?.target;
  if (Array.isArray(target)) return target.map(String);
  return typeof target === 'string' ? target.split('_').slice(1, -1) : [];
}
