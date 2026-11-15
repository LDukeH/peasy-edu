# 🎓 Peasy Edu (MVP) — Hướng dẫn dành cho thành viên dự án

Dự án **Peasy Edu** sử dụng mô hình **Monorepo** (`npm workspaces`) kết hợp quy trình **Contract-First (OpenAPI + Orval + MSW)** để đội **Frontend (FE)** và **Backend (BE)** có thể làm việc song song mà không phải chờ đợi nhau.

---

## 1. Công nghệ & Cấu trúc thư mục

### Tech Stack
- **Monorepo:** npm Workspaces (`Node.js v24.20.0`)
- **Backend (`be/`):** NestJS 12, Prisma 6 (PostgreSQL / Supabase), Swagger (`@nestjs/swagger`), JWT Cookie Auth, Vitest, Oxlint.
- **Frontend (`fe/`):** Next.js 16 (App Router + Turbopack), React 19, Tailwind CSS v4, TanStack Query v5, Axios, Zustand, Orval v8, MSW v3 (Mock Service Worker).

### Cấu trúc thư mục chính
```text
peasy-edu/
├── be/                         # Workspace Backend (NestJS)
│   ├── prisma/                 # Schema Prisma (schema.prisma), migrations & seed.ts
│   └── src/
│       ├── swagger.config.ts   # Cấu hình Swagger & quy tắc đặt tên hook (operationIdFactory)
│       ├── export-openapi.ts   # Script xuất openapi.json không cần kết nối DB
│       └── ...                 # Modules, Controllers, Services, DTOs
├── fe/                         # Workspace Frontend (Next.js)
│   ├── orval.config.ts         # Cấu hình Orval sinh React Query hooks + MSW mocks
│   └── src/
│       ├── api/
│       │   ├── generated/      # ⚠️ CODE TỰ SINH (Hooks, Models, MSW mocks) - KHÔNG SỬA TAY!
│       │   └── mutator/        # Custom Axios instance (tự động đính kèm cookie & refresh token)
│       ├── mocks/              # Cấu hình MSW Service Worker chạy trên trình duyệt
│       └── app/                # Next.js App Router pages & layouts
├── scripts/
│   └── setup.mjs               # Script tự động thiết lập môi trường lần đầu
├── openapi.json                # 📄 Bản hợp đồng API (Single Source of Truth giữa BE và FE)
└── package.json                # Chứa các script điều khiển toàn bộ monorepo
```

---

## 2. Cài đặt lần đầu (Sau khi `git clone`)

### Yêu cầu hệ thống
- **Node.js:** `v24.20.0` (khuyến khích dùng `nvm use` hoặc `fnm use` vì dự án có sẵn file `.nvmrc`).
- **npm:** đi kèm theo Node.js.

### Bước 1: Chạy lệnh khởi tạo tự động
Tại thư mục gốc (`peasy-edu/`), chạy lệnh:

```bash
npm run setup
```

> **Lệnh `npm run setup` tự động làm những gì?**
> 1. Copy `be/.env.example` $\rightarrow$ `be/.env` và `fe/.env.example` $\rightarrow$ `fe/.env.local` (nếu chưa tồn tại).
> 2. Chạy `npm install` cho toàn bộ monorepo (`be` và `fe`).
> 3. Chạy `npm run db:generate` để sinh Prisma Client cho BE.
> 4. Chạy `npm run gen:api` để sinh sẵn bộ React Query hooks và MSW mocks từ `openapi.json` cho FE.

### Bước 2: Cập nhật biến môi trường (`.env`)

#### Dành cho Backend (`be/.env`)
Mở file `be/.env` và điền chuỗi kết nối Supabase PostgreSQL của nhóm:
```env
PORT=4000
FRONTEND_URL=http://localhost:3000

# Port 6543 (Transaction Pooler) dùng cho truy vấn của ứng dụng
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
# Port 5432 (Session Pooler) dùng khi chạy prisma migrate
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

JWT_ACCESS_SECRET="dev-access-secret-change-me"
JWT_REFRESH_SECRET="dev-refresh-secret-change-me"
```

#### Dành cho Frontend (`fe/.env.local`)
Mở file `fe/.env.local`:
```env
# "true" = Bật MSW Mock (dùng khi BE chưa code xong logic, từ Thứ 3 -> Thứ 5)
# "false" = Tắt Mock, gọi thẳng API thật của BE (dùng khi tích hợp vào Thứ 6)
NEXT_PUBLIC_API_MOCKING="true"

# URL của Backend (Next.js sẽ tự proxy mọi request /api/* sang địa chỉ này)
BACKEND_URL="http://localhost:4000"
```

---

## 3. Bảng lệnh thường dùng (Chạy ở thư mục gốc)

Tất cả các lệnh dưới đây đều được chạy tại **thư mục gốc (`peasy-edu/`)**:

