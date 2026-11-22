"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { UserDto } from "@/api/generated/model";
import { Logo } from "@/components/ui/logo";
import { useSignOut } from "@/hooks/use-auth-session";
import { initials, VAI_TRO_LABEL } from "@/lib/auth-labels";
import { IconHistory, IconSliders, IconUser } from "./icons";

interface Item {
  href: string | null; // null = chưa có màn hình
  label: string;
  icon: ReactNode;
  match: string[];
}

const ITEMS: Item[] = [
  {
    href: "/admin/settings",
    label: "Cài đặt & phân quyền",
    icon: <IconSliders />,
    match: ["/admin/settings", "/admin/categories"],
  },
  { href: "/admin/accounts", label: "Tài khoản", icon: <IconUser />, match: ["/admin/accounts"] },
  { href: null, label: "Nhật ký truy cập", icon: <IconHistory />, match: [] },
];

export function AdminSidebar({ user }: { user: UserDto }) {
  const pathname = usePathname();
  const { signOut, isPending } = useSignOut();

  return (
    <aside className="flex flex-col gap-5 bg-sidebar px-3.5 pb-6 pt-7 lg:fixed lg:inset-y-0 lg:left-0 lg:w-[228px]">
      <Logo className="w-full" />
      <Divider />
      <div className="flex h-11 items-center rounded-lg bg-white/[0.09] p-3 text-sm font-semibold leading-5 text-white">
        {VAI_TRO_LABEL[user.vaiTro]}
      </div>
      <Divider />

      <nav aria-label="Quản trị truy cập" className="flex flex-1 flex-col gap-2">
        <p className="px-3 text-xs font-semibold leading-[18px] text-white/70">
          QUẢN TRỊ TRUY CẬP
        </p>
        <ul className="flex flex-col gap-1">
          {ITEMS.map((item) => {
            const active = item.match.some((m) => pathname.startsWith(m));
            const cls = `flex h-11 items-center gap-3 rounded-lg px-3 text-sm ${
              active
                ? "bg-white/95 font-semibold text-sidebar-active"
                : "text-white/85 hover:bg-white/10"
            }`;
            return (
              <li key={item.label}>
                {item.href ? (
                  <Link href={item.href} aria-current={active ? "page" : undefined} className={cls}>
                    {item.icon}
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    title="Sắp có"
                    className={`${cls} cursor-not-allowed opacity-60 hover:bg-transparent`}
                  >
                    {item.icon}
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-3 border-t border-white/[0.18] px-2 pt-5">
        <div className="flex items-start gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.09] text-xs font-semibold text-white">
            {initials(user.hoTen)}
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate text-sm font-semibold leading-5 text-white">{user.hoTen}</p>
            <p className="text-xs leading-[18px] text-white/70">
              {user.maDoiTuong ?? user.tenDangNhap} · Tài khoản của tôi
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={isPending}
          onClick={signOut}
          className="cursor-pointer rounded-lg border border-white/25 px-3 py-2 text-left text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-60"
        >
          {isPending ? "Đang đăng xuất…" : "Đăng xuất"}
        </button>
      </div>
    </aside>
  );
}

function Divider() {
  return <div className="h-px w-full bg-white/[0.18]" />;
}
