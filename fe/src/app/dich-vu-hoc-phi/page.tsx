"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";

export default function DichVuHocPhiPage() {
  const [grade, setGrade] = useState("THCS · Lớp 8");
  const [subject, setSubject] = useState("Toán");

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#33465c]">
      {/* 1. Header / Navbar */}
      <PublicNavbar />

      <main className="flex-1 py-12 px-4 sm:px-8 lg:px-20">
        <div className="mx-auto max-w-7xl space-y-12">
          {/* 2. Tiêu đề trang (Khớp 100% Ảnh 3) */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#116f7c] uppercase tracking-wider">
              PeasyEdu
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#172b4d] tracking-tight">
              Một lộ trình phù hợp, một mức phí rõ ràng
            </h1>
            <p className="text-sm text-[#52677d]">
              Gia sư 1:1 tại nhà (TP.HCM) hoặc trực tuyến · Theo chương trình phổ thông và nhu cầu riêng của con.
            </p>
          </div>

          {/* 3. 3 thẻ khung học phí theo cấp học (Khớp 100% Ảnh 3) */}
          <div id="bang-gia" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tiểu học */}
            <div className="bg-white border border-[#dce4eb] rounded-xl p-6 flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-[#172b4d]">Tiểu học · Lớp 1–5</h2>
                <p className="text-2xl font-bold text-[#116f7c]">180.000–250.000 ₫</p>
                <div className="text-xs text-[#52677d] space-y-2 leading-relaxed">
                  <p>/ buổi 90 phút · Năng khiếu và kỹ năng: Piano, Vẽ, Cờ vua, Kỹ năng sống</p>
                  <p className="italic">
                    Theo TT 29/2024/TT-BGDĐT, học viên tiểu học chỉ học môn năng khiếu và kỹ năng.
                  </p>
                </div>
              </div>
            </div>

            {/* THCS */}
            <div className="bg-white border border-[#dce4eb] rounded-xl p-6 flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-[#172b4d]">THCS · Lớp 6–9</h2>
                <p className="text-2xl font-bold text-[#116f7c]">220.000–320.000 ₫</p>
                <div className="text-xs text-[#52677d] space-y-2 leading-relaxed">
                  <p>/ buổi 90 phút · Toán, Văn, Anh, KHTN</p>
                  <p>
                    Củng cố kiến thức, bám sát chương trình và luyện phương pháp. Hỗ trợ ôn chuyển cấp theo mục tiêu.
                  </p>
                </div>
              </div>
            </div>

            {/* THPT */}
            <div className="bg-white border border-[#dce4eb] rounded-xl p-6 flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-[#172b4d]">THPT · Lớp 10–12</h2>
                <p className="text-2xl font-bold text-[#116f7c]">280.000–400.000 ₫</p>
                <div className="text-xs text-[#52677d] space-y-2 leading-relaxed">
                  <p>/ buổi 90 phút · Toán, Lý, Hóa, Văn, Anh</p>
                  <p>
                    Hệ thống kiến thức, luyện bài tập theo năng lực và chuẩn bị cho các kỳ kiểm tra quan trọng.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Khối "Mọi lộ trình đều bao gồm" (Bảng cam kết - Khớp 100% Ảnh 3) */}
          <div className="bg-white border border-[#dce4eb] rounded-xl p-6 space-y-4 shadow-2xs">
            <h2 className="text-base font-semibold text-[#172b4d]">
              Mọi lộ trình đều bao gồm
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#f5f8fa] text-[#52677d] border-b border-[#dce4eb]">
                    <th className="py-3 px-4 font-semibold w-1/3">Nội dung</th>
                    <th className="py-3 px-4 font-semibold">Gia đình nhận được</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dce4eb] text-[#33465c]">
                  <tr>
                    <td className="py-3 px-4 font-semibold">Gia sư đã xác minh</td>
                    <td className="py-3 px-4 text-[#52677d]">
                      Văn bằng và kinh nghiệm được đối chiếu trước khi đề xuất
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Kế hoạch học cá nhân</td>
                    <td className="py-3 px-4 text-[#52677d]">
                      Thống nhất nền tảng, mục tiêu và cách theo dõi tiến bộ
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Báo cáo buổi học</td>
                    <td className="py-3 px-4 text-[#52677d]">
                      Nội dung, nhận xét, bài tập và học liệu trong cổng gia đình
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Điều phối hỗ trợ</td>
                    <td className="py-3 px-4 text-[#52677d]">
                      Theo dõi lịch, xác nhận buổi học và tiếp nhận phản hồi
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Khối 2 cột: Đơn giá phụ thuộc gì & Form chọn nhu cầu (Khớp 100% Ảnh 3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Cột trái: Đơn giá phụ thuộc điều gì? */}
            <div className="bg-white border border-[#dce4eb] rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-[#172b4d]">
                Đơn giá phụ thuộc điều gì?
              </h2>
              <p className="text-xs text-[#52677d] leading-relaxed">
                Môn và khối lớp, mục tiêu học, kinh nghiệm gia sư, thời lượng và khu vực di chuyển. Trung tâm báo đơn giá cụ thể trước khi gia đình chọn học thử.
              </p>

              <div className="bg-[#f5f8fa] border border-[#dce4eb] rounded-lg p-3.5 space-y-1 text-xs">
                <p className="font-semibold text-[#33465c]">Ví dụ: Toán 8 · 2 buổi / tuần</p>
                <p className="text-[#116f7c] font-bold">8 buổi × 250.000 ₫ = 2.000.000 ₫ / tháng</p>
              </div>

              <p className="text-xs text-[#52677d] leading-relaxed">
                Chỉ tính buổi đã xác nhận: có mặt 100% · vắng có phép 0% · vắng không phép 50%. Không tự động thu tiền.
              </p>
            </div>

            {/* Cột phải: Chọn nhu cầu của gia đình */}
            <div className="bg-white border border-[#dce4eb] rounded-xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-[#172b4d]">
                Chọn nhu cầu của gia đình
              </h2>

              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#52677d]">Khối lớp</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-xs text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                  >
                    <option value="Tiểu học · Lớp 1–5">Tiểu học · Lớp 1–5</option>
                    <option value="THCS · Lớp 6">THCS · Lớp 6</option>
                    <option value="THCS · Lớp 7">THCS · Lớp 7</option>
                    <option value="THCS · Lớp 8">THCS · Lớp 8</option>
                    <option value="THCS · Lớp 9">THCS · Lớp 9</option>
                    <option value="THPT · Lớp 10">THPT · Lớp 10</option>
                    <option value="THPT · Lớp 11">THPT · Lớp 11</option>
                    <option value="THPT · Lớp 12">THPT · Lớp 12</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#52677d]">Môn học</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-xs text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                  >
                    <option value="Toán">Toán</option>
                    <option value="Ngữ văn">Ngữ văn</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                    <option value="Vật lý">Vật lý</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Khoa học tự nhiên">Khoa học tự nhiên</option>
                    <option value="Năng khiếu (Piano/Vẽ)">Năng khiếu (Piano/Vẽ)</option>
                  </select>
                </div>

                <Link href="/login" className="block pt-1">
                  <Button className="w-full h-10 bg-[#116f7c] hover:bg-[#0e5c66] text-white font-semibold rounded-lg text-xs">
                    Nhận đề xuất gia sư phù hợp
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* 6. Khối "Câu hỏi thường gặp" (Khớp 100% Ảnh 3) */}
          <div className="bg-white border border-[#dce4eb] rounded-xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-[#172b4d]">
              Câu hỏi thường gặp
            </h2>

            <div className="space-y-3 divide-y divide-[#dce4eb]">
              <div className="pt-2 first:pt-0 space-y-1">
                <p className="text-xs font-semibold text-[#33465c]">
                  Học thử có tính phí không?
                </p>
                <p className="text-xs text-[#52677d]">
                  Mức phí được báo và thống nhất trước; ví dụ Toán 8 là 250.000 ₫ / 90 phút.
                </p>
              </div>

              <div className="pt-3 space-y-1">
                <p className="text-xs font-semibold text-[#33465c]">
                  Có thể đổi lịch không?
                </p>
                <p className="text-xs text-[#52677d]">
                  Gia đình đề nghị với trung tâm, gia sư và phụ huynh cùng xác nhận lịch mới.
                </p>
              </div>

              <div className="pt-3 space-y-1">
                <p className="text-xs font-semibold text-[#33465c]">
                  Có phí phát sinh không?
                </p>
                <p className="text-xs text-[#52677d]">
                  Mọi điều chỉnh phải được báo rõ và gia đình đồng ý trước khi áp dụng.
                </p>
              </div>
            </div>
          </div>

          {/* 7. Banner "Chưa chắc con cần lộ trình nào?" (Khớp 100% Ảnh 3) */}
          <div className="bg-[#ddf2f4] border border-[#dce4eb] rounded-xl p-8 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#172b4d]">
                Chưa chắc con cần lộ trình nào?
              </h2>
              <p className="text-sm text-[#52677d]">
                Điều phối viên sẽ trao đổi về mục tiêu, lịch rảnh và ngân sách để đề xuất tối đa 3 gia sư phù hợp.
              </p>
            </div>

            <Link href="/login" className="inline-block pt-1">
              <Button className="h-10 px-5 bg-[#116f7c] hover:bg-[#0e5c66] text-white font-semibold rounded-lg text-xs shadow-xs">
                <span>Tư vấn nhu cầu học tập</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* 8. Footer */}
      <PublicFooter />
    </div>
  );
}
