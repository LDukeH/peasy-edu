"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { BrandPanel, PhotoPlaceholder } from "@/components/auth/brand-panel";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { authenticate, resetMockDb, useAccounts } from "@/mocks/db";
import { formatPhone } from "@/mocks/format";
import { DEMO_PASSWORD } from "@/mocks/seed";
import { homeFor, startSession, useMockSession } from "@/mocks/session";
import { ROLE_LABEL } from "@/mocks/types";

interface Errors {
  phone?: string;
  password?: string;
  form?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { ready, account } = useMockSession();
  const accounts = useAccounts();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (ready && account) router.replace(homeFor(account.role));
  }, [ready, account, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setInfo("");
    const next: Errors = {};
    if (!phone.trim()) next.phone = "Vui lòng nhập số điện thoại.";
    if (!password) next.password = "Vui lòng nhập mật khẩu.";
    setErrors(next);
    if (next.phone || next.password) return;

    setSubmitting(true);
    const res = await authenticate(phone, password);
    setSubmitting(false);
    if (!res.ok) {
      setErrors({ [res.field ?? "form"]: res.error });
      return;
    }
    startSession(res.data.id, remember);
    router.replace(homeFor(res.data.role));
  }

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <BrandPanel widthClass="lg:w-[650px]" gapClass="gap-9">
        <div className="flex flex-col gap-[18px]">
          <h2 className="text-[32px] font-semibold leading-[44px] lg:text-[40px] lg:leading-[52px]">
            Một nơi để kết nối.
            <br />
            Một hành trình tiến bộ.
          </h2>
          <p className="text-base leading-6 text-inverse-muted">
            Lịch học, báo cáo và những bước tiến của con luôn ở trong tầm nhìn
            của bạn.
          </p>
        </div>
        <PhotoPlaceholder />
        <p className="text-xs leading-[18px] text-inverse-muted">
          PeasyEdu · Đồng hành cùng gia đình và gia sư.
        </p>
      </BrandPanel>

      <main className="flex flex-1 flex-col gap-[26px] p-8 lg:p-[100px]">
        <form
          onSubmit={onSubmit}
          noValidate
          className="flex w-full max-w-[560px] flex-col gap-[26px]"
        >
          <p className="text-xs font-semibold leading-[18px] text-brand">
            ● CỔNG PeasyEdu
          </p>
          <h1 className="text-[32px] font-semibold leading-[44px] text-body">
            Chào mừng trở lại
          </h1>
          <p className="text-sm leading-[22px] text-muted">
            Đăng nhập bằng tài khoản được cấp hoặc đã đăng ký. Không cần chọn
            vai trò để thay đổi quyền.
          </p>

          {errors.form && <Notice tone="error">{errors.form}</Notice>}
          {info && <Notice tone="info">{info}</Notice>}

          <Field
            label="Số điện thoại * (tên đăng nhập)"
            type="tel"
            inputMode="tel"
            autoComplete="username"
            placeholder="090 123 4567"
            value={phone}
            error={errors.phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Field
            label="Mật khẩu *"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            error={errors.password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-xs leading-[18px] text-body">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 accent-brand"
              />
              Ghi nhớ đăng nhập
            </label>
            <button
              type="button"
              onClick={() =>
                setInfo("Tính năng khôi phục mật khẩu sẽ có ở bước sau.")
              }
              className="cursor-pointer text-xs leading-[18px] text-brand hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          <div>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Đang đăng nhập…" : "Đăng nhập →"}
            </Button>
          </div>

          <p className="text-sm leading-[22px] text-muted">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-brand hover:underline">
              Đăng ký Phụ huynh / Gia sư
            </Link>
          </p>
          <p className="text-xs leading-[18px] text-muted">
            Hỗ trợ đăng nhập: 028 3822 0123 · Không chia sẻ mật khẩu.
          </p>
        </form>

        <details className="w-full max-w-[560px] rounded-lg border border-dashed border-line-strong bg-canvas p-4 text-xs leading-[18px] text-muted">
          <summary className="cursor-pointer font-semibold text-body">
            Tài khoản demo (chỉ để test, chưa nối backend)
          </summary>
          <p className="mt-2">
            Mật khẩu chung: <code className="font-semibold">{DEMO_PASSWORD}</code>
          </p>
          <ul className="mt-2 flex flex-col gap-1">
            {accounts.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  className="cursor-pointer text-left hover:text-brand"
                  onClick={() => {
                    setPhone(formatPhone(a.phone));
                    setPassword(a.password);
                    setErrors({});
                  }}
                >
                  {formatPhone(a.phone)} · {a.fullName} · {ROLE_LABEL[a.role]}
                  {a.status !== "HOAT_DONG" && " (không đăng nhập được)"}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-3 cursor-pointer text-brand hover:underline"
            onClick={() => {
              resetMockDb();
              setInfo("Đã đặt lại dữ liệu demo.");
            }}
          >
            Đặt lại dữ liệu demo
          </button>
        </details>
      </main>
    </div>
  );
}
