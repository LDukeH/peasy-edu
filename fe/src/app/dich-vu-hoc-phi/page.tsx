"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";

export default function DichVuHocPhiPage() {
  const [grade, setGrade] = useState("THCS · Lớp 8");
  const [subject, setSubject] = useState("Toán");

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f8fa] text-[#33465c]">
      <PublicNavbar />

      <main className="flex-1 py-10 lg:py-[56px] px-4 sm:px-8">
        <div className="mx-auto max-w-[1120px] flex flex-col gap-8">
          {/* Tiêu đề trang */}
          <h1 className="text-[28px] sm:text-[32px] font-semibold leading-[1.35] sm:leading-[44px] text-[#172b4d]">
            Một lộ trình phù hợp, một mức phí rõ ràng
          </h1>

          {/* 3 thẻ khung học phí theo cấp học */}
          <div id="bang-gia" className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Tiểu học */}
            <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
              <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
                Tiểu học · Lớp 1–5
              </h2>
              <p className="text-2xl font-semibold leading-8 text-[#116f7c]">
                180.000–250.000 ₫
              </p>
              <div className="text-sm leading-[22px] text-[#33465c]">
                <p>/ buổi 90 phút · Năng khiếu và kỹ năng: Piano, Vẽ, Cờ vua, Kỹ năng sống</p>
                <p>
                  Theo TT 29/2024/TT-BGDĐT, học viên tiểu học chỉ học môn năng khiếu và kỹ năng.
                </p>
              </div>
            </div>

            {/* THCS — Highlighted #ddf2f4 */}
            <div className="bg-[#ddf2f4] border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
              <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
                THCS · Lớp 6–9
              </h2>
              <p className="text-2xl font-semibold leading-8 text-[#116f7c]">
                220.000–320.000 ₫
              </p>
              <div className="text-sm leading-[22px] text-[#33465c] space-y-5">
                <p>/ buổi 90 phút · Toán, Văn, Anh, KHTN</p>
                <p>
                  Củng cố kiến thức, bám sát chương trình và luyện phương pháp. Hỗ trợ ôn chuyển cấp theo mục tiêu.
                </p>
              </div>
            </div>

            {/* THPT */}
            <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
              <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
                THPT · Lớp 10–12
              </h2>
              <p className="text-2xl font-semibold leading-8 text-[#116f7c]">
                280.000–400.000 ₫
              </p>
              <div className="text-sm leading-[22px] text-[#33465c] space-y-5">
                <p>/ buổi 90 phút · Toán, Lý, Hóa, Văn, Anh</p>
                <p>
                  Hệ thống kiến thức, luyện bài tập theo năng lực và chuẩn bị cho các kỳ kiểm tra quan trọng.
                </p>
              </div>
            </div>
          </div>

          {/* Mọi lộ trình đều bao gồm */}
          <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
            <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
              Mọi lộ trình đều bao gồm
            </h2>
            <div className="overflow-x-auto rounded-[10px] border border-[#dce4eb]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f1f5f9] border-b border-[#e3e8f0]">
                    <th className="h-9 px-3.5 font-semibold text-[#172b4d] w-1/2">
                      Nội dung
                    </th>
                    <th className="h-9 px-3.5 font-normal text-[#52677d] w-1/2">
                      Gia đình nhận được
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8f0]">
                  <tr>
                    <td className="h-8 px-3.5 font-semibold text-[#172b4d]">
                      Gia sư đã xác minh
                    </td>
                    <td className="h-8 px-3.5 text-[#52677d]">
                      Đối chiếu văn bằng và kinh nghiệm trước khi đề xuất
                    </td>
                  </tr>
                  <tr>
                    <td className="h-8 px-3.5 font-semibold text-[#172b4d]">
                      Kế hoạch học cá nhân
                    </td>
                    <td className="h-8 px-3.5 text-[#52677d]">
                      Thống nhất nền tảng, mục tiêu và cách theo dõi tiến bộ
                    </td>
                  </tr>
                  <tr>
                    <td className="h-8 px-3.5 font-semibold text-[#172b4d]">
                      Báo cáo buổi học
                    </td>
                    <td className="h-8 px-3.5 text-[#52677d]">
                      Nội dung, nhận xét, bài tập và học liệu trong cổng gia đình
                    </td>
                  </tr>
                  <tr>
                    <td className="h-8 px-3.5 font-semibold text-[#172b4d]">
                      Điều phối hỗ trợ
                    </td>
                    <td className="h-8 px-3.5 text-[#52677d]">
                      Theo dõi lịch, xác nhận buổi học và tiếp nhận phản hồi
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 2 cột: Đơn giá phụ thuộc gì & Chọn nhu cầu của gia đình */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
              <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
                Đơn giá phụ thuộc điều gì?
              </h2>
              <div className="text-sm leading-[22px] text-[#33465c] space-y-5">
                <p>
                  Môn và khối lớp, mục tiêu học, kinh nghiệm gia sư, thời lượng và khu vực di chuyển. Trung tâm báo đơn giá cụ thể trước khi gia đình chọn học thử.
                </p>
                <div>
                  <p>Ví dụ Toán 8 · 2 buổi / tuần</p>
                  <p>8 buổi × 250.000 ₫ = 2.000.000 ₫ / tháng</p>
                </div>
                <p>
                  Chỉ tính buổi đã xác nhận: có mặt 100% · vắng có phép 0% · vắng không phép 50%. Không tự động thu tiền.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px] items-start">
              <h2 className="text-base font-semibold leading-6 text-[#172b4d] w-full">
                Chọn nhu cầu của gia đình
              </h2>

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs leading-[18px] text-[#52677d]">
                  Khối lớp
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full rounded-[8px] border border-[#bac7d6] bg-white px-3 py-2.5 text-sm leading-[22px] text-[#172b4d] focus:outline-none focus:border-[#116f7c]"
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

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs leading-[18px] text-[#52677d]">
                  Môn học
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-[8px] border border-[#bac7d6] bg-white px-3 py-2.5 text-sm leading-[22px] text-[#172b4d] focus:outline-none focus:border-[#116f7c]"
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

              <Link href="/yeu-cau-tim-gia-su">
                <Button variant="primary">Nhận đề xuất gia sư phù hợp</Button>
              </Link>
            </div>
          </div>

          {/* Câu hỏi thường gặp */}
          <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
            <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
              Câu hỏi thường gặp
            </h2>
            <div className="text-sm leading-[22px] text-[#33465c] space-y-5">
              <div>
                <p>Học thử có tính phí không?</p>
                <p>
                  Mức phí được báo và thống nhất trước; ví dụ Toán 8 là 250.000 ₫ / 90 phút.
                </p>
              </div>
              <div>
                <p>Có thể đổi lịch không?</p>
                <p>
                  Gia đình đề nghị với trung tâm, gia sư và phụ huynh cùng xác nhận lịch mới.
                </p>
              </div>
              <div>
                <p>Có phí phát sinh không?</p>
                <p>
                  Mọi điều chỉnh phải được báo rõ và gia đình đồng ý trước khi áp dụng.
                </p>
              </div>
            </div>
          </div>

          {/* Banner cuối */}
          <div className="bg-[#ddf2f4] border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px] items-start">
            <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
              Chưa chắc con cần lộ trình nào?
            </h2>
            <p className="text-sm leading-[22px] text-[#33465c]">
              Điều phối viên sẽ trao đổi về mục tiêu, lịch rảnh và ngân sách để đề xuất tối đa 3 gia sư phù hợp.
            </p>
            <Link href="/yeu-cau-tim-gia-su">
              <Button variant="primary">Tư vấn nhu cầu học tập →</Button>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
