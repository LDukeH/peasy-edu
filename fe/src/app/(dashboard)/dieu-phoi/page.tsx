"use client";

import React from "react";
import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/hooks/use-auth-session";

const WEEKLY_DATA = [
  { week: "T34", requests: 6, classes: 2 },
  { week: "T35", requests: 8, classes: 3 },
  { week: "T36", requests: 7, classes: 2 },
  { week: "T37", requests: 9, classes: 4 },
  { week: "T38", requests: 8, classes: 3 },
  { week: "T39", requests: 11, classes: 4 },
  { week: "T40", requests: 9, classes: 3 },
  { week: "T41", requests: 12, classes: 5 },
  { week: "T42", requests: 10, classes: 4 },
  { week: "T43", requests: 6, classes: 2 },
];

const UPCOMING_TRIALS = [
  {
    studentSubject: "Lê Hoàng Nam · Toán 8",
    tutor: "Nguyễn Minh Anh",
    time: "26/11 · 18:30",
    status: "Đã xác nhận",
    confirmed: true,
  },
  {
    studentSubject: "Nguyễn Bảo An · Anh 6",
    tutor: "Phạm Khánh Linh",
    time: "25/11 · 17:00",
    status: "Chờ phụ huynh",
    confirmed: false,
  },
  {
    studentSubject: "Võ Minh Khang · Lý 10",
    tutor: "Đỗ Thành Long",
    time: "25/11 · 19:30",
    status: "Đã xác nhận",
    confirmed: true,
  },
];

const KPI_CARDS = [
  {
    label: "Yêu cầu đang xử lý",
    value: "24",
    note: "↑ 6 yêu cầu trong tuần",
  },
  {
    label: "Lớp đang hoạt động",
    value: "198",
    note: "↑ 12 lớp so với tháng trước",
  },
  {
    label: "Buổi học tháng này",
    value: "2.064",
    note: "96,4% được xác nhận",
  },
  {
    label: "Gia sư còn nhận lớp",
    value: "64",
    note: "148 gia sư đang hoạt động · 8 hồ sơ chờ duyệt",
  },
];

const RECENT_ACTIVITIES = [
  {
    title: "✓  Đã gửi 3 gia sư cho YC01024",
    detail: "Toán 8 · Lê Hoàng Nam · 10:12 hôm nay",
  },
  {
    title: "✓  Phụ huynh xác nhận buổi học",
    detail: "Trần Thu Hà · Buổi 7 (LP00816) · 09:45",
  },
  {
    title: "✓  Hồ sơ GS00018 được cập nhật",
    detail: "Nguyễn Minh Anh · Bổ sung lịch tháng 11 · 09:20 hôm nay",
  },
];

