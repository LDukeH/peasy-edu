import Image from "next/image";

/**
 * Logo PeasyEdu (mascot + chữ + tagline) dùng ảnh thật tại public/brand/logo.png.
 * Kích thước gốc 400×116.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center rounded-xl bg-white px-3 py-2 ${className}`}>
      <Image
        src="/brand/bean_logo.png"
        alt="PeasyEdu – Cùng con tiến bộ"
        width={400}
        height={116}
        priority
        className="h-auto w-full"
      />
    </div>
  );
}
