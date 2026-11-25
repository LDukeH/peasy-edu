"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { VaiTro } from "@/api/generated/model";
import { AdminSidebar } from "@/components/admin/sidebar";
import { useAuthSession } from "@/hooks/use-auth-session";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, user } = useAuthSession();
  const allowed = user?.vaiTro === VaiTro.QUAN_LY;
  const granted = ready && !!user && allowed;
  const isSettings = pathname === "/admin/settings";

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (!allowed) router.replace("/welcome");
  }, [ready, user, allowed, router]);

  return (
    <>
      {!granted && (
        <div
          role="status"
          className="flex flex-1 items-center justify-center text-sm text-[#52677d]"
        >
          Đang kiểm tra quyền truy cập…
        </div>
      )}
      <div
        hidden={!granted}
        className={granted ? "flex-1 bg-[#f5f8fa] lg:pl-[228px]" : undefined}
      >
        {granted && user && <AdminSidebar user={user} />}
        <div className="flex min-h-screen flex-col">
          <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#dce4eb] bg-white px-8">
            {isSettings ? (
              <>
                <p className="text-[13px] font-medium leading-[18px] text-[#3d5266]">
                  <span>Quản trị</span>
                  <span className="mx-2">/</span>
                  <span className="font-semibold text-[#172b4d]">PeasyEdu</span>
                </p>
                <button
                  type="button"
                  className="bg-white border border-[#d9e0e8] rounded-[8px] pl-3 pr-2 py-1.5 flex items-center gap-2 text-xs leading-[18px] text-[#172b4d]"
                >
                  <span>Thông báo</span>
                  <span className="size-5 rounded-full bg-[#116f7c] text-white text-xs font-semibold flex items-center justify-center">
                    3
                  </span>
                </button>
              </>
            ) : (
              <>
                <p className="text-xs leading-[18px] text-[#52677d]">
                  <span className="font-brand font-bold text-[#0a5464]">
                    Peasy
                  </span>
                  <span className="font-brand font-bold text-[#3c94a4]">
                    Edu
                  </span>
                  {"  /  Quản trị truy cập"}
                </p>
                <p className="hidden sm:block text-xs leading-[18px] text-[#52677d]">
                  Một trung tâm · Phạm vi nội bộ
                </p>
              </>
            )}
          </header>
          <main className="flex flex-col gap-6 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </>
  );
}
