"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { UserDto } from "@/api/generated/model";
import { LogoPeasyEdu } from "@/components/common/logo";
import { useSignOut } from "@/hooks/use-auth-session";
import { initials, VAI_TRO_LABEL } from "@/lib/auth-labels";
import { IconHistory, IconSliders, IconUser } from "./icons";

interface Item {
  href: string | null;
  label: string;
  icon: ReactNode;
  match: string[];
}

const ITEMS: Item[] = [
  {
    href: "/admin/settings",
    label: "Cài đặt & quyền",
    icon: <IconSliders />,
    match: ["/admin/settings", "/admin/categories"],
  },
  {
    href: "/admin/accounts",
    label: "Tài khoản",
    icon: <IconUser />,
    match: ["/admin/accounts"],
  },
  { href: null, label: "Nhật ký truy cập", icon: <IconHistory />, match: [] },
];

export function AdminSidebar({ user }: { user: UserDto }) {
  const pathname = usePathname();
  const { signOut, isPending } = useSignOut();

  return (
    <aside className="flex flex-col bg-[#075568] text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-[228px] select-none">
      {/* Brand header (72px matching Topbar) */}
      <div className="flex h-[72px] shrink-0 items-center border-b border-white/[0.18] px-[14px] py-[11px]">
        <Link href="/" className="hover:opacity-95 transition-opacity">
          <LogoPeasyEdu size="md" boxed />
        </Link>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 px-[14px] pt-5 pb-6 overflow-hidden">
        <nav
          aria-label="Quản trị truy cập"
          className="flex flex-1 flex-col gap-1.5 overflow-y-auto"
        >
          <p className="px-2 py-0.5 text-[11px] font-bold leading-[18px] tracking-[1.1px] text-[#a8e4ec] uppercase">
            QUẢN TRỊ TRUY CẬP
          </p>
          <ul className="flex flex-col gap-1">
            {ITEMS.map((item) => {
              const active = item.match.some((m) => pathname.startsWith(m));
              const cls = `flex h-[44px] items-center gap-3 rounded-[8px] pl-[14px] pr-3 text-sm transition-colors ${
                active
                  ? "bg-[rgba(119,197,207,0.22)] border border-[rgba(143,217,227,0.35)] font-semibold leading-5 text-white"
                  : "font-normal leading-[22px] text-white/85 hover:bg-white/10 hover:text-white"
              }`;
              return (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cls}
                    >
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      title="Sắp có"
                      className={`${cls} cursor-not-allowed opacity-65 hover:bg-transparent`}
                    >
                      {item.icon}
                      <span className="truncate">{item.label}</span>
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
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate text-sm font-semibold leading-5 text-white">
                {user.hoTen}
              </p>
              <p className="truncate text-xs leading-[18px] text-white/70">
                {VAI_TRO_LABEL[user.vaiTro]} · Tài khoản
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={signOut}
            className="cursor-pointer rounded-[8px] border border-white/25 px-3 py-2 text-left text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-60 transition-colors"
          >
            {isPending ? "Đang đăng xuất…" : "Đăng xuất"}
          </button>
        </div>
      </div>
    </aside>
  );
}
