"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { getAuthMeQueryKey, useAuthLogin } from "@/api/generated/peasyApi";
import { BrandPanel, LoginLearningPhoto } from "@/components/auth/brand-panel";
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
    if (!tenDangNhap)
      next.username = "Vui lòng nhập tên đăng nhập hoặc số điện thoại.";
    if (!password) next.password = "Vui lòng nhập mật khẩu.";
    setErrors(next);
    if (next.username || next.password) return;

    try {
      const loggedInUser = await loginMutation.mutateAsync({
        data: { tenDangNhap, matKhau: password, ghiNho: remember },
      });
      writeCachedUser(loggedInUser, { persistent: remember });
      queryClient.setQueryData(getAuthMeQueryKey(), loggedInUser);
      useAuthStore.getState().setUser(mapUserDtoToProfile(loggedInUser));
      router.replace(homeForRole(loggedInUser.vaiTro));
    } catch (err) {
      const parsed = extractApiError(
        err,
        "Mật khẩu chưa đúng. Thử lại hoặc chọn Quên mật khẩu.",
      );
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
          <p className="text-base leading-6 text-[#c5d0da]">
            Theo dõi lịch học, báo cáo và tiến bộ của con ở một nơi.
          </p>
        </div>
        <LoginLearningPhoto />
        <p className="text-xs leading-[18px] text-[#c5d0da]">
          PeasyEdu · Đồng hành cùng gia đình và gia sư.
        </p>
      </BrandPanel>

      <main className="flex flex-1 flex-col gap-[26px] p-8 lg:p-[100px]">
        <form
          onSubmit={onSubmit}
          noValidate
          className="flex w-full max-w-[590px] flex-col gap-[26px]"
        >
          <h1 className="text-[32px] font-semibold leading-[44px] text-[#33465c]">
            Đăng nhập
          </h1>
          <p className="text-sm leading-[22px] text-[#52677d]">
            Đăng nhập bằng tài khoản được cấp hoặc đã đăng ký. Không cần chọn vai trò để thay đổi quyền.
          </p>

          {errors.form && <Notice tone="error">{errors.form}</Notice>}
          {info && <Notice tone="info">{info}</Notice>}

          <Field
            label="Số điện thoại * (tên đăng nhập)"
            type="text"
            autoComplete="username"
            placeholder="090 123 4567 hoặc quanly01"
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
            <label className="flex cursor-pointer items-center gap-2 text-xs leading-[18px] text-[#33465c]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 accent-[#116f7c]"
              />
              Ghi nhớ đăng nhập
            </label>
            <button
              type="button"
              onClick={() =>
                setInfo("Tính năng khôi phục mật khẩu sẽ có ở bước sau.")
              }
              className="cursor-pointer text-xs leading-[18px] text-[#116f7c] hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          <div>
            <Button type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Đang đăng nhập…" : "Đăng nhập →"}
            </Button>
          </div>

          <p className="text-sm leading-[22px] text-[#52677d]">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-[#116f7c] hover:underline">
              Đăng ký Phụ huynh / Gia sư
            </Link>
          </p>
          <p className="text-xs leading-[18px] text-[#52677d]">
            Hỗ trợ đăng nhập: 028 3822 0123 · Không chia sẻ mật khẩu.
          </p>
        </form>
      </main>
    </div>
  );
}
