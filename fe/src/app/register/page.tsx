"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { BrandPanel } from "@/components/auth/brand-panel";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import {
  discardAccount,
  registerAccount,
  setAccountStatus,
} from "@/mocks/db";
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
} from "@/mocks/format";
import type { Account } from "@/mocks/types";

type RegRole = "PHU_HUYNH" | "GIA_SU";

interface Errors {
  fullName?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirm?: string;
  agree?: string;
}

const RESEND_SECONDS = 60;

export default function RegisterPage() {
  const [role, setRole] = useState<RegRole>("PHU_HUYNH");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const [created, setCreated] = useState<Account | null>(null);
  const [verified, setVerified] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!created || verified || secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [created, verified, secondsLeft]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!fullName.trim()) next.fullName = "Vui lòng nhập họ và tên.";
    if (!isValidPhone(phone))
      next.phone = "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.";
    if (!isValidEmail(email)) next.email = "Email chưa đúng định dạng.";
    if (!isValidPassword(password))
      next.password = "Tối thiểu 10 ký tự, có chữ và số.";
    if (confirm !== password) next.confirm = "Mật khẩu nhập lại chưa khớp.";
    if (!agree)
      next.agree = "Bạn cần đồng ý Điều khoản và Chính sách bảo mật.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    const res = await registerAccount({ fullName, phone, email, password, role });
    setSubmitting(false);
    if (!res.ok) {
      setErrors({ [res.field ?? "phone"]: res.error });
      return;
    }
    setCreated(res.data);
    setSecondsLeft(RESEND_SECONDS);
    setResent(false);
    setVerified(false);
  }

  function changeEmail() {
    if (created) discardAccount(created.id);
    setCreated(null);
    setVerified(false);
  }

  function resend() {
    setSecondsLeft(RESEND_SECONDS);
    setResent(true);
  }

  function simulateVerify() {
    if (!created) return;
    setAccountStatus(created.id, "HOAT_DONG");
    setVerified(true);
  }

  const locked = created !== null;
  const roleLabel = role === "PHU_HUYNH" ? "phụ huynh" : "gia sư";

  return (
    <div className="flex min-h-screen flex-col bg-canvas lg:flex-row">
      <BrandPanel widthClass="lg:w-[610px]" gapClass="gap-10">
        <h2 className="text-[32px] font-semibold leading-[44px] lg:text-[40px] lg:leading-[52px]">
          Bắt đầu hành trình
          <br />
          học tập rõ ràng hơn.
        </h2>
        <p className="text-base leading-6 text-inverse-muted">
          Một tài khoản, đúng không gian dành cho bạn.
        </p>
        <InfoCard title="Dành cho phụ huynh">
          Gửi nhu cầu, so sánh gia sư và theo dõi lịch học, tiến bộ, học phí của
          con.
        </InfoCard>
        <InfoCard title="Dành cho gia sư">
          Hoàn thiện hồ sơ, xác minh bằng cấp, nhận lời mời lớp và quản lý lịch
          dạy riêng.
        </InfoCard>
        <p className="text-xs leading-[18px] text-inverse-muted">
          Tài khoản nhân sự do Quản trị viên cấp. Tài khoản học viên được liên
          kết với gia đình.
        </p>
      </BrandPanel>

      <main className="flex-1 px-8 py-10 lg:px-[86px] lg:py-[54px]">
        <form
          onSubmit={onSubmit}
          noValidate
          className="flex max-w-[720px] flex-col gap-[22px]"
        >
          <h1 className="text-[32px] font-semibold leading-[44px] text-body">
            Tạo tài khoản mới
          </h1>

          <div role="radiogroup" aria-label="Loại tài khoản" className="flex gap-5">
            {(
              [
                ["PHU_HUYNH", "Phụ huynh"],
                ["GIA_SU", "Gia sư"],
              ] as const
            ).map(([value, label]) => {
              const active = role === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={locked}
                  onClick={() => setRole(value)}
                  className={`rounded-lg px-4 py-[11px] text-sm font-semibold leading-5 ${
                    active
                      ? "bg-brand text-white"
                      : "border border-line bg-white text-body"
                  } ${locked ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                >
                  {active ? "●" : "○"} {label}
                </button>
              );
            })}
          </div>

          <fieldset disabled={locked} className="flex flex-col gap-[22px] border-0 p-0">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Họ và tên *"
                autoComplete="name"
                placeholder="Trần Thu Hà"
                value={fullName}
                error={errors.fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Field
                label="Số điện thoại *"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="090 123 4567"
                value={phone}
                error={errors.phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <Field
              label="Email *"
              type="email"
              autoComplete="email"
              placeholder="ha.tran@email.com"
              value={email}
              error={errors.email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Mật khẩu *"
                type="password"
                autoComplete="new-password"
                value={password}
                error={errors.password}
                hint="Tối thiểu 10 ký tự, có chữ và số."
                onChange={(e) => setPassword(e.target.value)}
              />
              <Field
                label="Nhập lại mật khẩu *"
                type="password"
                autoComplete="new-password"
                value={confirm}
                error={errors.confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="flex cursor-pointer items-center gap-2 text-xs leading-[18px] text-body">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="size-4 accent-brand"
                />
                Tôi đồng ý Điều khoản sử dụng và Chính sách bảo mật của PeasyEdu.
              </label>
              {errors.agree && (
                <p role="alert" className="text-xs leading-[18px] text-danger-field">
                  {errors.agree}
                </p>
              )}
            </div>
          </fieldset>

          <div>
            <Button type="submit" disabled={submitting || locked}>
              {submitting ? "Đang tạo tài khoản…" : `Tạo tài khoản ${roleLabel}`}
            </Button>
          </div>

          {created && (
            <>
              {verified ? (
                <Notice tone="success" small title="✓ Đã xác minh email">
                  Tài khoản {created.code} đã sẵn sàng.{" "}
                  <Link href="/login" className="font-semibold underline">
                    Đăng nhập ngay
                  </Link>
                </Notice>
              ) : (
                <>
                  <Notice tone="success" small title="✓ Đã gửi email xác minh">
                    Kiểm tra hộp thư {created.email} và xác minh trong 24 giờ để
                    hoàn tất đăng ký. Kiểm tra cả mục thư rác.
                  </Notice>
                  <p className="text-xs leading-[18px] text-brand">
                    {secondsLeft > 0 ? (
                      <>Gửi lại email sau {secondsLeft} giây</>
                    ) : (
                      <button type="button" onClick={resend} className="cursor-pointer hover:underline">
                        Gửi lại email
                      </button>
                    )}{" "}
                    ·{" "}
                    <button type="button" onClick={changeEmail} className="cursor-pointer hover:underline">
                      Đổi địa chỉ email
                    </button>
                    {resent && <span className="text-muted"> · Đã gửi lại email.</span>}
                  </p>
                  {role === "PHU_HUYNH" && (
                    <p className="text-xs leading-[18px] text-muted">
                      YC01024 được giữ lại và sẽ gắn với tài khoản sau xác minh.
                    </p>
                  )}
                  <div className="rounded-lg border border-dashed border-line-strong p-3 text-xs leading-[18px] text-muted">
                    Demo: chưa có email thật.{" "}
                    <button type="button" onClick={simulateVerify} className="cursor-pointer font-semibold text-brand hover:underline">
                      Mô phỏng bấm liên kết xác minh
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          <p className="text-sm leading-[22px] text-brand">
            Đã có tài khoản?{" "}
            <Link href="/login" className="hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: string }) {
  return (
    <div className="flex flex-col gap-[18px] rounded-xl border border-line bg-white p-6">
      <p className="text-base font-semibold leading-6 text-ink">{title}</p>
      <p className="text-sm leading-[22px] text-body">{children}</p>
    </div>
  );
}
