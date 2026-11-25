"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ListChecks, TrendingUp } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";

const FEATURED_TUTORS = [
  {
    initials: "MA",
    name: "Nguyễn Minh Anh",
    degree: "Cử nhân Sư phạm Toán",
    school: "ĐH Sư phạm TP.HCM",
    exp: "4 năm kinh nghiệm · Toán THCS",
    fee: "250.000 ₫ / 90 phút",
    schedule: "Thứ 3, 5 · 18:30–20:00",
    rating: "★ 4,9 / 5 · 32 đánh giá",
  },
  {
    initials: "QB",
    name: "Trần Quốc Bảo",
    degree: "Cử nhân Toán học",
    school: "ĐH Khoa học Tự nhiên",
    exp: "5 năm kinh nghiệm · Toán THCS",
    fee: "280.000 ₫ / 90 phút",
    schedule: "Thứ 3, 5 · 18:30–20:00",
    rating: "★ 4,8 / 5 · 27 đánh giá",
  },
  {
    initials: "TV",
    name: "Lê Thảo Vy",
    degree: "Cử nhân Sư phạm Toán",
    school: "ĐH Sư phạm TP.HCM",
    exp: "3 năm kinh nghiệm · Toán THCS",
    fee: "230.000 ₫ / 90 phút",
    schedule: "Thứ 3, 5 · 18:30–20:00",
    rating: "★ 4,8 / 5 · 19 đánh giá",
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Chia sẻ nhu cầu",
    desc: "Môn học, mục tiêu, lịch rảnh và ngân sách.",
  },
  {
    num: "02",
    title: "Nhận 3 đề xuất",
    desc: "Điều phối chọn tối đa 3 gia sư theo tiêu chí rõ ràng.",
  },
  {
    num: "03",
    title: "Chọn & học thử",
    desc: "Làm quen phương pháp trước khi quyết định học lâu dài.",
  },
  {
    num: "04",
    title: "Đồng hành mỗi buổi",
    desc: "Lịch định kỳ, báo cáo tiến bộ và học phí minh bạch.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#33465c]">
      <PublicNavbar />

      <main className="flex-1">
        {/* 1. HERO SECTION (Learning promise - #ddf2f4) */}
        <section className="bg-[#ddf2f4]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[80px] py-12 lg:py-[64px] flex flex-col lg:flex-row gap-10 lg:gap-[64px] items-center">
            {/* Cột trái */}
            <div className="flex-1 flex flex-col gap-[22px] items-start">
              <p className="text-xs font-semibold leading-[18px] text-[#116f7c]">
                ● GIA SƯ TẠI NHÀ, ONLINE &amp; NHÓM · TP.HCM
              </p>

              <h1 className="font-display font-bold text-[36px] sm:text-[44px] lg:text-[48px] leading-[1.28] lg:leading-[64px] tracking-[-0.96px] text-[#172b4d]">
                Tìm gia sư 1:1 tại nhà ở TP.HCM
              </h1>

              <p className="text-base leading-6 text-[#1e4b56] max-w-[600px]">
                Chọn từ tối đa 3 đề xuất phù hợp, học thử rồi mới quyết định. Theo sát mục tiêu, tiến bộ và bài tập sau từng buổi học.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/yeu-cau-tim-gia-su">
                  <Button variant="primary">Tìm gia sư cho con</Button>
                </Link>
                <Link href="/dich-vu-hoc-phi">
                  <Button variant="secondary">Xem bảng học phí</Button>
                </Link>
              </div>

              <p className="text-xs leading-[18px] text-[#1e4b56]">
                Tư vấn miễn phí, chỉ mở lớp khi gia đình đồng ý sau buổi học thử.
              </p>
            </div>

            {/* Cột phải: Ảnh + Caption sát dưới */}
            <div className="w-full lg:w-[580px] shrink-0 flex flex-col">
              <div className="relative h-[300px] sm:h-[380px] lg:h-[420px] w-full rounded-[20px] overflow-hidden bg-slate-100">
                <Image
                  src="/brand/hero-tutor.png"
                  alt="Gia sư PeasyEdu đồng hành cùng học viên tại nhà"
                  fill
                  sizes="(max-width: 1024px) 100vw, 580px"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="bg-white rounded-[12px] p-[18px] flex items-start gap-3">
                <ShieldCheck className="h-[25px] w-[25px] text-[#116f7c] shrink-0" />
                <div className="text-xs font-semibold leading-[18px] text-[#33465c]">
                  <p>Trung tâm đối chiếu bằng cấp gia sư.</p>
                  <p>Lịch học do gia đình và gia sư cùng chốt.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. TRUST PRINCIPLES */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[80px] py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-[14px]">
              <ShieldCheck className="h-6 w-6 text-[#116f7c] shrink-0" />
              <div>
                <p className="text-xs leading-[18px] text-[#52677d]">
                  Đối chiếu bằng cấp và kinh nghiệm
                </p>
                <p className="text-sm font-semibold leading-5 text-[#33465c]">
                  Hồ sơ đã xác minh
                </p>
              </div>
            </div>

            <div className="flex items-start gap-[14px]">
              <ListChecks className="h-6 w-6 text-[#116f7c] shrink-0" />
              <div>
                <p className="text-xs leading-[18px] text-[#52677d]">
                  Theo môn, lịch, khu vực và ngân sách
                </p>
                <p className="text-sm font-semibold leading-5 text-[#33465c]">
                  Đề xuất có lý do
                </p>
              </div>
            </div>

            <div className="flex items-start gap-[14px]">
              <TrendingUp className="h-6 w-6 text-[#116f7c] shrink-0" />
              <div>
                <p className="text-xs leading-[18px] text-[#52677d]">
                  Điểm danh, báo cáo và bài tập rõ ràng
                </p>
                <p className="text-sm font-semibold leading-5 text-[#33465c]">
                  Theo sát mỗi buổi
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SUBJECTS AND SERVICES */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[80px] py-[48px] flex flex-col gap-7">
            <h2 className="font-display font-bold text-[26px] sm:text-[32px] leading-[1.35] lg:leading-[44px] tracking-[-0.64px] text-[#172b4d]">
              Từ củng cố nền tảng đến bứt phá mục tiêu
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col justify-between gap-[18px]">
                <div className="flex flex-col gap-[18px]">
                  <h3 className="text-base font-semibold leading-6 text-[#172b4d]">
                    Tiểu học · Lớp 1–5
                  </h3>
                  <div className="text-sm leading-[22px] text-[#33465c]">
                    <p>Năng khiếu và kỹ năng: Piano, Vẽ, Cờ vua, Kỹ năng sống</p>
                    <p>
                      Theo TT 29/2024/TT-BGDĐT, học viên tiểu học chỉ học môn năng khiếu và kỹ năng.
                    </p>
                  </div>
                </div>
                <Link
                  href="/dich-vu-hoc-phi"
                  className="text-sm leading-[22px] text-[#33465c] hover:text-[#116f7c] transition-colors"
                >
                  Xem lộ trình &amp; học phí →
                </Link>
              </div>

              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col justify-between gap-[18px]">
                <div className="flex flex-col gap-[18px]">
                  <h3 className="text-base font-semibold leading-6 text-[#172b4d]">
                    THCS · Lớp 6–9
                  </h3>
                  <div className="text-sm leading-[22px] text-[#33465c] space-y-5">
                    <p>Toán, Văn, Anh, Khoa học tự nhiên</p>
                    <p>Lấp lỗ hổng kiến thức, tự tin học trên lớp.</p>
                  </div>
                </div>
                <Link
                  href="/dich-vu-hoc-phi"
                  className="text-sm leading-[22px] text-[#33465c] hover:text-[#116f7c] transition-colors"
                >
                  Xem lộ trình &amp; học phí →
                </Link>
              </div>

              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col justify-between gap-[18px]">
                <div className="flex flex-col gap-[18px]">
                  <h3 className="text-base font-semibold leading-6 text-[#172b4d]">
                    THPT · Lớp 10–12
                  </h3>
                  <div className="text-sm leading-[22px] text-[#33465c] space-y-5">
                    <p>Toán, Lý, Hóa, Văn, Anh</p>
                    <p>Hệ thống kiến thức, luyện tập theo mục tiêu.</p>
                  </div>
                </div>
                <Link
                  href="/dich-vu-hoc-phi"
                  className="text-sm leading-[22px] text-[#33465c] hover:text-[#116f7c] transition-colors"
                >
                  Xem lộ trình &amp; học phí →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. HOW IT WORKS (4 cột phẳng trên nền #eaf0f5) */}
        <section className="bg-[#eaf0f5]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[80px] py-[48px] flex flex-col gap-7">
            <h2 className="font-display font-bold text-[26px] sm:text-[32px] leading-[1.35] lg:leading-[44px] tracking-[-0.64px] text-[#172b4d]">
              Gia đình luôn là người lựa chọn
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROCESS_STEPS.map((step) => (
                <div key={step.num} className="flex flex-col gap-3">
                  <p className="text-2xl font-semibold leading-8 text-[#116f7c]">
                    {step.num}
                  </p>
                  <h3 className="text-base font-semibold leading-6 text-[#33465c]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-[22px] text-[#52677d]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. FEATURED TUTORS */}
        <section id="doi-ngu-gia-su" className="bg-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[80px] py-[48px] flex flex-col gap-7">
            <h2 className="font-display font-bold text-[26px] sm:text-[32px] leading-[1.35] lg:leading-[44px] tracking-[-0.64px] text-[#172b4d]">
              Hiểu môn học. Hiểu cách con học.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {FEATURED_TUTORS.map((tutor) => (
                <div
                  key={tutor.name}
                  className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-5 items-start"
                >
                  <p className="text-xs font-semibold leading-[18px] text-[#166534]">
                    ✓ Bằng cấp đã xác minh
                  </p>

                  <div className="flex items-center gap-3 w-full">
                    <div className="size-[44px] rounded-full bg-[#ddf2f4] flex items-center justify-center shrink-0">
                      <span className="text-[15px] font-bold text-[#116f7c]">
                        {tutor.initials}
                      </span>
                    </div>
                    <h3 className="text-base font-normal leading-6 text-[#172b4d]">
                      {tutor.name}
                    </h3>
                  </div>

                  <div className="text-xs leading-[18px] text-[#52677d]">
                    <p>{tutor.degree}</p>
                    <p>{tutor.school}</p>
                    <p>{tutor.exp}</p>
                  </div>

                  <p className="text-xl font-semibold leading-7 text-[#116f7c]">
                    {tutor.fee}
                  </p>

                  <p className="text-xs leading-[18px] text-[#33465c]">
                    {tutor.schedule}
                  </p>

                  <p className="text-xs leading-[18px] text-[#80520b]">
                    {tutor.rating}
                  </p>

                  <Link href="/ho-so-gia-su">
                    <Button variant="secondary">Xem hồ sơ</Button>
                  </Link>
                </div>
              ))}
            </div>

            <p className="text-xs leading-[18px] text-[#52677d]">
              Điều phối viên đề xuất gia sư thực tế sau khi xác nhận nhu cầu của gia đình.
            </p>
          </div>
        </section>

        {/* 6. LEARNING OUTCOMES (Báo cáo buổi 7 · Dữ liệu minh họa) */}
        <section className="bg-[#ddf2f4]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[80px] py-[48px] flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1 flex flex-col gap-4">
              <p className="text-xs font-semibold leading-[18px] text-[#116f7c]">
                ● NHÌN THẤY SỰ TIẾN BỘ
              </p>
              <h2 className="font-display font-bold text-[26px] sm:text-[32px] leading-[1.35] lg:leading-[44px] tracking-[-0.64px] text-[#33465c]">
                Không chỉ học thêm.
                <br />
                Con học cách tự tin hơn.
              </h2>
              <p className="text-sm leading-[22px] text-[#52677d] max-w-[540px]">
                Thống nhất mục tiêu ngay từ đầu để gia đình luôn biết con đang học gì và cần hỗ trợ ở đâu.
              </p>
            </div>

            {/* Mẫu báo cáo sau buổi học */}
            <div className="flex-1 w-full bg-white border border-[#dce4eb] rounded-[12px] p-5 flex flex-col gap-3 shadow-[0px_12px_28px_-4px_rgba(15,33,59,0.08)]">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-[15px] font-semibold leading-[22px] text-[#172b4d]">
                  Báo cáo buổi 7 · Toán lớp 8
                </h3>
                <span className="inline-flex items-center rounded-full bg-[#ddf2f4] border border-[#77c5cf] px-2.5 py-1 text-xs font-semibold leading-[18px] text-[#116f7c]">
                  Dữ liệu minh họa
                </span>
              </div>

              <p className="text-xs leading-[18px] text-[#3d5266]">
                Học viên: Lê Hoàng Nam · Gia sư: Nguyễn Minh Anh · 24/11/2026 (18:30–20:00)
              </p>

              <div className="bg-[#f5f8fa] rounded-[8px] px-3 py-2.5 flex flex-col gap-1">
                <p className="text-xs font-semibold leading-[18px] text-[#116f7c]">
                  Mục tiêu buổi học
                </p>
                <p className="text-[13px] leading-5 text-[#172b4d]">
                  Phân tích đa thức thành nhân tử bằng phương pháp nhóm hạng tử.
                </p>
              </div>

              <div className="bg-[#f5f8fa] rounded-[8px] px-3 py-2.5 flex flex-col gap-1">
                <p className="text-xs font-semibold leading-[18px] text-[#116f7c]">
                  Nhận xét tiến bộ
                </p>
                <p className="text-[13px] leading-5 text-[#172b4d]">
                  Tự làm đúng 8/10 bài (tăng từ 6/10 ở buổi trước), chủ động trình bày bước biến đổi dấu.
                </p>
              </div>

              <div className="bg-[#f5f8fa] rounded-[8px] px-3 py-2.5 flex flex-col gap-1">
                <p className="text-xs font-semibold leading-[18px] text-[#116f7c]">
                  Bài tập tiếp theo
                </p>
                <p className="text-[13px] leading-5 text-[#172b4d]">
                  Bài 1–6 Phiếu luyện tập số 7 · Hạn nộp trước buổi học ngày 26/11/2026.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. TRANSPARENT FEES */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[80px] py-[48px] flex flex-col gap-7">
            <h2 className="font-display font-bold text-[26px] sm:text-[32px] leading-[1.35] lg:leading-[44px] tracking-[-0.64px] text-[#172b4d]">
              Rõ đơn giá. Đúng số buổi đã học.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px] min-h-[316px]">
                <h3 className="text-base font-semibold leading-6 text-[#172b4d]">
                  Tiểu học
                </h3>
                <p className="text-2xl font-semibold leading-8 text-[#116f7c]">
                  180.000–250.000 ₫
                </p>
                <div className="text-sm leading-[22px] text-[#33465c] flex flex-col gap-5">
                  <div>
                    <p>/ buổi 90 phút · Năng khiếu và kỹ năng: Piano, Vẽ, Cờ vua, Kỹ năng sống</p>
                    <p>Theo TT 29/2024/TT-BGDĐT, học viên tiểu học chỉ học môn năng khiếu và kỹ năng.</p>
                  </div>
                  <div>
                    <p>✓ Báo cáo sau buổi học</p>
                    <p>✓ Bài tập &amp; tài liệu phù hợp</p>
                    <p>✓ Điều phối hỗ trợ lịch học</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px] min-h-[316px]">
                <h3 className="text-base font-semibold leading-6 text-[#172b4d]">
                  THCS
                </h3>
                <p className="text-2xl font-semibold leading-8 text-[#116f7c]">
                  220.000–320.000 ₫
                </p>
                <div className="text-sm leading-[22px] text-[#33465c] flex flex-col gap-5">
                  <p>/ buổi 90 phút · Gia sư 1:1 tại nhà</p>
                  <div>
                    <p>✓ Báo cáo sau buổi học</p>
                    <p>✓ Bài tập &amp; tài liệu phù hợp</p>
                    <p>✓ Điều phối hỗ trợ lịch học</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px] min-h-[316px]">
                <h3 className="text-base font-semibold leading-6 text-[#172b4d]">
                  THPT
                </h3>
                <p className="text-2xl font-semibold leading-8 text-[#116f7c]">
                  280.000–400.000 ₫
                </p>
                <div className="text-sm leading-[22px] text-[#33465c] flex flex-col gap-5">
                  <p>/ buổi 90 phút · Gia sư 1:1 tại nhà</p>
                  <div>
                    <p>✓ Báo cáo sau buổi học</p>
                    <p>✓ Bài tập &amp; tài liệu phù hợp</p>
                    <p>✓ Điều phối hỗ trợ lịch học</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs leading-[18px] text-[#52677d]">
              Khoảng phí tham khảo theo môn, khối lớp và kinh nghiệm gia sư. Đơn giá học thử được báo trước. Chỉ tính buổi đã xác nhận; vắng có phép 0%, vắng không phép 50%.
            </p>
          </div>
        </section>

        {/* 8. FAMILY STORIES (#eaf0f5) */}
        <section className="bg-[#eaf0f5]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[80px] py-[48px] flex flex-col gap-7">
            <h2 className="font-display font-bold text-[26px] sm:text-[32px] leading-[1.35] lg:leading-[44px] tracking-[-0.64px] text-[#172b4d]">
              An tâm vì luôn biết con đang học thế nào
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px] text-[#33465c]">
                <p className="text-sm leading-[22px]">★★★★★</p>
                <p className="text-base leading-6">
                  “Cô giải thích kiên nhẫn. Báo cáo sau mỗi buổi giúp tôi biết Nam cần luyện thêm điều gì.”
                </p>
                <p className="text-sm leading-[22px]">Trần Thu Hà · Phụ huynh</p>
              </div>

              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px] text-[#33465c]">
                <p className="text-sm leading-[22px]">★★★★★</p>
                <p className="text-base leading-6">
                  “Con hào hứng hơn với Toán. Trung tâm hỗ trợ thống nhất lịch rõ ràng ngay từ đầu.”
                </p>
                <p className="text-sm leading-[22px]">Nguyễn Ngọc Mai · Phụ huynh</p>
              </div>
            </div>

            <p className="text-xs leading-[18px] text-[#52677d]">
              Nhận xét minh họa.
            </p>
          </div>
        </section>

        {/* 9. FAQS */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[80px] py-[48px] flex flex-col gap-6">
            <h2 className="font-display font-bold text-[26px] sm:text-[32px] leading-[1.35] lg:leading-[44px] tracking-[-0.64px] text-[#172b4d]">
              Giải đáp trước khi bắt đầu
            </h2>

            <div className="flex flex-col gap-6">
              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
                <h3 className="text-base font-semibold leading-6 text-[#172b4d]">
                  Gia sư được lựa chọn như thế nào?
                </h3>
                <p className="text-sm leading-[22px] text-[#33465c]">
                  Trung tâm xác minh hồ sơ, lọc theo chuyên môn, lịch, khu vực và ngân sách, rồi đề xuất tối đa 3 người để gia đình chọn.
                </p>
              </div>

              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
                <h3 className="text-base font-semibold leading-6 text-[#172b4d]">
                  Nếu buổi học thử chưa phù hợp thì sao?
                </h3>
                <p className="text-sm leading-[22px] text-[#33465c]">
                  Gia đình trao đổi với điều phối viên để điều chỉnh nhu cầu và nhận đề xuất khác. Không tự động mở lớp sau học thử.
                </p>
              </div>

              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
                <h3 className="text-base font-semibold leading-6 text-[#172b4d]">
                  Học phí được tính và thanh toán thế nào?
                </h3>
                <p className="text-sm leading-[22px] text-[#33465c]">
                  Ngày 01 lập nháp cho tháng trước, ngày 03 phát hành, hạn ngày 10. Thanh toán thủ công qua chuyển khoản hoặc tiền mặt có phiếu thu; kế toán đối chiếu và ghi nhận.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 10. INVITATION CTA BANNER (#77c5cf) */}
        <section className="bg-[#77c5cf]">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[80px] py-[52px] flex flex-col items-center gap-5 text-center">
            <h2 className="font-display font-bold text-[26px] sm:text-[32px] leading-[1.35] lg:leading-[44px] tracking-[-0.64px] text-[#172b4d]">
              Bắt đầu từ điều con cần hôm nay.
            </h2>
            <p className="text-sm leading-[22px] text-[#172b4d]">
              Chia sẻ nhu cầu, để PeasyEdu cùng gia đình tìm người đồng hành.
            </p>
            <Link href="/yeu-cau-tim-gia-su">
              <Button variant="secondary">Gửi nhu cầu tìm gia sư →</Button>
            </Link>
            <p className="text-xs leading-[18px] text-[#172b4d]">
              028 3822 0123 · Tư vấn 08:00–20:00
            </p>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
