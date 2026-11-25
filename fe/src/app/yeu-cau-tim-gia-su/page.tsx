"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";

const INPUT_CLS =
  "w-full rounded-[8px] border border-[#bac7d6] bg-white px-3 py-2.5 text-sm leading-[22px] text-[#172b4d] focus:outline-none focus:border-[#116f7c]";
const LABEL_CLS = "text-xs leading-[18px] text-[#52677d]";

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
    mode: "home",
    classType: "1on1",
    preferredContact: "Zalo · 090 123 4567",
    detailedAddress:
      "Sẽ bổ sung khi điều phối viên liên hệ\nKhông hiển thị công khai; chỉ chia sẻ với gia sư đã chọn.",
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
      <PublicNavbar />

      <main className="flex-1 py-10 lg:py-[56px] px-4 sm:px-8">
        <div className="mx-auto max-w-[1120px] flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <h1 className="text-[28px] sm:text-[32px] font-semibold leading-[1.35] sm:leading-[44px] text-[#172b4d]">
              Kể chúng tôi nghe điều con cần
            </h1>
            <p className="text-sm leading-[22px] text-[#52677d]">
              Điều phối viên sẽ liên hệ xác nhận nhu cầu và đề xuất tối đa 3 gia sư để gia đình lựa chọn.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-[1fr_330px] gap-5 items-start"
          >
            {/* Cột trái */}
            <div className="flex flex-col gap-5">
              {/* Card 1: Gia đình & học viên */}
              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
                <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
                  Gia đình &amp; học viên
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Tên phụ huynh *</label>
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={(e) =>
                        setFormData({ ...formData, parentName: e.target.value })
                      }
                      className={INPUT_CLS}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={INPUT_CLS}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL_CLS}>Email (không bắt buộc)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={INPUT_CLS}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Tên học viên *</label>
                    <input
                      type="text"
                      required
                      value={formData.studentName}
                      onChange={(e) =>
                        setFormData({ ...formData, studentName: e.target.value })
                      }
                      className={INPUT_CLS}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Lớp / trường</label>
                    <input
                      type="text"
                      value={formData.gradeSchool}
                      onChange={(e) =>
                        setFormData({ ...formData, gradeSchool: e.target.value })
                      }
                      className={INPUT_CLS}
                    />
                  </div>
                </div>

                <div className="rounded-[7px] border border-[#dce4eb] bg-white p-3 min-h-[74px] flex flex-col gap-1">
                  <label className="text-xs leading-[18px] text-[#33465c]">
                    Biết đến trung tâm qua
                  </label>
                  <input
                    type="text"
                    value={formData.referral}
                    onChange={(e) =>
                      setFormData({ ...formData, referral: e.target.value })
                    }
                    className="w-full text-xs leading-[18px] text-[#33465c] bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Card 2: Nhu cầu học tập */}
              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
                <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
                  Nhu cầu học tập
                </h2>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL_CLS}>Môn cần gia sư *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className={INPUT_CLS}
                  />
                </div>

                <div className="rounded-[7px] border border-[#dce4eb] bg-white p-3 min-h-[112px] flex flex-col gap-1">
                  <label className="text-xs leading-[18px] text-[#33465c]">
                    Mục tiêu *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.goal}
                    onChange={(e) =>
                      setFormData({ ...formData, goal: e.target.value })
                    }
                    className="w-full text-xs leading-[18px] text-[#33465c] bg-transparent focus:outline-none resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL_CLS}>Khu vực học tại nhà *</label>
                  <input
                    type="text"
                    required
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    className={INPUT_CLS}
                  />
                </div>

                {/* Hình thức */}
                <div className="rounded-[7px] border border-[#dce4eb] bg-white p-3 min-h-[74px] flex flex-col gap-2">
                  <span className="text-xs leading-[18px] text-[#33465c]">
                    Hình thức
                  </span>
                  <div className="flex flex-wrap items-center gap-4 text-xs leading-[18px] text-[#33465c]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mode"
                        checked={formData.mode === "home"}
                        onChange={() => setFormData({ ...formData, mode: "home" })}
                        className="size-4 accent-[#116f7c]"
                      />
                      <span>Tại nhà gia đình</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mode"
                        checked={formData.mode === "online"}
                        onChange={() => setFormData({ ...formData, mode: "online" })}
                        className="size-4 accent-[#116f7c]"
                      />
                      <span>Trực tuyến</span>
                    </label>
                  </div>
                </div>

                {/* Hình thức lớp & Kênh liên hệ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                  <div className="rounded-[7px] border border-[#dce4eb] bg-white p-3 min-h-[74px] flex flex-col gap-2">
                    <span className="text-xs leading-[18px] text-[#33465c]">
                      Hình thức lớp *
                    </span>
                    <div className="flex flex-wrap items-center gap-4 text-xs leading-[18px] text-[#33465c]">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="classType"
                          checked={formData.classType === "1on1"}
                          onChange={() =>
                            setFormData({ ...formData, classType: "1on1" })
                          }
                          className="size-4 accent-[#116f7c]"
                        />
                        <span>1 kèm 1</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="classType"
                          checked={formData.classType === "group"}
                          onChange={() =>
                            setFormData({ ...formData, classType: "group" })
                          }
                          className="size-4 accent-[#116f7c]"
                        />
                        <span>Học nhóm (2–5 học viên)</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Kênh liên hệ ưu tiên *</label>
                    <input
                      type="text"
                      value={formData.preferredContact}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferredContact: e.target.value,
                        })
                      }
                      className={INPUT_CLS}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL_CLS}>Địa chỉ chi tiết</label>
                  <textarea
                    rows={2}
                    value={formData.detailedAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        detailedAddress: e.target.value,
                      })
                    }
                    className={`${INPUT_CLS} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Lịch mong muốn *</label>
                    <input
                      type="text"
                      value={formData.preferredSchedule}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferredSchedule: e.target.value,
                        })
                      }
                      className={INPUT_CLS}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Thời lượng</label>
                    <input
                      type="text"
                      value={formData.sessionDuration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sessionDuration: e.target.value,
                        })
                      }
                      className={INPUT_CLS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Ngân sách / buổi *</label>
                    <input
                      type="text"
                      value={formData.budgetPerSession}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          budgetPerSession: e.target.value,
                        })
                      }
                      className={INPUT_CLS}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Bắt đầu dự kiến</label>
                    <input
                      type="text"
                      value={formData.expectedStartDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expectedStartDate: e.target.value,
                        })
                      }
                      className={INPUT_CLS}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Đồng ý & tiếp tục */}
              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px] items-start">
                <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
                  Đồng ý &amp; tiếp tục
                </h2>

                <label className="flex items-start gap-2 cursor-pointer text-sm leading-[22px] text-[#33465c]">
                  <input
                    type="checkbox"
                    required
                    checked={formData.agreePrivacy}
                    onChange={(e) =>
                      setFormData({ ...formData, agreePrivacy: e.target.checked })
                    }
                    className="mt-1 size-4 shrink-0 accent-[#116f7c]"
                  />
                  <span>
                    Tôi đồng ý để PeasyEdu xử lý dữ liệu cá nhân của tôi và của con (học sinh chưa đủ 18 tuổi) để tư vấn và xếp lớp, theo chính sách bảo mật. Thời điểm đồng ý được ghi nhận.
                  </span>
                </label>

                <Button type="submit" variant="primary">
                  Gửi nhu cầu &amp; tiếp tục tạo tài khoản →
                </Button>

                {isSubmitted && (
                  <div className="w-full p-4 bg-[#ecfdf3] text-[#166534] rounded-[8px] text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>
                      Yêu cầu tìm gia sư đã được gửi thành công! Điều phối viên sẽ liên hệ với bạn trong vòng 24 giờ.
                    </span>
                  </div>
                )}

                <p className="text-sm leading-[22px] text-[#33465c]">
                  Đã có tài khoản?{" "}
                  <Link href="/login" className="text-[#116f7c] hover:underline">
                    Đăng nhập để lưu yêu cầu vào gia đình.
                  </Link>
                </p>
              </div>
            </div>

            {/* Cột phải: Tóm tắt */}
            <div className="flex flex-col gap-5">
              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
                <h3 className="text-base font-semibold leading-6 text-[#172b4d]">
                  Yêu cầu của gia đình
                </h3>

                <div className="text-sm leading-[22px] text-[#33465c] space-y-5">
                  <div>
                    <p>Học viên</p>
                    <p>{formData.studentName} · {formData.subject} 8</p>
                  </div>
                  <div>
                    <p>Địa điểm</p>
                    <p>
                      {formData.mode === "home" ? "Tại nhà" : "Trực tuyến"} · Bình Thạnh
                    </p>
                  </div>
                  <div>
                    <p>Ngân sách</p>
                    <p>{formData.budgetPerSession} / 90 phút</p>
                  </div>
                  <div>
                    <p>Mã yêu cầu</p>
                    <p>Được cấp sau khi gửi</p>
                  </div>
                </div>

                <div className="bg-[#eaf7fa] rounded-[8px] p-4 text-xs leading-[18px] text-[#155e75]">
                  <p>ⓘ Chưa thu học phí khi gửi</p>
                  <p>Đơn giá và lịch học được thống nhất trước buổi học thử.</p>
                </div>
              </div>

              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
                <h3 className="text-base font-semibold leading-6 text-[#172b4d]">
                  Theo dõi trong cổng gia đình
                </h3>
                <p className="text-sm leading-[22px] text-[#33465c]">
                  Sau khi gửi, xác minh email để theo dõi đề xuất, chọn gia sư và xác nhận lịch học. Nội dung vừa nhập được giữ lại khi tạo tài khoản.
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
