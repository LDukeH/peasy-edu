"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import {
  TrangThaiTaiKhoan,
  VaiTro,
  type UserDto,
} from "@/api/generated/model";
import {
  getUsersFindAllQueryKey,
  useUsersCreate,
  useUsersRemove,
  useUsersUpdate,
} from "@/api/generated/peasyApi";
import { Button } from "@/components/ui/button";
import { Field, SelectField, TextareaField } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Notice } from "@/components/ui/notice";
import { extractApiError } from "@/lib/api-error";
import {
  isValidEmail,
  isValidPhone,
  normalizePhone,
  VAI_TRO_LABEL,
  VAI_TRO_SCOPE,
} from "@/lib/auth-labels";

const CREATABLE_ROLES: VaiTro[] = [
  VaiTro.QUAN_LY,
  VaiTro.DIEU_PHOI,
  VaiTro.PHU_HUYNH,
];

const STAFF_ROLES: VaiTro[] = [VaiTro.QUAN_LY, VaiTro.DIEU_PHOI];

export function ResultDialog({
  message,
  onClose,
}: {
  message?: string;
  onClose: () => void;
}) {
  return (
    <Modal title="Đã ghi nhận thao tác" onClose={onClose}>
      <Notice>
        Thao tác đã được lưu vào hệ thống.
        {message && <span className="mt-1 block">{message}</span>}
      </Notice>
      <div className="flex gap-3">
        <Button data-autofocus onClick={onClose}>
          Về màn đang xem
        </Button>
      </div>
    </Modal>
  );
}