| Lệnh | Tác dụng | Ai dùng |
| :--- | :--- | :---: |
| `npm run setup` | Cài đặt lần đầu hoặc đồng bộ lại toàn bộ môi trường sau khi pull code lớn | Cả hai |
| `npm run dev:fe` | Chạy Frontend tại `http://localhost:3000` | **FE** |
| `npm run gen:api` | Đọc `openapi.json` $\rightarrow$ Sinh lại React Query hooks + TypeScript types + MSW mocks | **FE** |
| `npm run dev:be` | Chạy Backend tại `http://localhost:4000` (Swagger UI: `http://localhost:4000/api/docs`) | **BE** |
| `npm run openapi:export` | Build BE & xuất file `openapi.json` từ Controller/DTO (không cần kết nối DB) | **BE** |
| `npm run contract:sync` | Chạy gộp `openapi:export` + `gen:api` (kiểm tra nhanh từ BE sang FE) | Cả hai |
| `npm run db:generate` | Sinh lại `@prisma/client` sau khi `schema.prisma` thay đổi | **BE** |
| `npm run db:migrate` | Tạo file migration mới & áp dụng lên DB (**Chỉ 1 người BE giữ lượt chạy mỗi tuần**) | **BE** |
| `npm run db:deploy` | Áp dụng các migration đã có sẵn (**Dùng cho bạn BE còn lại sau khi pull code**) | **BE** |
| `npm run db:seed` | Nạp dữ liệu mẫu (`be/prisma/seed.ts`) vào Database | **BE** |
| `npm run test:be` | Chạy Unit Test của Backend bằng Vitest | **BE** |
| `npm run build:all` | Kiểm tra build cả Backend và Frontend (giống bước kiểm tra trên CI) | Cả hai |

---

## 4. Quy trình phối hợp hàng tuần (Contract-First Workflow)

Để FE không bao giờ phải đợi BE viết xong API mới làm giao diện được, nhóm làm việc theo luồng **Contract-First** như sau:

```mermaid
flowchart LR
    A["1. BE viết Controller + DTO\n(Có @ApiProperty & @ApiResponse)"] --> B["2. BE chạy\nnpm run openapi:export"]
    B --> C["3. BE commit & push\nopenapi.json"]
    C --> D["4. FE git pull &\nchạy npm run gen:api"]
    D --> E["5. FE dùng Hook tự sinh\n+ MSW Mock tự động"]
    E --> F["6. Thứ 6: Tắt MSW Mock\nNối API thật"]
```

### Chi tiết từng bước:

#### Giai đoạn 1: Chốt Contract (Đầu tuần / Thứ 2 - Thứ 3)
1. **BE** tạo Controller và DTO cho tính năng trong tuần (chưa cần viết logic nghiệp vụ phức tạp trong Service, chỉ cần định nghĩa rõ input/output DTO).
2. **BE** gắn đầy đủ decorator của `@nestjs/swagger` trong DTO (`@ApiProperty({ example: ... })`) và Controller (`@ApiOkResponse({ type: ... })` hoặc dùng Swagger CLI plugin).
3. **BE** chạy lệnh xuất bản hợp đồng API:
   ```bash
   npm run openapi:export
   ```
4. **BE** kiểm tra file `openapi.json` đã cập nhật, sau đó commit và push nhánh `contract/*` (hoặc tạo PR vào `dev`).

#### Giai đoạn 2: Phát triển song song (Thứ 3 - Thứ 5)
- **Phía FE:**
  1. Pull code mới nhất có chứa `openapi.json` về máy.
  2. Chạy lệnh sinh code:
     ```bash
     npm run gen:api
     ```
  3. Orval sẽ tự động tạo ra:
     - **React Query Hooks** trong `fe/src/api/generated/peasyApi.ts` (ví dụ: `useTutorsFindAll`, `useAuthLogin`, v.v.).
     - **TypeScript Interfaces** trong `fe/src/api/generated/model/`.
     - **MSW Mock Handlers** trong `fe/src/api/generated/peasyApi.msw.ts` (tự sinh dữ liệu giả bằng `@faker-js/faker` dựa theo kiểu dữ liệu trong DTO).
  4. Giữ `NEXT_PUBLIC_API_MOCKING="true"` trong `fe/.env.local`, chạy `npm run dev:fe` và ráp trực tiếp các hook vào giao diện mà **không cần bật server BE**.
- **Phía BE:**
  - Tiếp tục hoàn thiện logic trong Service, truy vấn Prisma, viết Unit Test (`npm run test:be`).

#### Giai đoạn 3: Tích hợp API thật (Thứ 6)
1. Chạy đồng thời cả BE (`npm run dev:be`) và FE (`npm run dev:fe`).
2. Trong `fe/.env.local`, đổi:
   ```env
   NEXT_PUBLIC_API_MOCKING="false"
   ```
