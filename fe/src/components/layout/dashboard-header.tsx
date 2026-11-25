"use client";

import React, { useState } from "react";

const NOTIFICATIONS = [
  {
    id: "1",
    title: "3 hồ sơ gia sư chờ xác minh hơn 24 giờ",
    time: "10 phút trước",
  },
  {
    id: "2",
    title: "Phụ huynh Trần Thu Hà vừa xác nhận buổi 7 (LP00816)",
    time: "35 phút trước",
  },
  {
    id: "3",
    title: "Yêu cầu mới YC01028 · Toán lớp 9 tại Bình Thạnh",
    time: "1 giờ trước",
  },
];

export function DashboardHeader({
  section = "Điều phối",
  current = "Tổng quan",
}: {
  section?: string;
  current?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative h-[72px] shrink-0 border-b border-[#dce4eb] bg-white px-8 flex items-center justify-between">
      <p className="text-[13px] leading-[18px] font-medium text-[#3d5266]">
        <span>{section}</span>
        <span className="mx-2">/</span>
        <span className="font-semibold text-[#172b4d]">{current}</span>
      </p>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="cursor-pointer bg-white border border-[#d9e0e8] hover:bg-[#f5f8fa] rounded-[8px] pl-3 pr-2 py-1.5 flex items-center gap-2 transition-colors"
        >
          <span className="text-xs leading-[18px] text-[#172b4d]">
            Thông báo
          </span>
          <span className="size-5 rounded-full bg-[#116f7c] text-white text-xs font-semibold leading-[18px] flex items-center justify-center">
            {NOTIFICATIONS.length}
          </span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-[320px] rounded-[12px] border border-[#dce4eb] bg-white p-4 shadow-lg z-50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#172b4d]">
                Thông báo gần đây
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-[#52677d] hover:text-[#172b4d] cursor-pointer"
              >
                Đóng
              </button>
            </div>
            <div className="divide-y divide-[#e3e8f0]">
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="py-2.5 first:pt-0 last:pb-0">
                  <p className="text-xs font-medium text-[#172b4d] leading-[18px]">
                    {n.title}
                  </p>
                  <p className="text-[11px] text-[#52677d] mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
