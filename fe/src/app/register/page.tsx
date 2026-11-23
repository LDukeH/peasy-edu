"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { getAuthMeQueryKey, useAuthRegister } from "@/api/generated/peasyApi";
import { BrandPanel } from "@/components/auth/brand-panel";
import { Button, buttonClasses } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { useAuthSession } from "@/hooks/use-auth-session";
import { extractApiError } from "@/lib/api-error";
import { writeCachedUser } from "@/lib/auth-cache";
import {
  homeForRole,
  isValidEmail,
  isValidPhone,
  mapUserDtoToProfile,
  normalizePhone,
} from "@/lib/auth-labels";
import { useAuthStore } from "@/stores/auth-store";

type RegRole = "PHU_HUYNH" | "GIA_SU";

interface Errors {
  fullName?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirm?: string;
  agree?: string;
  form?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { ready, user } = useAuthSession();
  const registerMutation = useAuthRegister();

  const [role, setRole] = useState<RegRole>("PHU_HUYNH");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (ready && user) {
      router.replace(homeForRole(user.vaiTro));
    }
  }, [ready, user, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (role !== "PHU_HUYNH") return;

    const next: Errors = {};
    if (!fullName.trim()) next.fullName = "Vui lòng nhập họ và tên.";
    if (!isValidPhone(phone))
      next.phone = "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.";
    if (email.trim() && !isValidEmail(email))
      next.email = "Email chưa đúng định dạng.";
    if (password.length < 8 || password.length > 72)
      next.password = "Mật khẩu phải từ 8 đến 72 ký tự.";
    if (confirm !== password) next.confirm = "Mật khẩu nhập lại chưa khớp.";
    if (!agree)
      next.agree = "Bạn cần đồng ý Điều khoản và Chính sách bảo mật.";
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      const createdUser = await registerMutation.mutateAsync({
        data: {
          hoTen: fullName.trim(),
          soDienThoai: normalizePhone(phone),
          matKhau: password,
          email: email.trim() || undefined,
        },
      });
      writeCachedUser(createdUser);
      queryClient.setQueryData(getAuthMeQueryKey(), createdUser);
      useAuthStore.getState().setUser(mapUserDtoToProfile(createdUser));
      router.replace(homeForRole(createdUser.vaiTro));
    } catch (err) {
      const parsed = extractApiError(err, "Đăng ký thất bại. Vui lòng thử lại.");
      if (parsed.statusCode === 409) {
        setErrors({ phone: parsed.message });
      } else {
        setErrors({ form: parsed.message });
      }
    }
  }

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
          Tài khoản nhân sự do Quản lý cấp. Tài khoản học viên được liên kết với
          gia đình.
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
                  onClick={() => {
                    setRole(value);
                    setErrors({});
                  }}
                  className={`cursor-pointer rounded-lg px-4 py-[11px] text-sm font-semibold leading-5 ${
                    active
                      ? "bg-brand text-white"
                      : "border border-line bg-white text-body"
                  }`}
                >
                  {active ? "●" : "○"} {label}
                </button>
              );
            })}
          </div>

          {role === "GIA_SU" ? (
            <div className="flex flex-col gap-4 rounded-xl border border-line bg-white p-6">
              <Notice title="Đăng ký dành cho Gia sư">
                Gia sư vui lòng gửi hồ sơ ứng tuyển để trung tâm xác minh bằng
                cấp và cấp tài khoản đăng nhập.
              </Notice>
              <div>
                <Link
                  href="/ung-tuyen-gia-su"
                  className={buttonClasses("primary")}
                >
                  Đi tới trang Ứng tuyển Gia sư →
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errors.form && <Notice tone="error">{errors.form}</Notice>}

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
                label="Email (không bắt buộc)"
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
                  hint="Từ 8 đến 72 ký tự."
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
                  Tôi đồng ý Điều khoản sử dụng và Chính sách bảo mật của
                  PeasyEdu.
                </label>
                {errors.agree && (
                  <p
                    role="alert"
                    className="text-xs leading-[18px] text-danger-field"
                  >
                    {errors.agree}
                  </p>
                )}
              </div>

              <div>
                <Button type="submit" disabled={registerMutation.isPending}>
                  {registerMutation.isPending
                    ? "Đang tạo tài khoản…"
                    : "Tạo tài khoản phụ huynh"}
                </Button>
              </div>
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
