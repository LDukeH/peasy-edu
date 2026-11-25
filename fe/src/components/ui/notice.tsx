import type { ReactNode } from "react";

type Tone = "info" | "brand" | "warning" | "success" | "error";

const tones: Record<Tone, string> = {
  info: "bg-[#ddf2f4] text-[#116f7c]",
  brand: "bg-[#eaf7fa] text-[#155e75]",
  success: "bg-[#ecfdf3] text-[#166534]",
  warning: "bg-[#fff7de] text-[#7a440a]",
  error: "bg-[#fdeeee] text-[#9f2424]",
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
      className={`flex flex-col gap-1.5 rounded-[8px] p-4 ${small ? "text-xs leading-[18px]" : "text-sm leading-[22px]"} ${tones[tone]} ${className}`}
    >
      {title && <p className="font-semibold leading-5">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
