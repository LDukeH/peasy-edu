import * as React from "react";
import { cn } from "@/lib/utils";
import type { TrangThaiTaiKhoan } from "@/api/generated/model";
import { TRANG_THAI_TAI_KHOAN_LABEL } from "@/lib/auth-labels";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "neutral"
    | "outline"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "accent";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants: Record<string, string> = {
    default: "border-transparent bg-[#116f7c] text-white",
    secondary: "border-transparent bg-[#eaf0f5] text-[#3d5266]",
    neutral: "border-transparent bg-[#eaf0f5] text-[#3d5266]",
    outline: "text-[#33465c] border-[#dce4eb] bg-white",
    destructive: "border-transparent bg-[#fdeeee] text-[#9f2424]",
    success: "border-transparent bg-[#ecfdf3] text-[#166534]",
    warning: "border-transparent bg-[#fff7de] text-[#7a440a]",
    info: "border-transparent bg-[#eaf7fa] text-[#155e75]",
    accent: "border-[#77c5cf] bg-[#ddf2f4] text-[#116f7c]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[6px] border px-[10px] py-[6px] text-xs font-semibold leading-[18px] whitespace-nowrap transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

const statusTones: Record<TrangThaiTaiKhoan, string> = {
  HOAT_DONG: "bg-[#ecfdf3] text-[#166534]",
  BI_KHOA: "bg-[#fdeeee] text-[#9f2424]",
};

export function StatusBadge({ status }: { status: TrangThaiTaiKhoan }) {
  return (
    <span
      className={`inline-flex rounded-[6px] px-[10px] py-[6px] text-xs font-semibold leading-[18px] whitespace-nowrap ${statusTones[status]}`}
    >
      {TRANG_THAI_TAI_KHOAN_LABEL[status]}
    </span>
  );
}
