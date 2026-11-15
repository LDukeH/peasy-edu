import { copyFileSync, existsSync } from "fs";
import { execSync } from "child_process";

const envs = [
  ["be/.env.example", "be/.env"],
  ["fe/.env.example", "fe/.env.local"],
];

for (const [src, dest] of envs) {
  if (existsSync(src) && !existsSync(dest)) {
    copyFileSync(src, dest);
    console.log(`Đã tạo ${dest} từ ${src}`);
  }
}

console.log("📦 Đang cài đặt dependencies...");
execSync("npm install", { stdio: "inherit" });

console.log("⚙️ Đang sinh Prisma Client...");
execSync("npm run db:generate", { stdio: "inherit" });

if (existsSync("openapi.json")) {
  console.log(" Đang sinh API hooks & MSW mocks từ openapi.json...");
  execSync("npm run gen:api", { stdio: "inherit" });
}

console.log(" Hoàn tất thiết lập! Xem hướng dẫn lệnh chạy trong README.md.");
