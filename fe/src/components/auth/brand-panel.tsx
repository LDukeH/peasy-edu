import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogoPeasyEdu } from "@/components/common/logo";

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
      className={`flex shrink-0 flex-col bg-[#075568] p-8 text-white lg:p-16 ${gapClass} ${widthClass}`}
    >
      <Link href="/" className="w-fit hover:opacity-95 transition-opacity">
        <LogoPeasyEdu size="md" boxed />
      </Link>
      {children}
    </aside>
  );
}

export function LoginLearningPhoto() {
  return (
    <div className="relative hidden h-[350px] w-full overflow-hidden rounded-[20px] bg-[#0a5f70] lg:block">
      <Image
        src="/brand/login-learning.png"
        alt="Gia sư PeasyEdu hướng dẫn học viên học tập"
        fill
        sizes="(max-width: 1024px) 100vw, 522px"
        className="object-cover"
        priority
      />
    </div>
  );
}
