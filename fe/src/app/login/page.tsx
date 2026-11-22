"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { getAuthMeQueryKey, useAuthLogin } from "@/api/generated/peasyApi";
import { BrandPanel, PhotoPlaceholder } from "@/components/auth/brand-panel";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { useAuthSession } from "@/hooks/use-auth-session";
import { extractApiError } from "@/lib/api-error";
import { writeCachedUser } from "@/lib/auth-cache";
import {
  homeForRole,
  mapUserDtoToProfile,
  normalizePhone,
} from "@/lib/auth-labels";
import { useAuthStore } from "@/stores/auth-store";

interface Errors {
  username?: string;
  password?: string;
  form?: string;
}

function normalizeIdentifier(raw: string): string {
  const trimmed = raw.trim();
  // Nếu người dùng nhập số điện thoại có dấu cách (vd: "090 000 0003"), gom lại thành 10 chữ số
  if (/^[\d\s.-]+$/.test(trimmed)) {
    return normalizePhone(trimmed);
  }
  return trimmed;
}

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { ready, user } = useAuthSession();
  const loginMutation = useAuthLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (ready && user) {
      router.replace(homeForRole(user.vaiTro));
    }
  }, [ready, user, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setInfo("");
    const next: Errors = {};
    const tenDangNhap = normalizeIdentifier(username);
    if (!tenDangNhap) next.username = "Vui lòng nhập tên đăng nhập hoặc số điện thoại.";
    if (!password) next.password = "Vui lòng nhập mật khẩu.";
    setErrors(next);
    if (next.username || next.password) return;

    try {
      const loggedInUser = await loginMutation.mutateAsync({
        data: { tenDangNhap, matKhau: password },
      });
      writeCachedUser(loggedInUser);
      queryClient.setQueryData(getAuthMeQueryKey(), loggedInUser);
      useAuthStore.getState().setUser(mapUserDtoToProfile(loggedInUser));
      router.replace(homeForRole(loggedInUser.vaiTro));
    } catch (err) {
      const parsed = extractApiError(err, "Đăng nhập thất bại. Vui lòng thử lại.");
      setErrors({ form: parsed.message });
    }
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
          <p className="text-sm leading-[22px] text-text-muted">
            Đăng nhập bằng tên đăng nhập được cấp hoặc số điện thoại đã đăng ký.
          </p>

          {errors.form && <Notice tone="error">{errors.form}</Notice>}
          {info && <Notice tone="info">{info}</Notice>}

          <Field
            label="Tên đăng nhập hoặc số điện thoại *"
            type="text"
            autoComplete="username"
            placeholder="quanly01 hoặc 090 000 0003"
            value={username}
            error={errors.username}
            onChange={(e) => setUsername(e.target.value)}
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
            <Button type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Đang đăng nhập…" : "Đăng nhập →"}
            </Button>
          </div>

          <p className="text-sm leading-[22px] text-text-muted">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-brand hover:underline">
              Đăng ký Phụ huynh / Gia sư
            </Link>
          </p>
          <p className="text-xs leading-[18px] text-text-muted">
            Hỗ trợ đăng nhập: 028 3822 0123 · Không chia sẻ mật khẩu.
          </p>
        </form>
      </main>
    </div>
  );
}
