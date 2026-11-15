import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Đang nạp dữ liệu mẫu (seed)...');
  // W1-BE1 sẽ thêm code tạo 4 vai trò, tài khoản mẫu và danh mục môn học tại đây
  console.log('Seed hoàn tất!');
}

main()
  .catch((e) => {
    console.error('Lỗi khi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
