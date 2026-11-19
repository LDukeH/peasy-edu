"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Info, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";

export default function YeuCauTimGiaSuPage() {
  const [formData, setFormData] = useState({
    parentName: "Trần Thu Hà",
    phone: "090 123 4567",
    email: "ha.tran@email.com",
    studentName: "Lê Hoàng Nam",
    gradeSchool: "Lớp 8 · THCS Đống Đa",
    referral: "Bạn bè giới thiệu",
    subject: "Toán",
    goal: "Củng cố đại số, hạn chế nhầm dấu, đạt từ 8 điểm cuối học kỳ I. Điểm hiện tại: 6,5 / 10.",
    area: "Phường 25, Bình Thạnh, TP.HCM",
    mode: "home", // home | online
    classType: "1on1", // 1on1 | group
    preferredContact: "Zalo · 090 123 4567",
    detailedAddress: "Sẽ bổ sung khi điều phối viên liên hệ\nKhông hiển thị công khai; chỉ chia sẻ với gia sư đã chọn.",
    preferredSchedule: "Thứ 3, 5 · 18:30–20:00",
    sessionDuration: "90 phút · 2 buổi / tuần",
    budgetPerSession: "230.000–300.000 ₫",
    expectedStartDate: "03/11/2026",
    agreePrivacy: true,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f8fa] text-[#33465c]">
      {/* 1. Navbar */}
      <PublicNavbar />

      <main className="flex-1 py-10 px-4 sm:px-8 lg:px-20">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header (Khớp 100% Ảnh 4) */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#116f7c] uppercase tracking-wider">
              PeasyEdu
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#172b4d] tracking-tight">
              Kể chúng tôi nghe điều con cần
            </h1>
            <p className="text-sm text-[#52677d]">
              Điều phối viên sẽ liên hệ xác nhận nhu cầu và đề xuất tối đa 3 gia sư để gia đình lựa chọn.
            </p>
          </div>

          {/* Form Content Layout (2 cột: Cột form bên trái, cột tóm tắt bên phải) */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* CỘT TRÁI: FORM ĐĂNG KÝ (2/3 chiều rộng) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card 1: Gia đình & học viên */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 sm:p-7 space-y-5 shadow-2xs">
                <h2 className="text-base font-bold text-[#172b4d]">
                  Gia đình & học viên
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Tên phụ huynh *</label>
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Email (không bắt buộc)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Tên học viên *</label>
                    <input
                      type="text"
                      required
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Lớp / trường</label>
                    <input
                      type="text"
                      value={formData.gradeSchool}
                      onChange={(e) => setFormData({ ...formData, gradeSchool: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Biết đến trung tâm qua</label>
                  <input
                    type="text"
                    value={formData.referral}
                    onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
                    className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                  />
                </div>
              </div>

              {/* Card 2: Nhu cầu học tập (Khớp 100% Ảnh 4 & 5) */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 sm:p-7 space-y-5 shadow-2xs">
                <h2 className="text-base font-bold text-[#172b4d]">
                  Nhu cầu học tập
                </h2>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Môn cần gia sư *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Mục tiêu *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full p-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c] leading-relaxed resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Khu vực học tại nhà *</label>
                  <input
                    type="text"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                  />
                </div>

                {/* Hình thức */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[#52677d]">Hình thức</label>
                  <div className="flex items-center gap-6 text-sm text-[#33465c]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mode"
                        checked={formData.mode === "home"}
                        onChange={() => setFormData({ ...formData, mode: "home" })}
                        className="text-[#116f7c] focus:ring-[#116f7c]"
                      />
                      <span>Tại nhà gia đình</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mode"
                        checked={formData.mode === "online"}
                        onChange={() => setFormData({ ...formData, mode: "online" })}
                        className="text-[#116f7c] focus:ring-[#116f7c]"
                      />
                      <span>Trực tuyến</span>
                    </label>
                  </div>
                </div>

                {/* Hình thức lớp & Kênh liên hệ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#52677d]">Hình thức lớp *</label>
                    <div className="flex items-center gap-4 text-xs text-[#33465c]">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="classType"
                          checked={formData.classType === "1on1"}
                          onChange={() => setFormData({ ...formData, classType: "1on1" })}
                          className="text-[#116f7c] focus:ring-[#116f7c]"
                        />
                        <span>1 kèm 1</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="classType"
                          checked={formData.classType === "group"}
                          onChange={() => setFormData({ ...formData, classType: "group" })}
                          className="text-[#116f7c] focus:ring-[#116f7c]"
                        />
                        <span>Học nhóm (2–5 học viên)</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Kênh liên hệ ưu tiên *</label>
                    <input
                      type="text"
                      value={formData.preferredContact}
                      onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Địa chỉ chi tiết</label>
                  <textarea
                    rows={2}
                    value={formData.detailedAddress}
                    onChange={(e) => setFormData({ ...formData, detailedAddress: e.target.value })}
                    className="w-full p-3 border border-[#dce4eb] rounded-lg text-xs text-[#52677d] bg-[#fdfdfd] focus:outline-none focus:border-[#116f7c] leading-relaxed resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Lịch mong muốn *</label>
                    <input
                      type="text"
                      value={formData.preferredSchedule}
                      onChange={(e) => setFormData({ ...formData, preferredSchedule: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Thời lượng</label>
                    <input
                      type="text"
                      value={formData.sessionDuration}
                      onChange={(e) => setFormData({ ...formData, sessionDuration: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Ngân sách / buổi *</label>
                    <input
                      type="text"
                      value={formData.budgetPerSession}
                      onChange={(e) => setFormData({ ...formData, budgetPerSession: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Bắt đầu dự kiến</label>
                    <input
                      type="text"
                      value={formData.expectedStartDate}
                      onChange={(e) => setFormData({ ...formData, expectedStartDate: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Đồng ý & tiếp tục (Khớp 100% Ảnh 5) */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 sm:p-7 space-y-5 shadow-2xs">
                <h2 className="text-base font-bold text-[#172b4d]">
                  Đồng ý & tiếp tục
                </h2>

                <label className="flex items-start gap-3 cursor-pointer text-xs text-[#52677d] leading-relaxed">
                  <input
                    type="checkbox"
                    required
                    checked={formData.agreePrivacy}
                    onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                    className="mt-0.5 text-[#116f7c] rounded border-[#dce4eb] focus:ring-[#116f7c]"
                  />
                  <span>
                    Tôi đồng ý để PeasyEdu xử lý dữ liệu cá nhân của tôi và của con (học sinh chưa đủ 18 tuổi) để tư vấn và xếp lớp, theo chính sách bảo mật. Thời điểm đồng ý được ghi nhận.
                  </span>
                </label>

                <Button
                  type="submit"
                  className="w-full sm:w-auto h-11 px-6 bg-[#116f7c] hover:bg-[#0e5c66] text-white font-semibold rounded-lg shadow-xs"
                >
                  <span>Gửi nhu cầu & tiếp tục tạo tài khoản</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>

                {isSubmitted && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Yêu cầu tìm gia sư đã được gửi thành công! Điều phối viên sẽ liên hệ với bạn trong vòng 24 giờ.</span>
                  </div>
                )}

                <p className="text-xs text-[#52677d] pt-1">
                  Đã có tài khoản?{" "}
                  <Link href="/login" className="text-[#116f7c] font-semibold hover:underline">
                    Đăng nhập để lưu yêu cầu vào gia đình.
                  </Link>
                </p>
              </div>
            </div>

            {/* CỘT PHẢI: TÓM TẮT & THEO DÕI (1/3 chiều rộng - Khớp 100% Ảnh 4 & 5) */}
            <div className="space-y-6">
              {/* Card Tóm tắt yêu cầu của gia đình */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-[#172b4d]">
                  Yêu cầu của gia đình
                </h3>

                <div className="text-xs space-y-3 divide-y divide-[#dce4eb]/60 text-[#33465c]">
                  <div className="space-y-0.5">
                    <p className="text-[#52677d]">Học viên</p>
                    <p className="font-semibold">{formData.studentName} · {formData.subject} 8</p>
                  </div>
                  <div className="pt-2.5 space-y-0.5">
                    <p className="text-[#52677d]">Địa điểm</p>
                    <p className="font-semibold">Tại nhà · Bình Thạnh</p>
                  </div>
                  <div className="pt-2.5 space-y-0.5">
                    <p className="text-[#52677d]">Ngân sách</p>
                    <p className="font-semibold text-[#116f7c]">{formData.budgetPerSession} / 90 phút</p>
                  </div>
                  <div className="pt-2.5 space-y-0.5">
                    <p className="text-[#52677d]">Mã yêu cầu</p>
                    <p className="text-[#52677d] italic">Được cấp sau khi gửi</p>
                  </div>
                </div>

                <div className="p-3 bg-[#ddf2f4] rounded-lg text-xs text-[#116f7c] leading-relaxed flex items-start gap-2">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    Chưa thu học phí khi gửi. Đơn giá và lịch học được thống nhất trước buổi học thử.
                  </p>
                </div>
              </div>

              {/* Card Theo dõi trong cổng gia đình */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 space-y-3 shadow-2xs">
                <h3 className="text-sm font-bold text-[#172b4d]">
                  Theo dõi trong cổng gia đình
                </h3>
                <p className="text-xs text-[#52677d] leading-relaxed">
                  Sau khi gửi, xác minh email để theo dõi đề xuất, chọn gia sư và xác nhận lịch học. Nội dung vừa nhập được giữ lại khi tạo tài khoản.
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
