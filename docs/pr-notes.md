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
- [ ] **Tái sử dụng Enum `GioiTinh`** *(từ PR #10)*: Import `GioiTinh` (`NAM`, `NU`) từ `be/src/common/enums/gia-su.enum.ts` cho Học viên để tránh sinh 2 schema trùng tên trong `openapi.json`.

#### `W2-BE1` — Logic Hồ sơ Gia sư, Môn dạy, Lịch rảnh & Duyệt *(Đức)*
- [ ] **Khóa mã hóa CCCD & STK ngân hàng** *(từ PR #10)*: Schema lưu `cccdMaHoa`, `cccdHmac`, `taiKhoanNganHangMaHoa` → bổ sung biến môi trường khóa mã hóa vào `be/.env.example` và báo Duy cấu hình trên Render.
- [ ] **Nguồn lưu `lyDoTuChoi`** *(review PR #10)*: `TutorDetailDto` có `lyDoTuChoi: string | null`, nhưng bảng `GiaSu` trong `be/prisma/schema.prisma` chưa có cột này → chốt đọc từ `NhatKyThayDoi` hay thêm cột `lyDoTuChoi String?` ở migration Tuần 2.
- [ ] **Mapping tên trường & sinh mã nội bộ** *(review PR #10)*:
  - Map `MonDayInputDto.capHoc` ↔ cột `MonDay.capLop` trong Prisma.
  - `ngayUngTuyen` map từ `GiaSu.thoiDiemGhiNhanDongY` → nhớ điền khi seed ~15 gia sư và fallback sort `id desc` nếu `null`.
  - Các bảng `MonDay`, `LichRanh`, `HoSoNangLuc` đều có cột `ma String @unique` (không xuất ra DTO) → tự sinh mã duy nhất khi insert DB.
- [ ] **Chốt trạng thái được phép sửa ở `PATCH /api/tutors/:id`** *(review PR #10)*: Xác định rõ gia sư ở trạng thái `NGUNG_HOP_TAC` / `BI_TU_CHOI` / `CHO_DUYET` có được sửa hồ sơ không.

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
