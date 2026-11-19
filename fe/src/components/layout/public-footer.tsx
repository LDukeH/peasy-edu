import React from "react";
import Link from "next/link";
import { ShieldCheck, Phone, Mail, MapPin } from "lucide-react";
import { LogoPeasyEdu } from "@/components/common/logo";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-[#10213a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="inline-block hover:opacity-95 transition-opacity">
              <LogoPeasyEdu variant="dark" size="md" />
            </Link>
            <p className="max-w-md text-sm text-[#c5d0da] leading-relaxed">
              Gia sư phù hợp. Lộ trình rõ ràng. Đồng hành mỗi ngày.
              Mô hình môi giới gia sư có quản lý một cơ sở, cam kết minh bạch học phí và chất lượng từng buổi học.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#77c5cf]">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Tuân thủ Thông tư 29/2024/TT-BGDĐT & Luật BV DLCN (01/01/2026)</span>
            </div>
          </div>

          {/* Column 2: Dịch vụ đào tạo */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#77c5cf] mb-3">
              Dịch vụ đào tạo
            </h4>
            <ul className="space-y-2 text-sm text-[#c5d4e2]">
              <li>
                <Link href="/dich-vu-hoc-phi" className="hover:text-white transition-colors">
                  Gia sư 1 kèm 1 tại nhà
                </Link>
              </li>
              <li>
                <Link href="/dich-vu-hoc-phi" className="hover:text-white transition-colors">
                  Học nhóm nhỏ (2–4 học viên)
                </Link>
              </li>
              <li>
                <Link href="/dich-vu-hoc-phi" className="hover:text-white transition-colors">
                  Gia sư trực tuyến toàn quốc
                </Link>
              </li>
              <li>
                <Link href="/dich-vu-hoc-phi" className="hover:text-white transition-colors">
                  Tiểu học, THCS & THPT
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Liên hệ trung tâm */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#77c5cf] mb-3">
              Liên hệ trung tâm
            </h4>
            <ul className="space-y-2.5 text-sm text-[#c5d4e2]">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#77c5cf] shrink-0" />
                <span>028 3822 0123 (08:00–20:00)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#77c5cf] shrink-0" />
                <span>hello@peasyedu.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#77c5cf] shrink-0" />
                <span>TP. Hồ Chí Minh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7b95ae]">
          <p>© 2026 PeasyEdu — Hệ thống quản lý trung tâm gia sư SE100.R12.</p>
          <div className="flex gap-4">
            <Link href="/dich-vu-hoc-phi" className="hover:text-white transition-colors">
              Dịch vụ & học phí
            </Link>
            <span className="text-white/20">·</span>
            <span className="text-[#9cb3c9]">Mã ngành 8561 (QĐ 36/2025/QĐ-TTg)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
