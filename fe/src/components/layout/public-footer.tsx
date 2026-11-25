import React from "react";
import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-[#10213a] text-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[80px] py-[40px] flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Cột 1: Brand */}
          <div className="space-y-1">
            <p className="text-base font-semibold leading-6 text-white">
              PeasyEdu
            </p>
            <p className="text-xs leading-[18px] text-[#c5d0da]">
              Gia sư phù hợp. Lộ trình rõ ràng.
            </p>
            <p className="text-xs leading-[18px] text-[#c5d0da]">
              Đồng hành mỗi ngày.
            </p>
          </div>

          {/* Cột 2: Liên hệ trung tâm */}
          <div className="space-y-1 text-xs leading-[18px] text-[#c5d0da]">
            <p className="uppercase tracking-wide">LIÊN HỆ TRUNG TÂM</p>
            <p>028 3822 0123 · hello@peasyedu.vn</p>
            <p>TP.HCM · 08:00–20:00, Thứ 2–Thứ 7</p>
          </div>

          {/* Cột 3: Thông tin hữu ích */}
          <div className="space-y-1 text-xs leading-[18px] text-[#c5d0da]">
            <p className="uppercase tracking-wide">THÔNG TIN HỮU ÍCH</p>
            <p>
              <Link
                href="/dich-vu-hoc-phi"
                className="hover:text-white transition-colors"
              >
                Dịch vụ &amp; học phí
              </Link>
              {" · "}
              <Link
                href="/ung-tuyen-gia-su"
                className="hover:text-white transition-colors"
              >
                Ứng tuyển gia sư
              </Link>
            </p>
            <p>Điều khoản · Chính sách bảo mật</p>
          </div>
        </div>

        <p className="text-xs leading-[18px] text-[#c5d0da]">
          © 2026 PeasyEdu.
        </p>
      </div>
    </footer>
  );
}
