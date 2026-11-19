"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { formatPhone } from "@/mocks/format";
import { endSession, useMockSession } from "@/mocks/session";
import { ROLE_LABEL } from "@/mocks/types";

export default function WelcomePage() {
  const router = useRouter();
  const { ready, account } = useMockSession();

  useEffect(() => {
    if (ready && !account) router.replace("/login");
    if (ready && account?.role === "QUAN_TRI_VIEN") router.replace("/admin/settings");
  }, [ready, account, router]);

  if (!account) return null;

  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <div className="flex w-full max-w-[520px] flex-col gap-5 rounded-xl border border-line bg-white p-8">
        <Logo className="w-[200px] border border-line" />
        <h1 className="text-2xl font-semibold leading-10 text-ink">
          Xin chào, {account.fullName}
        </h1>
        <p className="text-sm leading-[22px] text-muted">
          Đăng nhập thành công với vai trò <b>{ROLE_LABEL[account.role]}</b> (
          {formatPhone(account.phone)}). Giao diện cho vai trò này sẽ được bổ
          sung ở các bước sau.
        </p>
        <div>
          <Button
            variant="secondary"
            onClick={() => {
              endSession();
              router.replace("/login");
            }}
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </main>
  );
}
