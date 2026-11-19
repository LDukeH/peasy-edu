"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, SelectField, TextareaField } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Notice } from "@/components/ui/notice";
import {
  createAccountByAdmin,
  requestRole,
  setAccountStatus,
} from "@/mocks/db";
import { isValidEmail, isValidPhone } from "@/mocks/format";
import { DEMO_PASSWORD } from "@/mocks/seed";
import {
  ASSIGNABLE_ROLES,
  ROLE_LABEL,
  ROLE_SCOPE,
  type Account,
  type RoleCode,
} from "@/mocks/types";

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
        Thao tác đã được ghi nhận trong nhật ký quản trị.
        {message && <span className="mt-1 block">{message}</span>}
      </Notice>
      <div className="flex gap-3">
        <Button data-autofocus onClick={onClose}>
          Về màn đang xem
        </Button>
        <span
          aria-disabled="true"
          title="Sắp có"
          className="inline-flex cursor-not-allowed items-center rounded-lg border border-line bg-white px-4 py-[11px] text-sm font-semibold text-body opacity-60"
        >
          Xem nhật ký
        </span>
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
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RoleCode>("GIA_SU");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = "Vui lòng nhập họ và tên.";
    if (!isValidPhone(phone))
      next.phone = "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.";
    if (email.trim() && !isValidEmail(email)) next.email = "Email chưa đúng định dạng.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    const res = await createAccountByAdmin({ fullName, phone, email, role });
    setBusy(false);
    if (!res.ok) {
      setErrors({ [res.field ?? "phone"]: res.error });
      return;
    }
    onDone(
      `Đã tạo ${res.data.code} · ${res.data.fullName}. Trạng thái: Chờ kích hoạt. (Demo) mật khẩu tạm: ${DEMO_PASSWORD}`,
    );
  }

  return (
    <Modal title="Tạo tài khoản" onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[18px]">
        <p className="text-sm leading-[22px] text-text-muted">
          Tài khoản mới đăng nhập bằng số điện thoại. Email là thông tin bổ sung, không bắt buộc.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field variant="dialog" label="Họ và tên *" value={fullName} error={errors.fullName}
            placeholder="Võ Thanh Trúc" onChange={(e) => setFullName(e.target.value)} />
          <Field variant="dialog" label="Số điện thoại *" type="tel" inputMode="tel" value={phone}
            error={errors.phone} placeholder="090 700 0123" onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field variant="dialog" label="Email (không bắt buộc)" type="email" value={email}
            error={errors.email} placeholder="truc.vo@example.com" onChange={(e) => setEmail(e.target.value)} />
          <SelectField label="Vai trò ban đầu *" value={role} onChange={(e) => setRole(e.target.value as RoleCode)}>
            {ASSIGNABLE_ROLES.map((r) => (
              <option key={r} value={r}>{ROLE_LABEL[r]}</option>
            ))}
          </SelectField>
        </div>
        <Notice>{ROLE_SCOPE[role]} Trạng thái sau khi tạo: Chờ kích hoạt.</Notice>
        <div className="flex gap-3">
          <Button type="submit" disabled={busy}>{busy ? "Đang tạo…" : "Tạo tài khoản"}</Button>
          <Button variant="secondary" onClick={onClose}>Hủy</Button>
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
  account: Account;
  unlock: boolean;
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!unlock && !reason.trim()) {
      setError("Vui lòng nhập lý do thao tác.");
      return;
    }
    setAccountStatus(account.id, unlock ? "HOAT_DONG" : "BI_KHOA");
    onDone(`${account.code} · ${account.fullName}: ${unlock ? "đã mở khóa" : "đã khóa"}.`);
  }

  return (
    <Modal title={`${unlock ? "Mở khóa" : "Khóa"} tài khoản ${account.fullName}?`} onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[18px]">
        <Notice tone={unlock ? "info" : "warning"}>
          <span className="block">
            {account.code} · {account.fullName} · {ROLE_LABEL[account.role]}
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
          <Button type="submit" variant={unlock ? "primary" : "danger"}>
            {unlock ? "Xác nhận mở khóa" : "Xác nhận khóa"}
          </Button>
          <Button variant="secondary" onClick={onClose}>Hủy</Button>
        </div>
      </form>
    </Modal>
  );
}

export function RoleRequestDialog({
  account,
  onClose,
  onDone,
}: {
  account: Account;
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const options = ASSIGNABLE_ROLES.filter((r) => r !== account.role);
  const [role, setRole] = useState<RoleCode>(options[0]);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do đề nghị.");
      return;
    }
    setBusy(true);
    await requestRole({ accountId: account.id, requestedRole: role, reason: reason.trim() });
    setBusy(false);
    onDone(
      `Đã trình Chủ trung tâm đề nghị bổ sung vai trò ${ROLE_LABEL[role]} cho ${account.code}. Tài khoản vẫn giữ quyền ${ROLE_LABEL[account.role]} trong lúc chờ.`,
    );
  }

  return (
    <Modal title="Đề nghị bổ sung vai trò" onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[18px]">
        <p className="text-sm leading-[22px] text-text-muted">
          {account.code} · {account.fullName}
          <br />
          Vai trò hiện tại: {ROLE_LABEL[account.role]}
        </p>
        <SelectField label="Vai trò đề nghị" value={role} onChange={(e) => setRole(e.target.value as RoleCode)}>
          {options.map((r) => (
            <option key={r} value={r}>{ROLE_LABEL[r]}</option>
          ))}
        </SelectField>
        <TextareaField
          label="Lý do"
          value={reason}
          error={error}
          placeholder="Bổ sung nhiệm vụ điều phối lịch và theo dõi các lớp được phân công."
          onChange={(e) => {
            setReason(e.target.value);
            setError("");
          }}
        />
        <Notice tone="warning">
          Quyền truy cập mở rộng cần Chủ trung tâm phê duyệt. Trong lúc chờ, tài khoản vẫn chỉ có quyền {ROLE_LABEL[account.role]}.
        </Notice>
        <div className="flex gap-3">
          <Button type="submit" disabled={busy}>{busy ? "Đang gửi…" : "Trình Chủ trung tâm"}</Button>
          <Button variant="secondary" onClick={onClose}>Hủy</Button>
        </div>
      </form>
    </Modal>
  );
}
