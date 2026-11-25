import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
  showSlogan?: boolean;
  size?: "sm" | "md" | "lg";
  boxed?: boolean;
}

/**
 * LogoPeasyEdu - Đồng bộ chính xác theo Figma design (node 2236:16141)
 * Container: bg-[#f7fafb] rounded-[12px] pl-[10px] pr-[14px] py-[4px] h-[50px] w-[178px]
 * Brand: Fredoka Bold 20px/24px Peasy (#0a5464) Edu (#3c94a4)
 * Slogan: Inter SemiBold 12px/16px CÙNG CON TIẾN BỘ (#116f7c)
 */
export function LogoPeasyEdu({
  className,
  variant = "light",
  showSlogan = true,
  size = "md",
  boxed = true,
}: LogoProps) {
  const isDark = variant === "dark" && !boxed;

  const sizeConfigs = {
    sm: {
      mascotWidth: 22,
      mascotHeight: 36,
      textSize: "text-[18px] leading-[22px]",
      sloganSize: "text-[10px] leading-[14px]",
      gap: "gap-2",
      box: "rounded-[10px] pl-[8px] pr-[12px] py-[4px]",
    },
    md: {
      mascotWidth: 26,
      mascotHeight: 42,
      textSize: "text-[20px] leading-[24px]",
      sloganSize: "text-[12px] leading-[16px]",
      gap: "gap-[10px]",
      box: "h-[50px] w-[178px] rounded-[12px] pl-[10px] pr-[14px] py-[4px]",
    },
    lg: {
      mascotWidth: 32,
      mascotHeight: 50,
      textSize: "text-[24px] leading-[28px]",
      sloganSize: "text-[12px] leading-[16px]",
      gap: "gap-3",
      box: "rounded-[14px] pl-[12px] pr-[16px] py-[6px]",
    },
  };

  const currentSize = sizeConfigs[size];

  return (
    <div
      className={cn(
        "flex items-center shrink-0 select-none overflow-hidden",
        currentSize.gap,
        boxed && "bg-[#f7fafb]",
        boxed && currentSize.box,
        className,
      )}
    >
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: currentSize.mascotWidth, height: currentSize.mascotHeight }}
      >
        <Image
          src="/brand/mascot.png"
          alt="PeasyEdu Mascot"
          width={currentSize.mascotWidth * 2}
          height={currentSize.mascotHeight * 2}
          className="object-contain h-full w-auto"
          priority
        />
      </div>

      <div className="flex flex-col items-start gap-[2px] min-w-0">
        <p className={cn("font-brand font-bold tracking-normal whitespace-nowrap", currentSize.textSize)}>
          <span className={isDark ? "text-white" : "text-[#0a5464]"}>Peasy</span>
          <span className={isDark ? "text-[#77c5cf]" : "text-[#3c94a4]"}>Edu</span>
        </p>
        {showSlogan && (
          <p
            className={cn(
              "font-sans font-semibold whitespace-nowrap uppercase",
              currentSize.sloganSize,
              isDark ? "text-[#77c5cf]" : "text-[#116f7c]",
            )}
          >
            CÙNG CON TIẾN BỘ
          </p>
        )}
      </div>
    </div>
  );
}
