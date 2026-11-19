import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
  showSlogan?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * LogoPeasyEdu - Đồng bộ chính xác theo Figma design (node 2236:16141 & 2236:7204)
 * Mascot: Chú đậu xanh đội mũ cử nhân và đeo kính
 * Brand: Peasy (#0a5464 / #ffffff) Edu (#3c94a4 / #77c5cf)
 * Slogan: CÙNG CON TIẾN BỘ
 */
export function LogoPeasyEdu({
  className,
  variant = "light",
  showSlogan = true,
  size = "md",
}: LogoProps) {
  const isDark = variant === "dark";

  const sizeConfigs = {
    sm: {
      mascotWidth: 20,
      mascotHeight: 32,
      textSize: "text-base",
      sloganSize: "text-[8px]",
      gap: "gap-2",
    },
    md: {
      mascotWidth: 26,
      mascotHeight: 42,
      textSize: "text-[20px]",
      sloganSize: "text-[10px]",
      gap: "gap-2.5",
    },
    lg: {
      mascotWidth: 32,
      mascotHeight: 52,
      textSize: "text-2xl",
      sloganSize: "text-xs",
      gap: "gap-3",
    },
  };

  const currentSize = sizeConfigs[size];

  return (
    <div
      className={cn(
        "flex items-center shrink-0 select-none",
        currentSize.gap,
        className,
      )}
    >
      {/* PeasyEdu Mascot */}
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

      {/* Brand copy: PeasyEdu + Slogan */}
      <div className="flex flex-col leading-none">
        <p className={cn("font-bold tracking-tight", currentSize.textSize)}>
          <span className={isDark ? "text-white" : "text-[#0a5464]"}>Peasy</span>
          <span className={isDark ? "text-[#77c5cf]" : "text-[#3c94a4]"}>Edu</span>
        </p>
        {showSlogan && (
          <p
            className={cn(
              "font-semibold tracking-wider mt-0.5 uppercase",
              currentSize.sloganSize,
              isDark ? "text-[#77c5cf]" : "text-[#3c94a4]",
            )}
          >
            CÙNG CON TIẾN BỘ
          </p>
        )}
      </div>
    </div>
  );
}
