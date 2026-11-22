"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { VaiTro } from "@/api/generated/model";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useAuthSession } from "@/hooks/use-auth-session";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { ready, user } = useAuthSession();
  const allowed = user?.vaiTro === VaiTro.QUAN_LY;
  const granted = ready && !!user && allowed;

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (!allowed) router.replace("/welcome");
  }, [ready, user, allowed, router]);

  // Luôn render {children} để Next.js có thể xác thực segment (instant navigation).
  // Khi chưa có quyền, nội dung chỉ bị ẩn (hidden) và thay bằng dòng chờ.
  return (
    <>
      {!granted && (
        <div
          role="status"
          className="flex flex-1 items-center justify-center text-sm text-text-muted"
        >
          Đang kiểm tra quyền truy cập…
        </div>
      )}
      <div hidden={!granted} className={granted ? "flex-1 lg:pl-[228px]" : undefined}>
        {granted && user && <AdminSidebar user={user} />}
        <div className="flex min-h-screen flex-col">
          <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-line bg-white px-8 text-xs leading-[18px] text-text-muted">
            <p>
              <span className="font-brand font-bold text-logo-dark">Peasy</span>
              <span className="font-brand font-bold text-logo-light">Edu</span>
              {"  /  Quản trị truy cập"}
            </p>
          </header>
          <main className="flex flex-col gap-6 p-8">{children}</main>
        </div>
      </div>
    </>
  );
}
