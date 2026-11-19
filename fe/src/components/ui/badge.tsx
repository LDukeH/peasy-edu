import * as React from "react";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, type AccountStatus } from "@/mocks/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "destructive"
    | "success"
    | "warning"
    | "accent";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants: Record<string, string> = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground font-medium",
    outline: "text-foreground border-border",
    destructive:
      "border-transparent bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200",
    success:
      "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200",
    warning:
      "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200",
    accent: "border-transparent bg-teal-100 text-teal-800 border border-teal-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

const statusTones: Record<AccountStatus, string> = {
  HOAT_DONG: "bg-brand-soft text-brand",
  BI_KHOA: "bg-danger-soft text-danger",
  CHO_KICH_HOAT: "bg-warn-soft text-warn",
};

export function StatusBadge({ status }: { status: AccountStatus }) {
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1.5 text-xs font-semibold leading-[18px] whitespace-nowrap ${statusTones[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
