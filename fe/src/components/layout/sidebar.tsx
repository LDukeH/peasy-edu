"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Inbox,
  Link2,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Star,
  LifeBuoy,
} from "lucide-react";
import { LogoPeasyEdu } from "@/components/common/logo";
import { useAuthSession } from "@/hooks/use-auth-session";
import { initials } from "@/lib/auth-labels";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string | null;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const COORDINATOR_GROUPS: NavGroup[] = [
  {
    title: "ĐIỀU PHỐI",
    items: [
      { label: "Tổng quan", href: "/dieu-phoi", icon: LayoutDashboard },
      { label: "Hồ sơ gia sư", href: null, icon: FileText },
      { label: "Yêu cầu", href: null, icon: Inbox, badge: "12" },
      { label: "Ghép gia sư", href: null, icon: Link2 },
      { label: "Gia sư", href: null, icon: GraduationCap },
      { label: "Gia đình", href: null, icon: Users },
    ],
  },
  {
    title: "GIẢNG DẠY",
    items: [
      { label: "Lớp học", href: null, icon: BookOpen },
      { label: "Lịch học", href: null, icon: Calendar },
      { label: "Điểm danh", href: null, icon: ClipboardCheck },
      { label: "Báo cáo buổi học", href: null, icon: FileText },
    ],
  },
  {
    title: "CHẤT LƯỢNG",
    items: [
      { label: "Đánh giá", href: null, icon: Star },
      { label: "Khiếu nại", href: null, icon: LifeBuoy },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthSession();

  const displayName = user?.hoTen ?? "Phạm Ngọc Linh";
  const displayInitials = initials(displayName);

  return (
    <aside className="sticky top-0 flex w-[228px] shrink-0 flex-col bg-[#075568] text-white h-screen select-none">
      {/* Brand header (72px matching Topbar) */}
      <div className="flex h-[72px] shrink-0 items-center border-b border-white/[0.18] px-[14px] py-[11px]">
        <Link href="/" className="hover:opacity-95 transition-opacity">
          <LogoPeasyEdu size="md" boxed />
        </Link>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 overflow-hidden px-[14px] pt-5 pb-6">
        <nav
          aria-label="Điều hướng điều phối"
          className="flex flex-1 flex-col gap-[14px] overflow-y-auto"
        >
          {COORDINATOR_GROUPS.map((group, groupIndex) => (
            <React.Fragment key={group.title}>
              {groupIndex > 0 && (
                <div className="h-px w-full shrink-0 bg-white/[0.18]" />
              )}
              <div className="flex flex-col gap-1.5">
                <p className="px-2 py-0.5 text-[11px] font-bold leading-[18px] tracking-[1.1px] text-[#a8e4ec] uppercase">
                  {group.title}
                </p>
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => {
                    const active = item.href ? pathname === item.href : false;
                    const Icon = item.icon;
                    const cls = cn(
                      "flex h-[44px] items-center gap-3 rounded-[8px] pl-[14px] pr-3 text-sm transition-colors",
                      active
                        ? "bg-[rgba(119,197,207,0.22)] border border-[rgba(143,217,227,0.35)] font-semibold leading-5 text-white"
                        : "font-normal leading-[22px] text-white/85 hover:bg-white/10 hover:text-white",
                    );

                    if (!item.href) {
                      return (
                        <span
                          key={item.label}
                          aria-disabled="true"
                          title="Sắp có"
                          className={cn(cls, "cursor-not-allowed opacity-75 hover:bg-transparent")}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className="text-xs font-semibold text-white/90">
                              {item.badge}
                            </span>
                          )}
                        </span>
                      );
                    }

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cls}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="text-xs font-semibold text-white/90">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </React.Fragment>
          ))}
        </nav>

        {/* Account block */}
        <div className="border-t border-white/[0.18] pt-5 px-2">
          <div className="flex items-start gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.09] text-xs font-semibold text-white">
              {displayInitials}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate text-sm font-semibold leading-5 text-white">
                {displayName}
              </p>
              <p className="text-xs leading-[18px] text-white/70">
                Điều phối · Tài khoản
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
