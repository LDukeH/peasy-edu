"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  ListChecks,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#33465c]">
      {/* 1. Header / Navbar */}
      <PublicNavbar />

      <main className="flex-1">
        {/* Điều hướng phiên bản: Xem trang chủ trên điện thoại */}
        <div className="bg-[#f5f8fa] border-b border-[#dce4eb] px-4 sm:px-8 lg:px-20 py-2.5">
          <button className="bg-white border border-[#dce4eb] px-4 py-2 rounded-lg text-xs font-semibold text-[#33465c] hover:bg-slate-50 transition-colors shadow-2xs">
            Xem trang chủ trên điện thoại
          </button>
        </div>

        {/* 2. HERO SECTION (Learning promise - Nền xanh ngọc nhạt #ddf2f4) */}
        <section className="bg-[#ddf2f4] px-4 sm:px-8 lg:px-20 py-12 lg:py-16 border-b border-[#dce4eb]">
          <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-between">
            {/* Cột trái: Thông điệp Hero */}
            <div className="flex-1 space-y-6 max-w-2xl">
              <p className="text-xs font-semibold text-[#116f7c] tracking-wider uppercase flex items-center gap-1.5">
                <span>●</span> GIA SƯ TẠI NHÀ, ONLINE & NHÓM · TP.HCM
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-bold text-[#172b4d] tracking-tight leading-[1.2]">
                <div>Đúng gia sư.</div>
                <div>Vững nền tảng.</div>
                <div>Tự tin tiến bộ.</div>
              </h1>

              <p className="text-base text-[#52677d] leading-relaxed">
                Mỗi học viên có một cách học riêng. PeasyEdu giúp gia đình tìm gia sư phù hợp, theo sát từng buổi và nhìn rõ sự tiến bộ của con.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/yeu-cau-tim-gia-su">
                  <Button className="h-11 px-5 bg-[#116f7c] hover:bg-[#0e5c66] text-white font-semibold rounded-lg shadow-xs">
                    <span>Tìm gia sư cho con</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/dich-vu-hoc-phi">
                  <Button
                    variant="outline"
                    className="h-11 px-5 bg-white border-[#dce4eb] text-[#33465c] font-semibold hover:bg-slate-50 rounded-lg shadow-xs"
                  >
                    Khám phá dịch vụ
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-[#52677d]">
                Tư vấn nhu cầu rõ ràng · Gia đình chủ động lựa chọn
              </p>
            </div>

            {/* Cột phải: Hình ảnh Gia sư & Học viên (hero-tutor.png) */}
            <div className="w-full lg:w-[540px] shrink-0">
              <div className="relative h-[340px] sm:h-[400px] w-full rounded-[20px] overflow-hidden shadow-sm border border-black/5 bg-slate-100">
                <Image
                  src="/brand/hero-tutor.png"
                  alt="Gia sư PeasyEdu đồng hành cùng học viên tại nhà"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Caption Card dưới ảnh */}
              <div className="mt-3 bg-white border border-[#dce4eb] rounded-xl p-4 flex items-center gap-3 shadow-xs">
                <div className="h-8 w-8 rounded-full bg-[#ddf2f4] flex items-center justify-center text-[#116f7c] shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold text-[#33465c] leading-snug">
                  Gia sư được xác minh bằng cấp,<br />
                  lịch học được cả gia đình và gia sư thống nhất.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRUST PRINCIPLES (Dải cam kết minh bạch) */}
        <section className="bg-white border-b border-[#dce4eb] px-4 sm:px-8 lg:px-20 py-8">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-lg bg-[#ddf2f4] text-[#116f7c] flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#52677d]">Đối chiếu bằng cấp và kinh nghiệm</p>
                <p className="text-sm font-semibold text-[#33465c]">Hồ sơ đã xác minh</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-lg bg-[#ddf2f4] text-[#116f7c] flex items-center justify-center shrink-0">
                <ListChecks className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#52677d]">Theo môn, lịch, khu vực và ngân sách</p>
                <p className="text-sm font-semibold text-[#33465c]">Đề xuất có lý do</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-lg bg-[#ddf2f4] text-[#116f7c] flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#52677d]">Điểm danh, báo cáo và bài tập rõ ràng</p>
                <p className="text-sm font-semibold text-[#33465c]">Theo sát mỗi buổi</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SUBJECTS AND SERVICES ("HỌC ĐÚNG ĐIỀU CON CẦN") */}
        <section className="px-4 sm:px-8 lg:px-20 py-14">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#116f7c] uppercase tracking-wider">
                HỌC ĐÚNG ĐIỀU CON CẦN
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#172b4d]">
                Từ củng cố nền tảng đến bứt phá mục tiêu
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cấp 1 */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-[#172b4d]">Tiểu học · Lớp 1–5</h3>
                  <p className="text-sm text-[#33465c] leading-relaxed">
                    Năng khiếu và kỹ năng: Piano, Vẽ, Cờ vua, Kỹ năng sống
                  </p>
                  <p className="text-xs text-[#52677d] leading-relaxed italic">
                    Theo TT 29/2024/TT-BGDĐT, học viên tiểu học chỉ học môn năng khiếu và kỹ năng.
                  </p>
                </div>
                <Link
                  href="/dich-vu-hoc-phi"
                  className="mt-6 text-sm font-semibold text-[#116f7c] hover:underline inline-flex items-center gap-1"
                >
                  <span>Xem lộ trình & học phí</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Cấp 2 */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-[#172b4d]">THCS · Lớp 6–9</h3>
                  <p className="text-sm text-[#33465c] leading-relaxed">
                    Toán, Văn, Anh, Khoa học tự nhiên
                  </p>
                  <p className="text-xs text-[#52677d] leading-relaxed">
                    Lấp lỗ hổng kiến thức, tự tin học trên lớp.
                  </p>
                </div>
                <Link
                  href="/dich-vu-hoc-phi"
                  className="mt-6 text-sm font-semibold text-[#116f7c] hover:underline inline-flex items-center gap-1"
                >
                  <span>Xem lộ trình & học phí</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Cấp 3 */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-[#172b4d]">THPT · Lớp 10–12</h3>
                  <p className="text-sm text-[#33465c] leading-relaxed">
                    Toán, Lý, Hóa, Văn, Anh
                  </p>
                  <p className="text-xs text-[#52677d] leading-relaxed">
                    Hệ thống kiến thức, luyện tập theo mục tiêu.
                  </p>
                </div>
                <Link
                  href="/dich-vu-hoc-phi"
                  className="mt-6 text-sm font-semibold text-[#116f7c] hover:underline inline-flex items-center gap-1"
                >
                  <span>Xem lộ trình & học phí</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. PROCESS STEPS ("4 BƯỚC, MỘT HÀNH TRÌNH RÕ RÀNG") */}
        <section className="bg-[#eaf0f5] px-4 sm:px-8 lg:px-20 py-14 border-y border-[#dce4eb]">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#116f7c] uppercase tracking-wider">
                4 BƯỚC, MỘT HÀNH TRÌNH RÕ RÀNG
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#172b4d]">
                Gia đình luôn là người lựa chọn
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-[#dce4eb] rounded-xl p-5 space-y-2.5 shadow-2xs">
                <p className="text-2xl font-bold text-[#116f7c]">01</p>
                <h4 className="text-base font-semibold text-[#33465c]">Chia sẻ nhu cầu</h4>
                <p className="text-sm text-[#52677d] leading-relaxed">
                  Môn học, mục tiêu, lịch rảnh và ngân sách.
                </p>
              </div>

              <div className="bg-white border border-[#dce4eb] rounded-xl p-5 space-y-2.5 shadow-2xs">
                <p className="text-2xl font-bold text-[#116f7c]">02</p>
                <h4 className="text-base font-semibold text-[#33465c]">Nhận 3 đề xuất</h4>
                <p className="text-sm text-[#52677d] leading-relaxed">
                  Điều phối chọn tối đa 3 gia sư theo tiêu chí rõ ràng.
                </p>
              </div>

              <div className="bg-white border border-[#116f7c]/30 rounded-xl p-5 space-y-2.5 shadow-xs">
                <p className="text-2xl font-bold text-[#116f7c]">03</p>
                <h4 className="text-base font-semibold text-[#33465c]">Chọn & học thử</h4>
                <p className="text-sm text-[#52677d] leading-relaxed">
                  Làm quen phương pháp trước khi quyết định học lâu dài.
                </p>
              </div>

              <div className="bg-white border border-[#dce4eb] rounded-xl p-5 space-y-2.5 shadow-2xs">
                <p className="text-2xl font-bold text-[#116f7c]">04</p>
                <h4 className="text-base font-semibold text-[#33465c]">Đồng hành mỗi buổi</h4>
                <p className="text-sm text-[#52677d] leading-relaxed">
                  Lịch định kỳ, báo cáo tiến bộ và học phí minh bạch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FEATURED TUTORS ("NGƯỜI ĐỒNG HÀNH TẬN TÂM" - Khớp 100% Ảnh 1) */}
        <section id="doi-ngu-gia-su" className="px-4 sm:px-8 lg:px-20 py-14">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#116f7c] uppercase tracking-wider">
                NGƯỜI ĐỒNG HÀNH TẬN TÂM
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#172b4d]">
                Hiểu môn học. Hiểu cách con học.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tutor 1 */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <p className="text-xs font-semibold text-[#116f7c]">✓ Bằng cấp đã xác minh</p>
                <div>
                  <h3 className="text-base font-bold text-[#172b4d]">Nguyễn Minh Anh</h3>
                  <div className="text-xs text-[#52677d] mt-1 space-y-0.5">
                    <p>Cử nhân Sư phạm Toán</p>
                    <p>ĐH Sư phạm TP.HCM</p>
                    <p>4 năm kinh nghiệm · Toán THCS</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-[#116f7c]">250.000 ₫ / 90 phút</p>
                <div className="text-xs text-[#33465c] space-y-1">
                  <p>Thứ 3, 5 · 18:30–20:00</p>
                  <p className="text-[#80520b] font-medium">★ 4,9 / 5 · 32 đánh giá</p>
                </div>
                <Link href="/ho-so-gia-su" className="block pt-1">
                  <Button variant="outline" className="w-full border-[#dce4eb] text-[#33465c] font-semibold hover:bg-slate-50">
                    Xem hồ sơ
                  </Button>
                </Link>
              </div>

              {/* Tutor 2 */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <p className="text-xs font-semibold text-[#116f7c]">✓ Bằng cấp đã xác minh</p>
                <div>
                  <h3 className="text-base font-bold text-[#172b4d]">Trần Quốc Bảo</h3>
                  <div className="text-xs text-[#52677d] mt-1 space-y-0.5">
                    <p>Cử nhân Toán học</p>
                    <p>ĐH Khoa học Tự nhiên</p>
                    <p>5 năm kinh nghiệm · Toán THCS</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-[#116f7c]">280.000 ₫ / 90 phút</p>
                <div className="text-xs text-[#33465c] space-y-1">
                  <p>Thứ 3, 5 · 18:30–20:00</p>
                  <p className="text-[#80520b] font-medium">★ 4,8 / 5 · 27 đánh giá</p>
                </div>
                <Link href="/ho-so-gia-su" className="block pt-1">
                  <Button variant="outline" className="w-full border-[#dce4eb] text-[#33465c] font-semibold hover:bg-slate-50">
                    Xem hồ sơ
                  </Button>
                </Link>
              </div>

              {/* Tutor 3 */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 space-y-4 hover:shadow-md transition-shadow">
                <p className="text-xs font-semibold text-[#116f7c]">✓ Bằng cấp đã xác minh</p>
                <div>
                  <h3 className="text-base font-bold text-[#172b4d]">Lê Thảo Vy</h3>
                  <div className="text-xs text-[#52677d] mt-1 space-y-0.5">
                    <p>Cử nhân Sư phạm Toán</p>
                    <p>ĐH Sư phạm TP.HCM</p>
                    <p>3 năm kinh nghiệm · Toán THCS</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-[#116f7c]">230.000 ₫ / 90 phút</p>
                <div className="text-xs text-[#33465c] space-y-1">
                  <p>Thứ 3, 5 · 18:30–20:00</p>
                  <p className="text-[#80520b] font-medium">★ 4,8 / 5 · 19 đánh giá</p>
                </div>
                <Link href="/ho-so-gia-su" className="block pt-1">
                  <Button variant="outline" className="w-full border-[#dce4eb] text-[#33465c] font-semibold hover:bg-slate-50">
                    Xem hồ sơ
                  </Button>
                </Link>
              </div>
            </div>
            <p className="text-xs text-[#52677d]">
              Gia sư thực tế được đề xuất sau khi xác nhận nhu cầu.
            </p>
          </div>
        </section>

        {/* 7. LEARNING OUTCOMES ("● NHÌN THẤY SỰ TIẾN BỘ" - Khớp 100% Ảnh 1) */}
        <section className="bg-[#ddf2f4] px-4 sm:px-8 lg:px-20 py-14 border-y border-[#dce4eb]">
          <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-10 items-start justify-between">
            {/* Cột trái: Thông điệp tiến bộ */}
            <div className="flex-1 space-y-4 max-w-xl">
              <p className="text-xs font-semibold text-[#116f7c] tracking-wider uppercase">
                ● NHÌN THẤY SỰ TIẾN BỘ
              </p>
              <h2 className="text-3xl font-bold text-[#172b4d] leading-snug">
                Không chỉ học thêm.<br />
                Con học cách tự tin hơn.
              </h2>
              <p className="text-sm text-[#52677d] leading-relaxed">
                Mục tiêu được thống nhất từ đầu. Gia đình biết con đã học gì, đang tiến bộ ở đâu và cần hỗ trợ điều gì.
              </p>
            </div>

            {/* Cột phải: Thẻ hành trình học tập minh họa */}
            <div className="w-full lg:w-[540px] bg-white border border-[#dce4eb] rounded-xl p-6 space-y-3.5 shadow-xs">
              <h3 className="text-base font-semibold text-[#172b4d]">
                Một hành trình học tập minh họa
              </h3>
              <p className="text-xs text-[#52677d]">
                Lê Hoàng Nam · Toán lớp 8 · Sau 4 tuần
              </p>
              
              <div className="space-y-1 pt-1">
                <p className="text-xs font-semibold text-[#33465c]">Nền tảng</p>
                <p className="text-xs text-[#52677d]">Tự làm đúng từ 6/10 → 8/10 bài</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#33465c]">Thói quen</p>
                <p className="text-xs text-[#52677d]">Chủ động trình bày cách giải và hoàn thành bài tập</p>
              </div>

              <p className="text-[11px] text-[#52677d] pt-2 border-t border-slate-100 italic leading-relaxed">
                Kết quả phụ thuộc nền tảng, sự tham gia và lộ trình của mỗi học viên. Không cam kết điểm số.
              </p>
            </div>
          </div>
        </section>

        {/* 8. TRANSPARENT FEES ("HỌC PHÍ DỄ HIỂU" - Khớp 100% Ảnh 1 & 2) */}
        <section className="px-4 sm:px-8 lg:px-20 py-14">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#116f7c] uppercase tracking-wider">
                HỌC PHÍ DỄ HIỂU
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#172b4d]">
                Rõ đơn giá. Đúng số buổi đã học.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tiểu học */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-[#172b4d]">Tiểu học</h3>
                  <p className="text-2xl font-bold text-[#116f7c]">180.000–250.000 ₫</p>
                  <p className="text-xs text-[#52677d] leading-relaxed">
                    / buổi 90 phút · Năng khiếu và kỹ năng: Piano, Vẽ, Cờ vua, Kỹ năng sống<br />
                    Theo TT 29/2024/TT-BGDĐT, học viên tiểu học chỉ học môn năng khiếu và kỹ năng.
                  </p>
                  <div className="text-xs text-[#33465c] space-y-1.5 pt-3 border-t border-slate-100">
                    <p>✓ Báo cáo sau buổi học</p>
                    <p>✓ Bài tập & tài liệu phù hợp</p>
                    <p>✓ Điều phối hỗ trợ lịch học</p>
                  </div>
                </div>
              </div>

              {/* THCS */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-[#172b4d]">THCS</h3>
                  <p className="text-2xl font-bold text-[#116f7c]">220.000–320.000 ₫</p>
                  <p className="text-xs text-[#52677d] leading-relaxed">
                    / buổi 90 phút · Gia sư 1:1 tại nhà
                  </p>
                  <div className="text-xs text-[#33465c] space-y-1.5 pt-3 border-t border-slate-100">
                    <p>✓ Báo cáo sau buổi học</p>
                    <p>✓ Bài tập & tài liệu phù hợp</p>
                    <p>✓ Điều phối hỗ trợ lịch học</p>
                  </div>
                </div>
              </div>

              {/* THPT */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-[#172b4d]">THPT</h3>
                  <p className="text-2xl font-bold text-[#116f7c]">280.000–400.000 ₫</p>
                  <p className="text-xs text-[#52677d] leading-relaxed">
                    / buổi 90 phút · Gia sư 1:1 tại nhà
                  </p>
                  <div className="text-xs text-[#33465c] space-y-1.5 pt-3 border-t border-slate-100">
                    <p>✓ Báo cáo sau buổi học</p>
                    <p>✓ Bài tập & tài liệu phù hợp</p>
                    <p>✓ Điều phối hỗ trợ lịch học</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#52677d]">
              Khoảng phí tham khảo theo môn, khối lớp và kinh nghiệm gia sư. Đơn giá học thử được báo trước. Chỉ tính buổi đã xác nhận: vắng có phép 0%, vắng không phép 50%.
            </p>
          </div>
        </section>

        {/* 9. TESTIMONIALS ("GÓC NHÌN TỪ GIA ĐÌNH" - Khớp 100% Ảnh 2) */}
        <section className="bg-[#f5f8fa] px-4 sm:px-8 lg:px-20 py-14 border-t border-[#dce4eb]">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#116f7c] uppercase tracking-wider">
                GÓC NHÌN TỪ GIA ĐÌNH
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#172b4d]">
                An tâm vì luôn biết con đang học thế nào
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 space-y-3">
                <p className="text-[#80520b] text-sm">★★★★★</p>
                <p className="text-base text-[#172b4d] leading-relaxed font-medium">
                  “Cô giải thích kiên nhẫn. Báo cáo sau mỗi buổi giúp tôi biết Nam cần luyện thêm điều gì.”
                </p>
                <p className="text-xs text-[#52677d]">Trần Thu Hà · Phụ huynh</p>
              </div>

              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 space-y-3">
                <p className="text-[#80520b] text-sm">★★★★★</p>
                <p className="text-base text-[#172b4d] leading-relaxed font-medium">
                  “Con hào hứng hơn với Toán. Trung tâm hỗ trợ thống nhất lịch rõ ràng ngay từ đầu.”
                </p>
                <p className="text-xs text-[#52677d]">Nguyễn Ngọc Mai · Phụ huynh</p>
              </div>
            </div>

            <p className="text-xs text-[#52677d]">Nhận xét minh họa.</p>
          </div>
        </section>

        {/* 10. FAQS ("GIA ĐÌNH THƯỜNG HỎI" - Khớp 100% Ảnh 2) */}
        <section className="px-4 sm:px-8 lg:px-20 py-14 border-t border-[#dce4eb]">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-[#116f7c] uppercase tracking-wider">
                GIA ĐÌNH THƯỜNG HỎI
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#172b4d]">
                Giải đáp trước khi bắt đầu
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white border border-[#dce4eb] rounded-xl p-5 space-y-2">
                <h3 className="text-base font-semibold text-[#172b4d]">
                  Gia sư được lựa chọn như thế nào?
                </h3>
                <p className="text-sm text-[#33465c] leading-relaxed">
                  Trung tâm xác minh hồ sơ, lọc theo chuyên môn, lịch, khu vực và ngân sách, rồi đề xuất tối đa 3 người để gia đình chọn.
                </p>
              </div>

              <div className="bg-white border border-[#dce4eb] rounded-xl p-5 space-y-2">
                <h3 className="text-base font-semibold text-[#172b4d]">
                  Nếu buổi học thử chưa phù hợp thì sao?
                </h3>
                <p className="text-sm text-[#33465c] leading-relaxed">
                  Gia đình trao đổi với điều phối viên để điều chỉnh nhu cầu và nhận đề xuất khác. Không tự động mở lớp sau học thử.
                </p>
              </div>

              <div className="bg-white border border-[#dce4eb] rounded-xl p-5 space-y-2">
                <h3 className="text-base font-semibold text-[#172b4d]">
                  Học phí được tính và thanh toán thế nào?
                </h3>
                <p className="text-sm text-[#33465c] leading-relaxed">
                  Ngày 01 lập nháp cho tháng trước, ngày 03 phát hành, hạn ngày 10. Thanh toán thủ công qua chuyển khoản hoặc tiền mặt có phiếu thu; kế toán đối chiếu và ghi nhận.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 11. INVITATION CTA BANNER (Aqua #77c5cf - Khớp 100% Ảnh 2) */}
        <section className="bg-[#77c5cf] px-4 sm:px-8 lg:px-20 py-14 text-center">
          <div className="mx-auto max-w-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172b4d]">
              Bắt đầu từ điều con cần hôm nay.
            </h2>
            <p className="text-sm text-[#172b4d]/90">
              Chia sẻ nhu cầu, để PeasyEdu cùng gia đình tìm người đồng hành.
            </p>
            <div className="pt-2">
              <Link href="/yeu-cau-tim-gia-su">
                <Button className="h-11 px-6 bg-white hover:bg-slate-50 text-[#172b4d] font-semibold rounded-lg shadow-sm">
                  <span>Gửi nhu cầu tìm gia sư</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            </div>
            <p className="text-xs text-[#172b4d]/80 pt-1">
              028 3822 0123 · Tư vấn 08:00–20:00
            </p>
          </div>
        </section>
      </main>

      {/* 12. Footer */}
      <PublicFooter />
    </div>
  );
}
