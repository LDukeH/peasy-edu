"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";

const INPUT_CLS =
  "w-full rounded-[8px] border border-[#bac7d6] bg-white px-3 py-2.5 text-sm leading-[22px] text-[#172b4d] focus:outline-none focus:border-[#116f7c]";
const LABEL_CLS = "text-xs leading-[18px] text-[#52677d]";

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
    teachingMethod:
      "Chia nhỏ kiến thức, dùng ví dụ gần gũi và luyện tập từng bước để học viên hiểu bản chất.",
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
      <PublicNavbar />

      <main className="flex-1 py-10 lg:py-[56px] px-4 sm:px-8">
        <div className="mx-auto max-w-[1120px] flex flex-col gap-8">
          <h1 className="text-[28px] sm:text-[32px] font-semibold leading-[1.35] sm:leading-[44px] text-[#172b4d]">
            Cùng học viên đi xa hơn mỗi ngày
          </h1>

          {/* Banner lưu nháp */}
          <div className="bg-[#ddf2f4] rounded-[8px] p-4 text-xs leading-[18px] text-[#116f7c]">
            Đã lưu bản nháp.
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-[1fr_335px] gap-5 items-start"
          >
            {/* Cột trái */}
            <div className="flex flex-col gap-5">
              {/* Card 1: Thông tin liên hệ */}
              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
                <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
                  Thông tin liên hệ
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Họ và tên *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className={INPUT_CLS}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Ngày sinh *</label>
                    <input
                      type="text"
                      required
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                      className={INPUT_CLS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Số CCCD * · Duy nhất</label>
                    <input
                      type="text"
                      required
                      value={formData.idCard}
                      onChange={(e) =>
                        setFormData({ ...formData, idCard: e.target.value })
                      }
                      className={INPUT_CLS}
                    />
                  </div>
                  <div className="rounded-[7px] border border-[#dce4eb] bg-white p-3 min-h-[74px] flex flex-col gap-1">
                    <label className="text-xs leading-[18px] text-[#33465c]">
                      Giới tính *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full text-xs leading-[18px] text-[#33465c] bg-transparent focus:outline-none"
                    >
                      <option value="Nữ">Nữ</option>
                      <option value="Nam">Nam</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-[7px] border border-[#dce4eb] bg-white p-3 min-h-[74px] flex flex-col gap-1">
                  <label className="text-xs leading-[18px] text-[#33465c]">
                    Địa chỉ hiện tại *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.currentAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentAddress: e.target.value,
                      })
                    }
                    className="w-full text-xs leading-[18px] text-[#33465c] bg-transparent focus:outline-none"
                  />
                </div>

                <p className="text-xs leading-[18px] text-[#116f7c]">
                  Nhập đủ 12 số, không trùng hồ sơ khác. Số CCCD sẽ được che bớt khi hiển thị.
                </p>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL_CLS}>Khu vực có thể dạy *</label>
                  <input
                    type="text"
                    required
                    value={formData.teachingArea}
                    onChange={(e) =>
                      setFormData({ ...formData, teachingArea: e.target.value })
                    }
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              {/* Card 2: Học vấn & kinh nghiệm */}
              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
                <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
                  Học vấn &amp; kinh nghiệm
                </h2>

                <div className="rounded-[7px] border border-[#dce4eb] bg-white p-3 min-h-[74px] flex flex-col gap-1">
                  <label className="text-xs leading-[18px] text-[#33465c]">
                    Nghề nghiệp hiện tại *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.currentOccupation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentOccupation: e.target.value,
                      })
                    }
                    className="w-full text-xs leading-[18px] text-[#33465c] bg-transparent focus:outline-none"
                  />
                </div>

                <div className="rounded-[7px] border border-[#dce4eb] bg-white p-3 min-h-[74px] flex flex-col gap-1">
                  <label className="text-xs leading-[18px] text-[#33465c]">
                    Đơn vị công tác (nếu là giáo viên)
                  </label>
                  <input
                    type="text"
                    value={formData.workplace}
                    onChange={(e) =>
                      setFormData({ ...formData, workplace: e.target.value })
                    }
                    className="w-full text-xs leading-[18px] text-[#33465c] bg-transparent focus:outline-none"
                  />
                </div>

                <div className="rounded-[7px] border border-[#dce4eb] bg-white p-3 min-h-[74px] flex flex-col gap-1">
                  <label className="text-xs leading-[18px] text-[#33465c]">
                    Hình thức nhận dạy *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.teachingMode}
                    onChange={(e) =>
                      setFormData({ ...formData, teachingMode: e.target.value })
                    }
                    className="w-full text-xs leading-[18px] text-[#33465c] bg-transparent focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL_CLS}>Trường / chuyên ngành *</label>
                  <input
                    type="text"
                    required
                    value={formData.education}
                    onChange={(e) =>
                      setFormData({ ...formData, education: e.target.value })
                    }
                    className={INPUT_CLS}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Năm tốt nghiệp</label>
                    <input
                      type="text"
                      value={formData.gradYear}
                      onChange={(e) =>
                        setFormData({ ...formData, gradYear: e.target.value })
                      }
                      className={INPUT_CLS}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={LABEL_CLS}>Kinh nghiệm gia sư</label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      className={INPUT_CLS}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL_CLS}>Môn / khối lớp *</label>
                  <input
                    type="text"
                    required
                    value={formData.subjectsGrades}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subjectsGrades: e.target.value,
                      })
                    }
                    className={INPUT_CLS}
                  />
                </div>

                <div className="rounded-[7px] border border-[#dce4eb] bg-white p-3 min-h-[112px] flex flex-col gap-1">
                  <label className="text-xs leading-[18px] text-[#33465c]">
                    Phương pháp giảng dạy
                  </label>
                  <textarea
                    rows={3}
                    value={formData.teachingMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        teachingMethod: e.target.value,
                      })
                    }
                    className="w-full text-xs leading-[18px] text-[#33465c] bg-transparent focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Card 3: Minh chứng & lịch rảnh */}
              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
                <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
                  Minh chứng &amp; lịch rảnh
                </h2>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL_CLS}>Bằng cấp / bảng điểm *</label>
                  <div className="rounded-[8px] border border-[#bac7d6] bg-white px-3 py-2.5 text-sm leading-[22px] text-[#172b4d]">
                    <p>✓ Bang_tot_nghiep.pdf &nbsp;&nbsp;&nbsp; ✓ Bang_diem.pdf</p>
                    <p>PDF, JPG, PNG · Tối đa 10 MB / tệp</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL_CLS}>Ảnh CCCD hai mặt *</label>
                  <div className="rounded-[8px] border border-[#bac7d6] bg-white px-3 py-2.5 text-sm leading-[22px] text-[#172b4d]">
                    ✓ Dinh_danh.pdf · Chỉ nhân sự xác minh được xem
                  </div>
                </div>

                <div className="rounded-[7px] border border-[#dce4eb] bg-white p-3 min-h-[74px] flex flex-col gap-1 text-xs leading-[18px] text-[#33465c]">
                  <p>Ảnh chân dung *</p>
                  <p>✓ Chan_dung.jpg</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL_CLS}>Khung giờ có thể nhận lớp</label>
                  <input
                    type="text"
                    value={formData.availableHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableHours: e.target.value,
                      })
                    }
                    className={INPUT_CLS}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL_CLS}>Thù lao mong muốn</label>
                  <input
                    type="text"
                    value={formData.desiredWage}
                    onChange={(e) =>
                      setFormData({ ...formData, desiredWage: e.target.value })
                    }
                    className={INPUT_CLS}
                  />
                </div>
              </div>
            </div>

            {/* Cột phải */}
            <div className="flex flex-col gap-5">
              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px] items-start">
                <h3 className="text-base font-semibold leading-6 text-[#172b4d]">
                  Kiểm tra trước khi gửi
                </h3>

                <p className="text-xs font-semibold leading-[18px] text-[#116f7c]">
                  ● 4/4 tài liệu đã đính kèm
                </p>

                <div className="flex flex-col gap-2 text-sm leading-[22px] text-[#33465c]">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.checkAccurate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          checkAccurate: e.target.checked,
                        })
                      }
                      className="mt-1 size-4 shrink-0 accent-[#116f7c]"
                    />
                    <span>Thông tin kê khai chính xác</span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.checkVerify}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          checkVerify: e.target.checked,
                        })
                      }
                      className="mt-1 size-4 shrink-0 accent-[#116f7c]"
                    />
                    <span>Đồng ý kiểm tra bằng cấp và kinh nghiệm</span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.checkConsent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          checkConsent: e.target.checked,
                        })
                      }
                      className="mt-1 size-4 shrink-0 accent-[#116f7c]"
                    />
                    <span>
                      Đồng ý để trung tâm xử lý dữ liệu cá nhân của tôi, kể cả giấy tờ định danh, để xét tuyển theo chính sách bảo mật. Thời điểm đồng ý được ghi nhận.
                    </span>
                  </label>
                </div>

                <Button type="submit" variant="primary">
                  Gửi hồ sơ ứng tuyển
                </Button>

                {isSubmitted && (
                  <div className="w-full p-4 bg-[#ecfdf3] text-[#166534] rounded-[8px] text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>
                      Hồ sơ ứng tuyển đã được ghi nhận! Trung tâm sẽ liên hệ phỏng vấn trong 48 giờ.
                    </span>
                  </div>
                )}

                <p className="text-sm leading-[22px] text-[#33465c]">
                  Sau khi gửi, tạo hoặc đăng nhập tài khoản Gia sư để theo dõi trạng thái.
                </p>
              </div>

              <div className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
                <h3 className="text-base font-semibold leading-6 text-[#172b4d]">
                  Sau khi ứng tuyển
                </h3>
                <div className="text-xs leading-[18px] text-[#52677d] space-y-4">
                  <div>
                    <p>✓ &nbsp;Kiểm tra hồ sơ</p>
                    <p>Đối chiếu thông tin và tài liệu.</p>
                  </div>
                  <div>
                    <p>✓ &nbsp;Trao đổi chuyên môn</p>
                    <p>Điều phối hẹn phỏng vấn qua điện thoại.</p>
                  </div>
                  <div>
                    <p>✓ &nbsp;Thông báo kết quả</p>
                    <p>Hồ sơ hợp lệ được kích hoạt nhận lời mời.</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
