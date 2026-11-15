import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // Khi chạy openapi:export hoặc trên CI không có DB thật thì bỏ qua kết nối
    if (process.env.SKIP_DB_CONNECT === 'true') return;
    await this.$connect();
  }

  async onModuleDestroy() {
    if (process.env.SKIP_DB_CONNECT === 'true') return;
    await this.$disconnect();
  }
}
