# 📋 Ghi chú & Nhắc nhở phối hợp từ các Pull Request

Tài liệu tập trung các **lưu ý giao cắt giữa các thành viên** được trích từ mô tả và review của từng Pull Request, sắp xếp theo **Tuần → Bên (`FE` / `BE` / `NỀN`) → Mã Task đích** để mỗi thành viên khi bắt đầu task của mình có thể mở đúng mục cần đọc.

> **Cách dùng:**
> - Khi mở hoặc review PR có điểm ảnh hưởng đến task khác, thêm dòng `- [ ] ...` vào đúng **Tuần & Mã Task đích** kèm nguồn `(từ PR #<số>)`.
> - Khi đã xác nhận hoặc xử lý xong, đổi `- [ ]` thành `- [x]` và ghi chú PR/commit đã xử lý.

### Mục lục nhanh
- [Tuần 1 (16–22/11)](#-tuần-1-162211)
- [Tuần 2 (23–29/11)](#-tuần-2-232911) — [FE](#-fe) · [BE](#️-be) · [Hạ tầng / Nền](#-hạ-tầng--nền)
- [Tuần 3 (30/11–06/12)](#-tuần-3-30110612) — [BE](#️-be-1)
- [Quy ước chung & Backlog](#-quy-ước-chung--backlog-cả-nhóm)
- [Nguồn PR đã tổng hợp](#-nguồn-pr-đã-tổng-hợp)

---

## 📅 Tuần 1 (16–22/11)

*(Chưa có ghi chú tồn đọng từ các PR Tuần 1.)*

---

## 📅 Tuần 2 (23–29/11)

### 🎨 FE

#### `W2-FE1` — Ứng tuyển & Duyệt Hồ sơ Gia sư *(Nam)*
- [ ] **Form ứng tuyển (`POST /api/tutors/apply`)** *(từ PR #10)*:
  - Thêm ô `matKhau` (8–72 ký tự) để BE tạo luôn tài khoản ứng viên (`tenDangNhap = soDienThoai`, không tự đăng nhập).
  - Tách mục "Trường / chuyên ngành" thành 3 trường bắt buộc riêng biệt: `truongDaoTao`, `chuyenNganh`, `nienKhoa` (khớp Prisma schema).
  - Chọn môn dạy từ danh mục `/api/subjects` kèm mảng cấp học (`capHoc`).
  - Lịch rảnh nhập theo `thu` (`1` = Thứ Hai … `7` = Chủ nhật) + giờ `HH:mm` (`gioBatDau`, `gioKetThuc`).
  - Mỗi giấy tờ năng lực (`hoSoNangLuc`) cần đủ 5 trường bắt buộc: `loai`, `ten`, `noiCap`, `ngayCap`, `tep` (`ngayHetHan` tùy chọn).
- [ ] **Upload tệp khi ứng tuyển** *(từ PR #10)*: Ảnh CCCD (2 mặt), ảnh chân dung và giấy tờ phải tải lên qua API upload (`W2-NỀN`) trước rồi gửi đường dẫn vào form.

#### `W2-FE2` — Không gian Gia sư: Hồ sơ & Lịch rảnh *(Nam)*
- [ ] **Đổi hình thức dạy sang `ONLINE` (`PATCH /api/tutors/:id`)** *(review PR #10)*: Không gửi `khuVucNhanDay: []` vì DTO hiện có `@ArrayMinSize(1)` sẽ trả `400` (nên bỏ qua trường này khi đổi sang `ONLINE`, trừ khi BE mở lại rule).

---

### ⚙️ BE

#### `W2-C2` — Contract: Phụ huynh, Học viên & Yêu cầu *(Tuấn)*
- [x] **Tái sử dụng Enum `GioiTinh`** *(từ PR #10)*: Import `GioiTinh` (`NAM`, `NU`) từ `be/src/common/enums/gia-su.enum.ts` cho Học viên để tránh sinh 2 schema trùng tên trong `openapi.json`.

- [x] **Contract W2-C2**: 15 operation trên 9 path `/api/parents`, `/api/students`, `/api/requests`; controller hiện chỉ ném `501 Not Implemented`, không có service/business logic/Prisma mới.
- [ ] **BE logic — Hai luồng tạo YC**: Public `POST /requests/submit` nhận `{ dangKy, nhuCau }`; discriminator `dangKy.loaiDangKy` là `PHU_HUYNH` hoặc `BAN_THAN`. Tạo nguyên tử tài khoản/hồ sơ/YC MOI, không tự đăng nhập. SĐT trùng tài khoản hoặc hồ sơ PH trả 409, không tự ghép dữ liệu. Private `POST /requests` dùng `nguoiThanhToanId`, 1–4 `hocVienIds` và `nhuCau`; mọi HV cùng một người thanh toán. BAN_THAN từ đủ 18 tuổi, tài khoản quyền PHU_HUYNH gắn HV, chỉ học cho bản thân, không tạo hồ sơ PH giả.
- [ ] **BE logic — Quyền sở hữu & metadata**: QUAN_LY chỉ xem, DIEU_PHOI thao tác, PH chỉ dữ liệu mình/con; list/create phải kiểm tra theo tài khoản, không tin ID body/query. PH chỉ hủy YC, không chuyển tiến; PH gửi kênh/NV phụ trách trong create trả 403. Guard hiện có trả 403 cho PH cả khi ID không tồn tại; NV/QL có thể nhận 404. Thời điểm, mã, tài khoản do server quản lý. Không expose ghi chú PH nội bộ qua response chung.
- [ ] **BE logic — Tiếp nhận công khai**: Kênh WEBSITE, tự gán DIEU_PHOI đang hoạt động có id nhỏ nhất; không có người nhận trả 409, không tạo dở dữ liệu. PH consent ghi thời điểm ở hồ sơ; BAN_THAN ghi sự kiện đồng ý vào NhatKyThayDoi hiện có. Kiểm tra tuổi/đồng thuận, payer XOR, quan hệ HV, môn đang sử dụng/đúng cấp, địa chỉ tại nhà và giờ/chồng giờ thuộc task logic sau.
- [ ] **BE logic & FE — Trạng thái**: Read/filter đủ 7 giá trị Prisma; update chỉ nhận DA_TU_VAN/DANG_TIM_GS/HUY. Điều phối chuyển MOI → DA_TU_VAN → DANG_TIM_GS; PH sở hữu/điều phối hủy từ ba trạng thái đầu, bắt buộc lý do. Nhảy bước/quay ngược/lặp cùng trạng thái/mở lại HUY hoặc nguồn giai đoạn sau trả 409. Đích sai hoặc lý do sai trả 400; PH chuyển tiến trả 403. Sửa nhu cầu chỉ ở ba trạng thái đầu.
- [x] **FE — Payload PATCH & nullable**: `PATCH /requests/:id` nhận `{ nhuCau?: { ...trường cần sửa }, nhanVienPhuTrachId? }`. Không gửi nhu cầu ở root. Trường bắt buộc không nhận null khi PATCH; trường nullable được phép xóa bằng null. Backend kiểm tra địa chỉ trên dữ liệu sau merge. Date input chỉ YYYY-MM-DD, từ chối timestamp và ngày lịch không tồn tại.
- [x] **Swagger & Orval**: Đã chạy `openapi:export` và `contract:sync`, sinh được hooks/models/MSW cho 15 operation; union đăng ký giữ literal riêng từng nhánh. Không dùng enumName kế thừa từ base cho literal subtype vì có thể ghi đè schema dùng chung. `fe/src/api/generated/` đang Git-ignore: đầu ra local được xác minh, không commit/force-add và không sửa tay.
- [x] **Review validation**: Chặn phần tử mảng lồng thay vì object, chọn subtype an toàn trước ValidationPipe, dùng allowlist PickType cho public profiles, đóng schema hai nhánh để không nhận dữ liệu trộn. Optional không nullable từ chối null; mật khẩu phải có nội dung; lý do hủy đếm ký tự Unicode; giới tính response NAM/NU/null đã kiểm bằng Ajv và Orval.
- [x] **Kiểm chứng contract**: 279 tests BE pass (179 DTO cases mới); 15 operation/9 path, 291 refs hợp lệ, một schema GioiTinh dùng chung, các paths/schemas cũ giữ nguyên về nội dung. HTTP 400/401/403/404/409/429 dùng ErrorResponseDto hiện có; 429 của submit là contract cho task logic sau, không thêm guard giới hạn tần suất trong W2-C2.


#### `W2-BE1` — Logic Hồ sơ Gia sư, Môn dạy, Lịch rảnh & Duyệt *(Đức)*
- [ ] **Khóa mã hóa CCCD & STK ngân hàng** *(từ PR #10)*: Schema lưu `cccdMaHoa`, `cccdHmac`, `taiKhoanNganHangMaHoa` → bổ sung biến môi trường khóa mã hóa vào `be/.env.example` và báo Duy cấu hình trên Render.
- [ ] **Nguồn lưu `lyDoTuChoi`** *(review PR #10)*: `TutorDetailDto` có `lyDoTuChoi: string | null`, nhưng bảng `GiaSu` trong `be/prisma/schema.prisma` chưa có cột này → chốt đọc từ `NhatKyThayDoi` hay thêm cột `lyDoTuChoi String?` ở migration Tuần 2.
- [ ] **Mapping tên trường & sinh mã nội bộ** *(review PR #10)*:
  - Map `MonDayInputDto.capHoc` ↔ cột `MonDay.capLop` trong Prisma.
  - `ngayUngTuyen` map từ `GiaSu.thoiDiemGhiNhanDongY` → nhớ điền khi seed ~15 gia sư và fallback sort `id desc` nếu `null`.
  - Các bảng `MonDay`, `LichRanh`, `HoSoNangLuc` đều có cột `ma String @unique` (không xuất ra DTO) → tự sinh mã duy nhất khi insert DB.
- [ ] **Chốt trạng thái được phép sửa ở `PATCH /api/tutors/:id`** *(review PR #10)*: Xác định rõ gia sư ở trạng thái `NGUNG_HOP_TAC` / `BI_TU_CHOI` / `CHO_DUYET` có được sửa hồ sơ không.
- [ ] **Edge case `khuVucNhanDay: []` khi đổi sang `ONLINE`** *(review PR #10)*: `UpdateTutorDto` kế thừa `@ArrayMinSize(1)` từ `ApplyTutorDto` nên gửi `khuVucNhanDay: []` khi đổi sang `ONLINE` sẽ bị `400` → điều chỉnh điều kiện `@ValidateIf` nếu muốn cho phép xóa mảng, hoặc thống nhất với FE không gửi trường này.
- [ ] **Siết validate `format: 'date'`** *(review PR #10)*: `@IsISO8601({ strict: true })` cho `ngaySinh`, `ngayCap`, `ngayHetHan` đang nhận cả chuỗi có giờ (`2000-08-15T10:00:00Z`) → cân nhắc thêm `@Matches(/^\d{4}-\d{2}-\d{2}$/)` để khớp chặt chuẩn `date`.

---

### 🧱 Hạ tầng / Nền

#### `W2-NỀN` — Upload file (Supabase Storage) & Môi trường *(Duy)*
- [ ] **Luồng upload tệp cho ứng tuyển** *(từ PR #10)*:
  - Hỗ trợ khách chưa đăng nhập tải ảnh CCCD, chân dung, giấy tờ khi ứng tuyển và trả về đường dẫn lưu Storage.
  - Cấp **Signed URL** khi xem ảnh CCCD / giấy tờ năng lực.
- [ ] **Lưu ý `JsonOnlyMiddleware`** *(review PR #10)*: `AppModule` đang áp dụng `JsonOnlyMiddleware` cho mọi route (`{*duongDan}`). Nếu `/storage/upload` dùng `multipart/form-data`, cần exclude route này (hoặc dùng luồng xin Presigned Upload URL bằng JSON).
- [ ] **Biến môi trường mã hóa trên Render** *(từ PR #10)*: Thêm khóa mã hóa cho CCCD/STK của `W2-BE1` lên Staging & Production sau khi Đức chốt tên biến trong `be/.env.example`.

---

## 📅 Tuần 3 (30/11–06/12)

### ⚙️ BE

#### `W3-C2` — Contract: Lớp học, Lịch cố định & Sinh buổi *(BE2)*
- [ ] **Quy ước `thu` theo chuẩn ISO** *(từ PR #10)*: Thống nhất dùng `1` = Thứ Hai … `6` = Thứ Bảy, `7` = Chủ nhật cho `LichHocCoDinh` để đồng bộ với `LichRanh` (`W2-C1`).

---

## 🌐 Quy ước chung & Backlog *(Cả nhóm)*

- [ ] **Phân quyền hồ sơ gia sư (Bảng 9)** *(từ PR #10)*: `QUAN_LY` chỉ xem; sửa và duyệt/từ chối chỉ `DIEU_PHOI` (và `GIA_SU` tự sửa hồ sơ của mình).
- [ ] **Backlog — Nộp lại hồ sơ sau khi bị từ chối** *(từ PR #10)*: Chuyển `BI_TU_CHOI → CHO_DUYET` chưa có API trong MVP, để vào backlog.

---

## 🔗 Nguồn PR đã tổng hợp

| PR | Mã task | Nhánh | Tác giả | Ngày tạo |
| :---: | :---: | :--- | :--- | :---: |
| [#10](https://github.com/LDukeH/peasy-edu/pull/10) | `W2-C1` | `contract/w2-tutors` | Đức (`broccoli2609`) | 2026-11-22 |

---

## 📝 Mẫu thêm ghi chú mới

Khi có PR mới cần nhắc các task khác, chỉ cần thêm dòng vào đúng **Tuần → Bên → Mã Task đích** ở trên theo dạng:

```markdown
#### `<MÃ-TASK>` — <Tên task> *(<Người nhận>)*
- [ ] **<Chủ đề ngắn>** *(từ PR #<số>)*: <Nội dung cần xác nhận hoặc lưu ý kỹ thuật>.
```

Và thêm 1 dòng vào bảng [Nguồn PR đã tổng hợp](#-nguồn-pr-đã-tổng-hợp).
