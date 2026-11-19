import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";

export function BrandPanel({
  widthClass,
  gapClass,
  children,
}: {
  widthClass: string;
  gapClass: string;
  children: ReactNode;
}) {
  return (
    <aside
      className={`flex shrink-0 flex-col bg-sidebar p-8 text-white lg:p-16 ${gapClass} ${widthClass}`}
    >
      <Logo className="w-[200px]" />
      {children}
    </aside>
  );
}

/** Thay cho ảnh "Learning photograph" (cần tải từ Figma). */
export function PhotoPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="relative hidden h-[350px] w-full overflow-hidden rounded-[20px] bg-gradient-to-br from-[#3c94a4] via-[#116f7c] to-[#0a5464] lg:block"
    >
      <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 -left-10 size-64 rounded-full bg-white/10" />
      <p className="absolute bottom-5 left-6 text-xs text-white/70">
        (Ảnh minh họa · thay bằng ảnh từ Figma)
      </p>
    </div>
  );
}