export function CreateAccountDialog({
  onClose,
  onDone,
}: {
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const queryClient = useQueryClient();
  const createMutation = useUsersCreate();

  const [tenDangNhap, setTenDangNhap] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [hoTen, setHoTen] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [email, setEmail] = useState("");
  const [vaiTro, setVaiTro] = useState<VaiTro>(VaiTro.DIEU_PHOI);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    const normalizedPhone = normalizePhone(soDienThoai);
    const username =
      vaiTro === VaiTro.PHU_HUYNH ? normalizedPhone : tenDangNhap.trim();
    const isStaff = STAFF_ROLES.includes(vaiTro);

    if (!isValidPhone(soDienThoai)) {
      next.soDienThoai = "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.";
    }
    if (
      vaiTro !== VaiTro.PHU_HUYNH &&
      (username.length < 3 || !/^[a-zA-Z0-9._@-]+$/.test(username))
    ) {
      next.tenDangNhap =
        "Tên đăng nhập tối thiểu 3 ký tự (chữ, số, . _ @ -).";
    }
    if (matKhau.length < 8 || matKhau.length > 72) {
      next.matKhau = "Mật khẩu phải từ 8 đến 72 ký tự.";
    }
    if (!hoTen.trim()) next.hoTen = "Vui lòng nhập họ và tên.";
    if (isStaff && !email.trim()) {
      next.email = "Email là bắt buộc với tài khoản nhân viên.";
    } else if (email.trim() && !isValidEmail(email)) {
      next.email = "Email chưa đúng định dạng.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      const created = await createMutation.mutateAsync({
        data: {
          tenDangNhap: username,
          matKhau,
          hoTen: hoTen.trim(),
          soDienThoai: normalizedPhone,
          email: email.trim() || undefined,
          vaiTro,
        },
      });
      await queryClient.invalidateQueries({
        queryKey: getUsersFindAllQueryKey(),
      });
      onDone(
        `Đã tạo tài khoản ${created.tenDangNhap} (${created.maDoiTuong ?? created.hoTen}) với vai trò ${VAI_TRO_LABEL[created.vaiTro]}.`,
      );
    } catch (err) {
      const parsed = extractApiError(err, "Không thể tạo tài khoản.");
      if (parsed.statusCode === 409) {
        setErrors({ tenDangNhap: parsed.message });
      } else {
        setErrors({ form: parsed.message });
      }
    }
  }

  return (
    <Modal title="Tạo tài khoản" onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[18px]">
        <p className="text-sm leading-[22px] text-text-muted">
          Tài khoản nhân sự dùng tên đăng nhập riêng; tài khoản phụ huynh nên
          dùng số điện thoại làm tên đăng nhập.
        </p>
        {errors.form && <Notice tone="error">{errors.form}</Notice>}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            variant="dialog"
            label={
              vaiTro === VaiTro.PHU_HUYNH
                ? "Tên đăng nhập (tự lấy theo SĐT)"
                : "Tên đăng nhập *"
            }
            value={
              vaiTro === VaiTro.PHU_HUYNH
                ? normalizePhone(soDienThoai)
                : tenDangNhap
            }
            disabled={vaiTro === VaiTro.PHU_HUYNH}
            error={errors.tenDangNhap}
            placeholder="dieuphoi02"
            onChange={(e) => setTenDangNhap(e.target.value)}
          />
          <Field
            variant="dialog"
            label="Mật khẩu ban đầu *"
            type="password"
            value={matKhau}
            error={errors.matKhau}
            placeholder="Tối thiểu 8 ký tự"
            onChange={(e) => setMatKhau(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            variant="dialog"
            label="Họ và tên *"
            value={hoTen}
            error={errors.hoTen}
            placeholder="Võ Thanh Trúc"
            onChange={(e) => setHoTen(e.target.value)}
          />
          <Field
            variant="dialog"
            label="Số điện thoại *"
            type="tel"
            inputMode="tel"
            value={soDienThoai}
            error={errors.soDienThoai}
            placeholder="090 700 0123"
            onChange={(e) => setSoDienThoai(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            variant="dialog"
            label={
              STAFF_ROLES.includes(vaiTro) ? "Email *" : "Email (không bắt buộc)"
            }
            type="email"
            value={email}
            error={errors.email}
            placeholder="truc.vo@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <SelectField
            label="Vai trò *"
            value={vaiTro}
            onChange={(e) => setVaiTro(e.target.value as VaiTro)}
          >
            {CREATABLE_ROLES.map((r) => (
              <option key={r} value={r}>
                {VAI_TRO_LABEL[r]}
              </option>
            ))}
          </SelectField>
        </div>
        <Notice>{VAI_TRO_SCOPE[vaiTro]}</Notice>
        <div className="flex gap-3">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Đang tạo…" : "Tạo tài khoản"}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function EditAccountDialog({
  account,
  onClose,
  onDone,
}: {
  account: UserDto;
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const queryClient = useQueryClient();
  const updateMutation = useUsersUpdate();

  const [hoTen, setHoTen] = useState(account.hoTen);
  const [soDienThoai, setSoDienThoai] = useState(account.soDienThoai ?? "");
  const [email, setEmail] = useState(account.email ?? "");
  const [vaiTro, setVaiTro] = useState<VaiTro>(account.vaiTro);
  const [matKhau, setMatKhau] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const canChangeRole = STAFF_ROLES.includes(account.vaiTro);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!hoTen.trim()) next.hoTen = "Vui lòng nhập họ và tên.";
    if (soDienThoai.trim() && !isValidPhone(soDienThoai)) {
      next.soDienThoai = "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.";
    }
    if (email.trim() && !isValidEmail(email)) {
      next.email = "Email chưa đúng định dạng.";
    }
    if (matKhau && (matKhau.length < 8 || matKhau.length > 72)) {
      next.matKhau = "Mật khẩu mới phải từ 8 đến 72 ký tự.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      const updated = await updateMutation.mutateAsync({
        id: account.id,
        data: {
          hoTen: hoTen.trim(),
          soDienThoai: soDienThoai.trim()
            ? normalizePhone(soDienThoai)
            : undefined,
          email: email.trim() || undefined,
          vaiTro: canChangeRole ? vaiTro : undefined,
          matKhau: matKhau || undefined,
        },
      });
      await queryClient.invalidateQueries({
        queryKey: getUsersFindAllQueryKey(),
      });
      onDone(
        `Đã cập nhật ${updated.tenDangNhap} · ${updated.hoTen} (${VAI_TRO_LABEL[updated.vaiTro]}).`,
      );
    } catch (err) {
      const parsed = extractApiError(err, "Không thể cập nhật tài khoản.");
      setErrors({ form: parsed.message });
    }
  }

  return (
    <Modal title={`Cập nhật tài khoản ${account.tenDangNhap}`} onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[18px]">
        {errors.form && <Notice tone="error">{errors.form}</Notice>}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            variant="dialog"
            label="Họ và tên *"
            value={hoTen}
            error={errors.hoTen}
            onChange={(e) => setHoTen(e.target.value)}
          />
          <Field
            variant="dialog"
            label="Số điện thoại"
            type="tel"
            inputMode="tel"
            value={soDienThoai}
            error={errors.soDienThoai}
            onChange={(e) => setSoDienThoai(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            variant="dialog"
            label="Email"
            type="email"
            value={email}
            error={errors.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <SelectField
            label="Vai trò"
            value={vaiTro}
            disabled={!canChangeRole}
            onChange={(e) => setVaiTro(e.target.value as VaiTro)}
          >
            {(canChangeRole ? STAFF_ROLES : [account.vaiTro]).map((r) => (
              <option key={r} value={r}>
                {VAI_TRO_LABEL[r]}
              </option>
            ))}
          </SelectField>
        </div>
        <Field
          variant="dialog"
          label="Đặt lại mật khẩu (để trống nếu giữ nguyên)"
          type="password"
          value={matKhau}
          error={errors.matKhau}
          placeholder="Nhập mật khẩu mới (8–72 ký tự)"
          onChange={(e) => setMatKhau(e.target.value)}
        />
        <Notice>{VAI_TRO_SCOPE[vaiTro]}</Notice>
        <div className="flex gap-3">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Đang lưu…" : "Lưu thay đổi"}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function LockDialog({
  account,
  unlock,
  onClose,
  onDone,
}: {
  account: UserDto;
  unlock: boolean;
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const queryClient = useQueryClient();
  const removeMutation = useUsersRemove();
  const updateMutation = useUsersUpdate();

  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const busy = removeMutation.isPending || updateMutation.isPending;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!unlock && !reason.trim()) {
      setError("Vui lòng nhập lý do thao tác.");
      return;
    }

    try {
      if (unlock) {
        await updateMutation.mutateAsync({
          id: account.id,
          data: { trangThai: TrangThaiTaiKhoan.HOAT_DONG },
        });
      } else {
        await removeMutation.mutateAsync({ id: account.id });
      }
      await queryClient.invalidateQueries({
        queryKey: getUsersFindAllQueryKey(),
      });
      onDone(
        `${account.tenDangNhap} · ${account.hoTen}: ${unlock ? "đã mở khóa" : "đã khóa"}.`,
      );
    } catch (err) {
      const parsed = extractApiError(
        err,
        unlock ? "Không thể mở khóa tài khoản." : "Không thể khóa tài khoản.",
      );
      setError(parsed.message);
    }
  }

  return (
    <Modal
      title={`${unlock ? "Mở khóa" : "Khóa"} tài khoản ${account.hoTen}?`}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[18px]">
        <Notice tone={unlock ? "info" : "warning"}>
          <span className="block">
            {account.maDoiTuong ?? account.tenDangNhap} · {account.hoTen} ·{" "}
            {VAI_TRO_LABEL[account.vaiTro]}
          </span>
          {unlock
            ? "Tài khoản sẽ đăng nhập lại được sau khi mở khóa."
            : "Tài khoản không thể đăng nhập sau khi khóa. Các lớp đang vận hành không tự kết thúc."}
        </Notice>
        <TextareaField
          label={unlock ? "Lý do thao tác (không bắt buộc)" : "Lý do thao tác"}
          value={reason}
          error={error}
          placeholder="Rà soát quyền truy cập theo yêu cầu quản trị."
          onChange={(e) => {
            setReason(e.target.value);
            setError("");
          }}
        />
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={busy}
            variant={unlock ? "primary" : "danger"}
          >
            {busy
              ? "Đang xử lý…"
              : unlock
                ? "Xác nhận mở khóa"
                : "Xác nhận khóa"}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
        </div>
      </form>
    </Modal>
  );
}
