import type { ReactNode } from "react";

type Tone = "info" | "warning" | "success" | "error";

const tones: Record<Tone, string> = {
  info: "bg-brand-soft text-brand",
  success: "bg-brand-soft text-brand",
  warning: "bg-warn-soft text-warn",
  error: "bg-danger-soft text-danger",
};

export function Notice({
  tone = "info",
  title,
  children,
  className = "",
  small = false,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
  small?: boolean;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex flex-col gap-1.5 rounded-lg p-4 ${small ? "text-xs leading-[18px]" : "text-sm leading-[22px]"} ${tones[tone]} ${className}`}
    >
      {title && <p className="font-semibold leading-5">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