export default function DieuPhoiOverviewPage() {
  const { user } = useAuthSession();
  const shortName = user?.hoTen
    ? user.hoTen.trim().split(/\s+/).slice(-2).join(" ")
    : "Ngọc Linh";

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-[28px] sm:text-[32px] font-normal leading-[44px] text-[#172b4d]">
          Chào buổi sáng, {shortName}
        </h1>

        <div className="flex items-center gap-3">
          <Badge variant="neutral">Thứ Ba, 24/11/2026</Badge>
          <Link href="/yeu-cau-tim-gia-su">
            <Button variant="primary">+ Tạo yêu cầu</Button>
          </Link>
        </div>
      </div>

      {/* 2. Date controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Button variant="secondary">01/11–24/11/2026</Button>
        <Button variant="secondary">Xuất báo cáo</Button>
      </div>

      {/* 3. KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-[#dbe4eb] rounded-[10px] px-6 py-4 flex flex-col gap-1.5"
          >
            <p className="text-xs leading-[18px] text-[#52677d]">
              {card.label}
            </p>
            <p className="text-2xl leading-10 text-[#172b4d]">{card.value}</p>
            <p className="text-xs leading-[18px] text-[#52677d]">{card.note}</p>
          </div>
        ))}
      </div>

      {/* 4. Middle row: Chart + Trials (left) | Priority + Monthly Target (right) */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-5 min-w-0">
          {/* Yêu cầu & lớp mới */}
          <section className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
            <div>
              <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
                Yêu cầu &amp; lớp mới
              </h2>
              <p className="text-xs leading-[18px] text-[#52677d]">
                Yêu cầu mới &nbsp;•&nbsp; Lớp đã mở · 10 tuần gần nhất
              </p>
            </div>

            <div className="flex items-baseline justify-between gap-4">
              <p className="text-2xl font-semibold leading-8 text-[#172b4d]">
                86 yêu cầu
              </p>
              <p className="text-xs leading-[18px] text-[#116f7c]">
                +18,2% so với kỳ trước
              </p>
            </div>

            <div className="h-[190px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={WEEKLY_DATA}
                  margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#d9e0e8"
                    strokeDasharray="0"
                  />
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#52677d", fontSize: 12 }}
                    dy={6}
                  />
                  <YAxis
                    domain={[0, 15]}
                    ticks={[0, 5, 10, 15]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#52677d", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(234, 240, 245, 0.5)" }}
                    contentStyle={{
                      borderRadius: 8,
                      borderColor: "#dce4eb",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="requests"
                    name="Yêu cầu mới"
                    fill="#6ba6b2"
                    barSize={14}
                    radius={[3, 3, 0, 0]}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="classes"
                    name="Lớp đã mở"
                    fill="#172b4d"
                    barSize={14}
                    radius={[3, 3, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-6 text-xs leading-[18px]">
              <span className="text-[#52677d]">
                <span className="text-[#6ba6b2]">●</span> Yêu cầu mới
              </span>
              <span className="text-[#172b4d]">
                <span className="text-[#172b4d]">●</span> Lớp đã mở
              </span>
            </div>
          </section>

          {/* Lịch học thử sắp tới */}
          <section className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
            <div>
              <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
                Lịch học thử sắp tới
              </h2>
              <p className="text-sm leading-[22px] text-[#5c6e85]">
                Bao gồm lịch dự kiến chưa xác nhận
              </p>
            </div>

            <div className="overflow-x-auto rounded-[10px] border border-[#dce4eb]">
              <table className="w-full min-w-[540px] border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-[#f1f5f9] border-b border-[#e3e8f0]">
                    <th className="h-9 px-3.5 font-semibold text-[#172b4d]">
                      Học viên / môn học
                    </th>
                    <th className="h-9 px-3.5 font-normal text-[#52677d]">
                      Gia sư
                    </th>
                    <th className="h-9 px-3.5 font-normal text-[#52677d]">
                      Thời gian
                    </th>
                    <th className="h-9 px-3.5 font-normal text-[#52677d]">
                      Xác nhận
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8f0]">
                  {UPCOMING_TRIALS.map((row) => (
                    <tr key={row.studentSubject}>
                      <td className="h-8 px-3.5 font-semibold text-[#172b4d]">
                        {row.studentSubject}
                      </td>
                      <td className="h-8 px-3.5 text-[#52677d]">{row.tutor}</td>
                      <td className="h-8 px-3.5 text-[#52677d]">{row.time}</td>
                      <td className="h-8 px-3.5 text-[#52677d]">
                        <span
                          className={
                            row.confirmed ? "text-[#116f7c]" : "text-[#b2730d]"
                          }
                        >
                          ●
                        </span>{" "}
                        {row.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Cần bạn xử lý (Priority Action Card) */}
          <section className="bg-[#eef8f9] border-[1.5px] border-[#116f7c] rounded-[12px] p-6 flex flex-col gap-[18px]">
            <div>
              <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
                Cần bạn xử lý
              </h2>
              <p className="text-xs leading-[18px] text-[#52677d]">
                Ưu tiên hôm nay
              </p>
            </div>

            {/* Item 1 */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <ClipboardCheck className="h-[18px] w-[18px] text-[#116f7c] shrink-0" />
                <p className="flex-1 text-sm font-semibold leading-5 text-[#33465c]">
                  8 hồ sơ chờ xác minh
                </p>
                <span className="text-xs font-semibold leading-[18px] text-[#116f7c]">
                  ● 8
                </span>
              </div>
              <p className="text-xs leading-[18px] text-[#52677d]">
                3 hồ sơ đã chờ hơn 24 giờ. Ưu tiên kiểm tra bằng cấp và lịch rảnh.
              </p>
              <span className="text-xs font-semibold leading-[18px] text-[#116f7c]">
                Mở hàng đợi xác minh →
              </span>
            </div>

            <div className="h-px w-full bg-[#dce4eb]" />

            {/* Item 2 */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold leading-5 text-[#33465c]">
                12 yêu cầu cần đề xuất gia sư
              </p>
              <p className="text-xs leading-[18px] text-[#52677d]">
                Mở danh sách yêu cầu cần đề xuất
              </p>
              <span className="text-xs font-semibold leading-[18px] text-[#116f7c]">
                Ghép gia sư theo tiêu chí →
              </span>
            </div>

            <div className="h-px w-full bg-[#dce4eb]" />

            {/* Item 3 */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold leading-5 text-[#80520b]">
                4 buổi chờ xác nhận
              </p>
              <p className="text-xs leading-[18px] text-[#52677d]">
                Nhắc phụ huynh trước khi chốt học phí.
              </p>
            </div>
          </section>

          {/* Tiến độ tháng 11 */}
          <section className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
            <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
              Tiến độ tháng 11
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-xs leading-[18px] text-[#52677d]">
                Lớp mới / mục tiêu
              </span>
              <span className="text-sm leading-[22px] text-[#172b4d]">
                32 / 40
              </span>
            </div>
            <div className="h-2 w-full rounded-[4px] bg-[#ddf2f4] overflow-hidden">
              <div className="h-full w-[80%] rounded-[4px] bg-[#77c5cf]" />
            </div>
            <p className="text-sm leading-[22px] text-[#33465c]">
              Đạt 80% · Còn 8 lớp để hoàn thành mục tiêu.
            </p>
          </section>
        </div>
      </div>

      {/* 5. Bottom row: Hoạt động gần đây | Chất lượng vận hành */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 items-start">
        <section className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
          <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
            Hoạt động gần đây
          </h2>
          <div className="flex flex-col gap-4 text-xs leading-[18px] text-[#52677d]">
            {RECENT_ACTIVITIES.map((act) => (
              <div key={act.title}>
                <p>{act.title}</p>
                <p>{act.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-[#dce4eb] rounded-[12px] p-6 flex flex-col gap-[18px]">
          <h2 className="text-base font-semibold leading-6 text-[#172b4d]">
            Chất lượng vận hành
          </h2>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-semibold leading-8 text-[#172b4d]">
                4,9/5
              </p>
              <p className="text-xs leading-[18px] text-[#52677d]">
                Hài lòng của gia đình
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-semibold leading-8 text-[#172b4d]">
                97%
              </p>
              <p className="text-xs leading-[18px] text-[#52677d]">
                Buổi học đúng lịch
              </p>
            </div>
          </div>
          <div className="h-px w-full bg-[#dce4eb]" />
          <div className="text-sm leading-[22px] text-[#33465c] space-y-4">
            <p>
              2 phản hồi cần theo dõi · Không có khiếu nại nghiêm trọng mới.
            </p>
            <p className="text-[#33465c]">Xem báo cáo chất lượng →</p>
          </div>
        </section>
      </div>
    </div>
  );
}
