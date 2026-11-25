import React from "react";
import Link from "next/link";
import { Metadata } from "next";
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
    <div className="min-h-screen flex flex-col bg-[#f5f8fa] text-[#33465c]">
      <PublicNavbar />

      <main className="flex-1 py-10 lg:py-[56px] px-4 sm:px-8">
        <div className="mx-auto max-w-[1120px] flex flex-col gap-8">
          {/* Header Title */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold leading-[18px] text-[#116f7c]">
              Hồ sơ gia sư tiêu biểu
            </p>
            <h1 className="text-[28px] sm:text-[32px] font-semibold leading-[1.35] sm:leading-[44px] text-[#172b4d]">
              Nguyễn Minh Anh
            </h1>
            <p className="text-sm leading-[22px] text-[#52677d]">
              Cử nhân Sư phạm Toán · ĐH Sư phạm TP.HCM · 4 năm kinh nghiệm
            </p>
          </div>

          {/* 3 Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-[12px] border border-[#dce4eb] bg-white p-6 flex flex-col gap-[18px]">
              <p className="text-base font-semibold leading-6 text-[#172b4d]">
                Môn và khối lớp
              </p>
              <p className="text-2xl font-semibold leading-8 text-[#116f7c]">
                Toán THCS
              </p>
              <p className="text-sm leading-[22px] text-[#33465c]">
                Lớp 6–9 · Củng cố nền tảng đại số, rèn cách trình bày bài giải.
              </p>
            </div>

            <div className="rounded-[12px] border border-[#dce4eb] bg-[#ddf2f4] p-6 flex flex-col gap-[18px]">
              <p className="text-base font-semibold leading-6 text-[#172b4d]">
                Đánh giá từ gia đình
              </p>
              <p className="text-2xl font-semibold leading-8 text-[#116f7c]">
                4,9 / 5
              </p>
              <p className="text-sm leading-[22px] text-[#33465c]">
                32 đánh giá hợp lệ. Thông tin liên hệ không hiển thị công khai.
              </p>
            </div>

            <div className="rounded-[12px] border border-[#dce4eb] bg-white p-6 flex flex-col gap-[18px]">
              <p className="text-base font-semibold leading-6 text-[#172b4d]">
                Học phí tham khảo
              </p>
              <p className="text-2xl font-semibold leading-8 text-[#116f7c]">
                250.000 ₫
              </p>
              <div className="text-sm leading-[22px] text-[#33465c]">
                <p>/ buổi 90 phút · Tại nhà hoặc trực tuyến</p>
                <p>Thống nhất mức phí trước khi học thử.</p>
              </div>
            </div>
          </div>

          {/* Thông tin đã xác minh */}
          <div className="rounded-[12px] border border-[#dce4eb] bg-white p-6 flex flex-col gap-[18px]">
            <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
              Thông tin đã xác minh
            </h2>

            <div className="overflow-x-auto rounded-[10px] border border-[#dce4eb]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f1f5f9] border-b border-[#e3e8f0]">
                    <th className="h-9 px-3.5 font-semibold text-[#172b4d] w-1/2">
                      Nội dung
                    </th>
                    <th className="h-9 px-3.5 font-normal text-[#52677d] w-1/2">
                      Đã đối chiếu
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8f0]">
                  <tr>
                    <td className="h-8 px-3.5 font-semibold text-[#172b4d]">
                      Văn bằng
                    </td>
                    <td className="h-8 px-3.5 text-[#52677d]">
                      Cử nhân Sư phạm Toán, ĐH Sư phạm TP.HCM
                    </td>
                  </tr>
                  <tr>
                    <td className="h-8 px-3.5 font-semibold text-[#172b4d]">
                      Kinh nghiệm
                    </td>
                    <td className="h-8 px-3.5 text-[#52677d]">
                      4 năm dạy Toán THCS
                    </td>
                  </tr>
                  <tr>
                    <td className="h-8 px-3.5 font-semibold text-[#172b4d]">
                      Phương pháp
                    </td>
                    <td className="h-8 px-3.5 text-[#52677d]">
                      Củng cố nền tảng, rèn cách trình bày
                    </td>
                  </tr>
                  <tr>
                    <td className="h-8 px-3.5 font-semibold text-[#172b4d]">
                      Khu vực dạy
                    </td>
                    <td className="h-8 px-3.5 text-[#52677d]">
                      Bình Thạnh, Phú Nhuận, Gò Vấp và trực tuyến
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Callout cuối */}
          <div className="rounded-[12px] border border-[#dce4eb] bg-[#ddf2f4] p-6 flex flex-col gap-[18px] items-start">
            <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
              Muốn học với cô Minh Anh?
            </h2>
            <p className="text-sm leading-[22px] text-[#33465c]">
              Gửi yêu cầu; điều phối viên đề xuất tối đa 3 gia sư phù hợp, có thể gồm cô. Gia đình là người quyết định cuối cùng.
            </p>
            <Link href="/yeu-cau-tim-gia-su">
              <Button variant="primary">Gửi yêu cầu tìm gia sư →</Button>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
