"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileUp, ShieldCheck, ArrowRight } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";

export default function UngTuyenGiaSuPage() {
  const [formData, setFormData] = useState({
    fullName: "Vũ Ngọc Hân",
    dob: "15/08/2000",
    email: "han.vu@email.com",
    phone: "090 382 6154",
    idCard: "079******042",
    gender: "Nữ",
    currentAddress: "Phường Bình Thạnh, TP.HCM",
    teachingArea: "Bình Thạnh · Phú Nhuận, TP.HCM",
    currentOccupation: "Sinh viên",
    workplace: "Không áp dụng",
    teachingMode: "Tại nhà · Trực tuyến",
    education: "ĐH Sư phạm TP.HCM · Sư phạm Toán",
    gradYear: "2022",
    experience: "2 năm",
    subjectsGrades: "Toán · Lớp 6–9",
    teachingMethod: "Chia nhỏ kiến thức, đúng ví dụ gần gũi và luyện tập từng bước để học viên hiểu bản chất.",
    availableHours: "Thứ 2, 4, 6 · 18:00–21:00",
    desiredWage: "180.000–220.000 ₫ / 90 phút",
    checkAccurate: true,
    checkVerify: true,
    checkConsent: true,
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
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header (Khớp 100% Ảnh 6) */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#116f7c] uppercase tracking-wider">
              PeasyEdu
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#172b4d] tracking-tight">
              Cùng học viên đi xa hơn mỗi ngày
            </h1>
            <p className="text-sm text-[#52677d]">
              Ứng tuyển gia sư PeasyEdu · Hồ sơ được kiểm tra trước khi nhận lời mời lớp phù hợp.
            </p>
          </div>

          {/* Banner thông báo lưu nháp */}
          <div className="bg-[#ddf2f4] border border-[#116f7c]/30 rounded-lg p-3 text-xs text-[#116f7c] font-medium flex items-center justify-between">
            <span>Bản nháp đã được lưu · Hoàn tất thông tin và kiểm tra tài liệu trước khi gửi.</span>
          </div>

          {/* Form Content Layout (2 cột: Cột form bên trái, cột checklist bên phải) */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* CỘT TRÁI: FORM ỨNG TUYỂN (2/3 chiều rộng) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card 1: Thông tin liên hệ (Khớp 100% Ảnh 6) */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 sm:p-7 space-y-5 shadow-2xs">
                <h2 className="text-base font-bold text-[#172b4d]">
                  Thông tin liên hệ
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Họ và tên *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Ngày sinh *</label>
                    <input
                      type="text"
                      required
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Số CCCD * · Duy nhất</label>
                    <input
                      type="text"
                      required
                      value={formData.idCard}
                      onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Giới tính *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    >
                      <option value="Nữ">Nữ</option>
                      <option value="Nam">Nam</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Địa chỉ hiện tại *</label>
                  <input
                    type="text"
                    required
                    value={formData.currentAddress}
                    onChange={(e) => setFormData({ ...formData, currentAddress: e.target.value })}
                    className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                  />
                </div>

                <p className="text-[11px] text-[#52677d] italic leading-relaxed">
                  Số CCCD được che một phần khi hiển thị. Bắt buộc đủ 12 số và không trùng hồ sơ khác; để trống, sai định dạng hoặc trùng số thì chưa thể gửi.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Khu vực có thể dạy *</label>
                  <input
                    type="text"
                    required
                    value={formData.teachingArea}
                    onChange={(e) => setFormData({ ...formData, teachingArea: e.target.value })}
                    className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                  />
                </div>
              </div>

              {/* Card 2: Học vấn & kinh nghiệm (Khớp 100% Ảnh 6 & 7) */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 sm:p-7 space-y-5 shadow-2xs">
                <h2 className="text-base font-bold text-[#172b4d]">
                  Học vấn & kinh nghiệm
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Nghề nghiệp hiện tại *</label>
                    <input
                      type="text"
                      required
                      value={formData.currentOccupation}
                      onChange={(e) => setFormData({ ...formData, currentOccupation: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Đơn vị công tác (nếu là giáo viên)</label>
                    <input
                      type="text"
                      value={formData.workplace}
                      onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Hình thức nhận dạy *</label>
                  <input
                    type="text"
                    required
                    value={formData.teachingMode}
                    onChange={(e) => setFormData({ ...formData, teachingMode: e.target.value })}
                    className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Trường / chuyên ngành *</label>
                  <input
                    type="text"
                    required
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Năm tốt nghiệp</label>
                    <input
                      type="text"
                      value={formData.gradYear}
                      onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#52677d]">Kinh nghiệm gia sư</label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Môn / khối lớp *</label>
                  <input
                    type="text"
                    required
                    value={formData.subjectsGrades}
                    onChange={(e) => setFormData({ ...formData, subjectsGrades: e.target.value })}
                    className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Phương pháp giảng dạy</label>
                  <textarea
                    rows={2}
                    value={formData.teachingMethod}
                    onChange={(e) => setFormData({ ...formData, teachingMethod: e.target.value })}
                    className="w-full p-3 border border-[#dce4eb] rounded-lg text-xs text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c] leading-relaxed resize-none"
                  />
                </div>
              </div>

              {/* Card 3: Minh chứng & lịch rảnh (Khớp 100% Ảnh 7) */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 sm:p-7 space-y-5 shadow-2xs">
                <h2 className="text-base font-bold text-[#172b4d]">
                  Minh chứng & lịch rảnh
                </h2>

                {/* Upload box 1: Bằng cấp / bảng điểm */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Bằng cấp / bảng điểm *</label>
                  <div className="border border-dashed border-[#116f7c]/40 bg-[#f5f8fa] rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#116f7c] flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Bang_tot_nghiep.pdf
                      </span>
                      <span className="text-[#52677d]">·</span>
                      <span className="font-semibold text-[#116f7c] flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Bang_diem.pdf
                      </span>
                    </div>
                    <span className="text-[11px] text-[#52677d]">PDF, JPG, PNG · Tối đa 10 MB / tệp</span>
                  </div>
                </div>

                {/* Upload box 2: CCCD hai mặt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Ảnh CCCD hai mặt *</label>
                  <div className="border border-dashed border-[#116f7c]/40 bg-[#f5f8fa] rounded-lg p-3.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#116f7c] flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Dinh_danh.pdf
                    </span>
                    <span className="text-[11px] text-[#52677d]">Chỉ nhân sự xác minh được xem</span>
                  </div>
                </div>

                {/* Upload box 3: Ảnh chân dung */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Ảnh chân dung *</label>
                  <div className="border border-dashed border-[#116f7c]/40 bg-[#f5f8fa] rounded-lg p-3.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#116f7c] flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Chan_dung.jpg
                    </span>
                    <span className="text-[11px] text-[#52677d]">Hình chân dung rõ mặt</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Khung giờ có thể nhận lớp</label>
                  <input
                    type="text"
                    value={formData.availableHours}
                    onChange={(e) => setFormData({ ...formData, availableHours: e.target.value })}
                    className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#52677d]">Thù lao mong muốn</label>
                  <input
                    type="text"
                    value={formData.desiredWage}
                    onChange={(e) => setFormData({ ...formData, desiredWage: e.target.value })}
                    className="w-full h-10 px-3 border border-[#dce4eb] rounded-lg text-sm text-[#33465c] bg-white focus:outline-none focus:border-[#116f7c]"
                  />
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: CHECKLIST & QUY TRÌNH (1/3 chiều rộng - Khớp 100% Ảnh 6 & 7) */}
            <div className="space-y-6">
              {/* Card Kiểm tra trước khi gửi */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 space-y-4 shadow-2xs">
                <h3 className="text-sm font-bold text-[#172b4d]">
                  Kiểm tra trước khi gửi
                </h3>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block"></span>
                  <span>4/4 tài liệu đã đính kèm</span>
                </div>

                <div className="space-y-3 pt-2 text-xs text-[#33465c]">
                  <label className="flex items-start gap-2.5 cursor-pointer leading-snug">
                    <input
                      type="checkbox"
                      required
                      checked={formData.checkAccurate}
                      onChange={(e) => setFormData({ ...formData, checkAccurate: e.target.checked })}
                      className="mt-0.5 text-[#116f7c] rounded border-[#dce4eb] focus:ring-[#116f7c]"
                    />
                    <span>Thông tin kê khai chính xác</span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer leading-snug">
                    <input
                      type="checkbox"
                      required
                      checked={formData.checkVerify}
                      onChange={(e) => setFormData({ ...formData, checkVerify: e.target.checked })}
                      className="mt-0.5 text-[#116f7c] rounded border-[#dce4eb] focus:ring-[#116f7c]"
                    />
                    <span>Đồng ý kiểm tra bằng cấp và kinh nghiệm</span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer leading-relaxed">
                    <input
                      type="checkbox"
                      required
                      checked={formData.checkConsent}
                      onChange={(e) => setFormData({ ...formData, checkConsent: e.target.checked })}
                      className="mt-0.5 text-[#116f7c] rounded border-[#dce4eb] focus:ring-[#116f7c]"
                    />
                    <span>
                      Đồng ý để trung tâm xử lý dữ liệu cá nhân của tôi, kể cả giấy tờ định danh, để xét tuyển theo chính sách bảo mật. Thời điểm đồng ý được ghi nhận.
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-[#116f7c] hover:bg-[#0e5c66] text-white font-semibold rounded-lg shadow-xs"
                >
                  Gửi hồ sơ ứng tuyển
                </Button>

                {isSubmitted && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Hồ sơ ứng tuyển đã được ghi nhận! Trung tâm sẽ liên hệ phỏng vấn trong 48 giờ.</span>
                  </div>
                )}

                <p className="text-[11px] text-[#52677d] leading-relaxed pt-1">
                  Sau khi gửi, tạo hoặc đăng nhập tài khoản Gia sư để theo dõi trạng thái.
                </p>
              </div>

              {/* Card Sau khi ứng tuyển */}
              <div className="bg-white border border-[#dce4eb] rounded-xl p-6 space-y-3.5 shadow-2xs">
                <h3 className="text-sm font-bold text-[#172b4d]">
                  Sau khi ứng tuyển
                </h3>
                <div className="text-xs space-y-3 text-[#52677d]">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-[#33465c]">✓ Kiểm tra hồ sơ</p>
                    <p>Đối chiếu thông tin và tài liệu.</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-[#33465c]">✓ Trao đổi chuyên môn</p>
                    <p>Điều phối hẹn phỏng vấn qua điện thoại.</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-[#33465c]">✓ Thông báo kết quả</p>
                    <p>Hồ sơ hợp lệ được kích hoạt nhận lời mời.</p>
                  </div>
                </div>
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