3. Khởi động lại FE. Lúc này mọi request `/api/*` từ FE sẽ đi qua Next.js Rewrites (`fe/next.config.ts`) sang thẳng `http://localhost:4000/api/*` của BE (đã cấu hình sẵn gửi kèm `httpOnly` Cookie và tự động Refresh Token khi gặp lỗi `401` trong `fe/src/api/mutator/custom-instance.ts`).

---

## 5. Quy tắc quản lý Database & Prisma (Dành cho BE)

Vì nhóm dùng chung Database PostgreSQL (Supabase) hoặc chia sẻ lịch sử migration trong `be/prisma/migrations`, hãy tuân thủ nghiêm ngặt quy tắc sau để tránh lỗi lệch lịch sử migration (Drift):

1. **Mỗi tuần chỉ 1 người BE phụ trách sửa `schema.prisma` và tạo migration** (theo lịch phân công vào Thứ Hai):
   - Sửa file `be/prisma/schema.prisma`.
   - Chạy `npm run db:migrate` $\rightarrow$ đặt tên migration rõ ràng (ví dụ: `add_booking_table`).
   - Commit cả `be/prisma/schema.prisma` và thư mục `be/prisma/migrations/*` lên Git.
2. **Bạn BE còn lại (không giữ lượt tạo migration):**
   - Sau khi `git pull` code mới về, **TUYỆT ĐỐI KHÔNG** chạy `npm run db:migrate`.
   - Chỉ chạy:
     ```bash
     npm run db:deploy
     npm run db:generate
     ```
3. **Khi chỉ kéo code mới mà có thay đổi Prisma Schema:** luôn chạy `npm run db:generate` để cập nhật kiểu dữ liệu trong `@prisma/client`.

---

## 6. ⚠️ Các quy tắc bắt buộc (Đọc kỹ để không làm gãy CI)

1. **KHÔNG BAO GIỜ sửa tay các file trong `fe/src/api/generated/`:**
   - Mọi chỉnh sửa trong thư mục này sẽ bị **xóa sạch** mỗi khi chạy `npm run gen:api` (do cấu hình `clean: true` trong `fe/orval.config.ts`).
   - Nếu cần đổi kiểu dữ liệu hoặc tên trường, hãy nhờ BE sửa trong DTO rồi chạy lại `npm run contract:sync`.
2. **Bắt buộc chạy `npm run openapi:export` trước khi push code BE có sửa Controller/DTO:**
   - GitHub Actions CI (`.github/workflows/ci.yml`) có bước kiểm tra tự động: CI sẽ chạy `npm run openapi:export` và so sánh với file `openapi.json` trong commit. Nếu bạn sửa DTO/Controller mà quên xuất lại `openapi.json`, **PR sẽ bị đánh rớt (fail CI) ngay lập tức**.
3. **Không đổi tên `.setTitle('Peasy Edu API')` trong `be/src/swagger.config.ts`:**
   - Orval dựa vào đúng chuỗi `'Peasy Edu API'` để đặt tên hàm mock là `getPeasyEduAPIMock()` được import trong `fe/src/mocks/browser.ts`. Nếu đổi Title, FE sẽ bị lỗi biên dịch.
4. **Quy tắc đặt tên hàm trong Controller (BE) để tên Hook trên FE đẹp và dễ hiểu:**
   - Trong `be/src/swagger.config.ts`, dự án đã cấu hình `operationIdFactory`:
     - Nếu `TutorsController` có hàm `findAll()` $\rightarrow$ Orval sinh hook `useTutorsFindAll()`.
     - Nếu `TutorsController` có hàm bắt đầu sẵn bằng tên controller như `tutorsCreate()` $\rightarrow$ Orval giữ nguyên `useTutorsCreate()` (không bị lặp thành `useTutorsTutorsCreate`).

---

## 7. Xử lý lỗi thường gặp (Troubleshooting)

- **Lỗi FE không tìm thấy module `@/api/generated/...` khi mới clone về:**
  - Chạy `npm run gen:api` (hoặc `npm run setup`) để Orval sinh thư mục `fe/src/api/generated`.
- **Lỗi BE báo thiếu kiểu dữ liệu trong `@prisma/client`:**
  - Chạy `npm run db:generate`.
- **FE gọi API vẫn trả về dữ liệu ngẫu nhiên (Faker) dù đã bật BE:**
  - Kiểm tra `fe/.env.local` xem `NEXT_PUBLIC_API_MOCKING` đã đổi thành `"false"` chưa, sau đó tắt và bật lại `npm run dev:fe`.
- **CI báo lỗi `❌ Bạn quên chạy 'npm run openapi:export' trước khi commit DTO!`:**
  - Tại máy local, chạy `npm run openapi:export`, sau đó `git add openapi.json`, commit và push lại.
