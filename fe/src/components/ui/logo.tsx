import { LogoPeasyEdu } from "@/components/common/logo";

export function Logo({ className = "" }: { className?: string; imageWidth?: string }) {
  return <LogoPeasyEdu size="md" boxed className={className} />;
}
