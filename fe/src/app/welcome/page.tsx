"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { VaiTro } from "@/api/generated/model";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useAuthSession, useSignOut } from "@/hooks/use-auth-session";
import { formatPhone, VAI_TRO_LABEL } from "@/lib/auth-labels";

export default function WelcomePage() {
  const router = useRouter();
  const { ready, user } = useAuthSession();
  const { signOut, isPending } = useSignOut();

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (user.vaiTro === VaiTro.QUAN_LY) router.replace("/admin/settings");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div
        role="status"
        className="flex flex-1 items-center justify-center p-8 text-sm text-text-muted"
      >
        Đang kiểm tra phiên đăng nhập…
      </div>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <div className="flex w-full max-w-[520px] flex-col gap-5 rounded-xl border border-line bg-white p-8">
        <Logo className="w-[200px] border border-line" />
        <h1 className="text-2xl font-semibold leading-10 text-ink">
          Xin chào, {user.hoTen}
        </h1>
        <p className="text-sm leading-[22px] text-text-muted">
          Đăng nhập thành công với vai trò <b>{VAI_TRO_LABEL[user.vaiTro]}</b> (
          {user.soDienThoai ? formatPhone(user.soDienThoai) : user.tenDangNhap}
          ). Giao diện cho vai trò này sẽ được bổ sung ở các bước sau.
        </p>
        <div>
          <Button variant="secondary" disabled={isPending} onClick={signOut}>
            {isPending ? "Đang đăng xuất…" : "Đăng xuất"}
          </Button>
        </div>
      </div>
    </main>
  );
}
