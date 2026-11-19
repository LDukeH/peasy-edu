"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/settings", label: "Trung tâm & quyền" },
  { href: "/admin/accounts", label: "Tài khoản" },
  { href: "/admin/categories", label: "Danh mục" },
  { href: null, label: "Nhật ký truy cập" },
  { href: null, label: "Sao lưu" },
];

export function AdminTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Điều hướng quản trị" className="flex flex-wrap gap-2">
      {TABS.map((t) => {
        const active = t.href === pathname;
        const cls = "rounded-lg px-4 py-3 text-sm font-semibold leading-5 whitespace-nowrap";
        if (!t.href)
          return (
            <span key={t.label} aria-disabled="true" title="Sắp có" className={`${cls} cursor-not-allowed text-muted/60`}>
              {t.label}
            </span>
          );
        return (
          <Link
            key={t.label}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`${cls} ${active ? "bg-brand-soft text-brand" : "text-muted hover:bg-white"}`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
