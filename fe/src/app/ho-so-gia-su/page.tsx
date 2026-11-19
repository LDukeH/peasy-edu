import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Hồ sơ gia sư · Nguyễn Minh Anh | PeasyEdu",
  description:
    "Hồ sơ gia sư tiêu biểu Nguyễn Minh Anh - Cử nhân Sư phạm Toán, ĐH Sư phạm TP.HCM. 4 năm kinh nghiệm dạy kèm Toán THCS tại TP.HCM.",
};

export default function TutorProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f8fa]/50 text-[#10213a]">
      {/* 1. Header Navigation */}
      <PublicNavbar />

      {/* 2. Main Content Container */}
      <main className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Header Title Section */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#116f7c] tracking-wide">
              PeasyEdu · Hồ sơ gia sư tiêu biểu
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#10213a]">
              Nguyễn Minh Anh
            </h1>
            <p className="text-base text-[#52677d]">
              Cử nhân Sư phạm Toán · ĐH Sư phạm TP.HCM · 4 năm kinh nghiệm
            </p>
          </div>

          {/* 3 Highlight Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Môn và khối lớp */}
            <div className="rounded-2xl border border-[#dce4eb] bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-sm font-semibold text-[#10213a]">
                  Môn và khối lớp
                </span>
                <h3 className="text-2xl font-bold text-[#116f7c] mt-2 mb-3">
                  Toán THCS
                </h3>
              </div>
              <p className="text-sm text-[#52677d] leading-relaxed">
                Lớp 6–9 · Củng cố nền tảng đại số, rèn cách trình bày bài giải.
              </p>
            </div>

            {/* Card 2: Đánh giá từ gia đình (Tinted background matching Figma) */}
            <div className="rounded-2xl border border-[#bce8ee] bg-[#ddf2f4]/60 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-sm font-semibold text-[#10213a]">
                  Đánh giá từ gia đình
                </span>
                <h3 className="text-2xl font-bold text-[#116f7c] mt-2 mb-3">
                  4,9 / 5
                </h3>
              </div>
              <p className="text-sm text-[#52677d] leading-relaxed">
                32 đánh giá hợp lệ. Thông tin liên hệ không hiển thị công khai.
              </p>
            </div>

            {/* Card 3: Học phí tham khảo */}
            <div className="rounded-2xl border border-[#dce4eb] bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-sm font-semibold text-[#10213a]">
                  Học phí tham khảo
                </span>
                <h3 className="text-2xl font-bold text-[#116f7c] mt-2 mb-3">
                  250.000 <span className="underline decoration-1 underline-offset-4">đ</span>
                </h3>
              </div>
              <p className="text-sm text-[#52677d] leading-relaxed">
                / buổi 90 phút · Học tại nhà hoặc trực tuyến. Mức phí được thống nhất trước buổi học.
              </p>
            </div>
          </div>

          {/* Section: Thông tin đã được xác minh */}
          <div className="rounded-2xl border border-[#dce4eb] bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-base sm:text-lg font-bold text-[#10213a] mb-5">
              Thông tin đã được xác minh
            </h2>

            <div className="overflow-hidden rounded-xl border border-[#e5e7eb]">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e5e7eb] text-xs font-semibold text-[#52677d]">
                    <th className="py-3 px-5 font-bold text-[#10213a] w-1/3">
                      Nội dung
                    </th>
                    <th className="py-3 px-5 font-bold text-[#52677d] w-2/3">
                      Đã đối chiếu
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] text-sm">
                  <tr>
                    <td className="py-3.5 px-5 font-semibold text-[#10213a]">
                      Văn bằng
                    </td>
                    <td className="py-3.5 px-5 text-[#52677d]">
                      Cử nhân Sư phạm Toán, ĐH Sư phạm TP.HCM
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-semibold text-[#10213a]">
                      Kinh nghiệm
                    </td>
                    <td className="py-3.5 px-5 text-[#52677d]">
                      4 năm dạy Toán THCS
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-semibold text-[#10213a]">
                      Phương pháp
                    </td>
                    <td className="py-3.5 px-5 text-[#52677d]">
                      Củng cố nền tảng, rèn cách trình bày
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-semibold text-[#10213a]">
                      Khu vực dạy
                    </td>
                    <td className="py-3.5 px-5 text-[#52677d]">
                      Bình Thạnh, Phú Nhuận, Gò Vấp và trực tuyến
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Muốn học với cô Minh Anh? Callout Card */}
          <div className="rounded-2xl border border-[#bce8ee] bg-[#ddf2f4]/80 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[#10213a]">
              Muốn học với cô Minh Anh?
            </h2>
            <p className="text-sm text-[#33465c] leading-relaxed max-w-3xl">
              Gửi yêu cầu; điều phối viên sẽ đề xuất tối đa 3 gia sư phù hợp, có thể gồm cô. Gia đình là người quyết định cuối cùng.
            </p>
            <div className="pt-2">
              <Link href="/yeu-cau-tim-gia-su">
                <Button className="h-11 px-6 font-semibold text-white bg-[#116f7c] hover:bg-[#0e5c66] rounded-lg shadow-xs inline-flex items-center gap-2">
                  <span>Gửi yêu cầu tìm gia sư</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* 3. Footer */}
      <PublicFooter />
    </div>
  );
}
