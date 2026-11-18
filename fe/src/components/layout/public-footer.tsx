import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, Phone, Mail, MapPin } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-[#10213a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Column 1: Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Peasy<span className="text-[#77c5cf]">Edu</span>
              </span>
            </div>
            <p className="max-w-md text-sm text-[#9cb3c9] leading-relaxed">
              Hệ thống quản lý trung tâm gia sư một cơ sở theo mô hình môi giới có quản lý.
              Kết nối gia sư chất lượng cao dạy tại nhà hoặc trực tuyến, cam kết minh bạch học phí và chất lượng từng buổi học.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#77c5cf]">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Tuân thủ Thông tư 29/2024/TT-BGDĐT & Luật BV DLCN (01/01/2026)</span>
            </div>
          </div>

          {/* Column 2: Dịch vụ */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-3">
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
                  Luyện thi lớp 10 & THPT QG
                </Link>
              </li>
              <li>
                <Link href="/dich-vu-hoc-phi" className="hover:text-white transition-colors">
                  Ngoại ngữ & Năng khiếu
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Liên hệ */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-3">
              Thông tin liên hệ
            </h4>
            <ul className="space-y-2.5 text-sm text-[#c5d4e2]">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#77c5cf] shrink-0" />
                <span>TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#77c5cf] shrink-0" />
                <span>Hotline: 0901 234 567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#77c5cf] shrink-0" />
                <span>hotro@giasu.edu.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-[#7b95ae]">
          © 2026 Trung tâm Gia sư ABC — Đồ án SE100.R12. Mã ngành 8561 (Quyết định 36/2025/QĐ-TTg).
        </div>
      </div>
    </footer>
  );
}
