"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useMockSession } from "@/mocks/session";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { ready, account } = useMockSession();
  const allowed = account?.role === "QUAN_TRI_VIEN";
  const granted = ready && !!account && allowed;

  useEffect(() => {
    if (!ready) return;
    if (!account) router.replace("/login");
    else if (!allowed) router.replace("/welcome");
  }, [ready, account, allowed, router]);

  // Luôn render {children} để Next.js có thể xác thực segment (instant navigation).
  // Khi chưa có quyền, nội dung chỉ bị ẩn (hidden) và thay bằng dòng chờ.
  return (
    <>
      {!granted && (
        <div
          role="status"
          className="flex flex-1 items-center justify-center text-sm text-muted"
        >
          Đang kiểm tra quyền truy cập…
        </div>
      )}
      <div hidden={!granted} className={granted ? "flex-1 lg:pl-[228px]" : undefined}>
        {granted && account && <AdminSidebar account={account} />}
        <div className="flex min-h-screen flex-col">
          <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-line bg-white px-8 text-xs leading-[18px] text-muted">
            <p>
              <span className="font-brand font-bold text-logo-dark">Peasy</span>
              <span className="font-brand font-bold text-logo-light">Edu</span>
              {"  /  Quản trị truy cập"}
            </p>
            <p>Một trung tâm · Phạm vi nội bộ</p>
          </header>
          <main className="flex flex-col gap-6 p-8">{children}</main>
        </div>
      </div>
    </>
  );
}