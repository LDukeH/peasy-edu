"use client";

import { useState } from "react";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { PageHeading } from "@/components/admin/page-heading";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { saveCenterInfo, useCenterInfo } from "@/mocks/db";
import type { CenterInfo } from "@/mocks/types";

const MATRIX_HEAD = [
  "Vai trò",
  "Vận hành / ghép lớp",
  "Lớp / học tập",
  "Học phí / thù lao",
  "Chất lượng",
  "Truy cập / cài đặt",
];

const MATRIX: string[][] = [
  ["Chủ trung tâm", "Xem toàn bộ", "Xem toàn bộ", "Xem & phê duyệt", "Giám sát", "Phê duyệt quyền"],
  ["Điều phối", "Quản lý toàn bộ", "Quản lý toàn bộ", "Xem đơn giá lớp", "Xử lý phản hồi", "Hồ sơ cá nhân"],
  ["Kế toán", "—", "Xem buổi xác nhận", "Quản lý toàn bộ", "Xem khiếu nại", "Hồ sơ cá nhân"],
  ["Quản trị viên", "—", "—", "—", "—", "Quản lý tài khoản"],
  ["Gia sư", "Nhận lời mời riêng", "Lớp của mình", "Thù lao của mình", "Phản hồi liên quan", "Hồ sơ cá nhân"],
  ["Phụ huynh", "Yêu cầu / chọn gia sư", "Con của mình", "Phiếu học phí gia đình", "Gửi đánh giá / KN", "Tài khoản gia đình"],
  ["Học viên", "—", "Lịch / bài tập riêng", "—", "Gửi đánh giá / khiếu nại", "Hồ sơ cá nhân"],
  ["Khách", "Gửi yêu cầu công khai", "Dịch vụ công khai", "Khoảng phí công khai", "—", "Đăng ký / đăng nhập"],
];

export default function SettingsPage() {
  const saved = useCenterInfo();
  // Chỉ giữ phần người dùng đã sửa; chưa sửa thì luôn bám theo dữ liệu đã lưu.
  const [edits, setEdits] = useState<Partial<CenterInfo>>({});
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const form: CenterInfo = { ...saved, ...edits };
  const dirty = (Object.keys(edits) as (keyof CenterInfo)[]).some(
    (k) => edits[k] !== saved[k],
  );

  function update(patch: Partial<CenterInfo>) {
    setJustSaved(false);
    setEdits((e) => ({ ...e, ...patch }));
  }

  async function onSave() {
    setSaving(true);
    await saveCenterInfo(form);
    setSaving(false);
    setEdits({});
    setJustSaved(true);
  }

  return (
    <>
      <PageHeading
        title="Cài đặt & phân quyền"
        subtitle="Một trung tâm duy nhất · Quản lý quyền truy cập theo vai trò và phạm vi dữ liệu."
      />
      <AdminTabs />

      <section className="flex flex-col gap-[18px] rounded-xl border border-line bg-white p-6">
        <h2 className="text-base font-semibold leading-6 text-ink">Thông tin trung tâm</h2>
        <Field
          label="Tên hiển thị"
          value={form.displayName}
          onChange={(e) => update({ displayName: e.target.value })}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Email hỗ trợ"
            type="email"
            value={form.supportEmail}
            onChange={(e) => update({ supportEmail: e.target.value })}
          />
          <Field
            label="Điện thoại"
            type="tel"
            value={form.phone}
            onChange={(e) => update({ phone: e.target.value })}
          />
        </div>
        <span
          aria-disabled="true"
          title="Sắp có"
          className="w-fit cursor-not-allowed px-4 py-[11px] text-sm font-semibold leading-5 text-brand opacity-60"
        >
          Nhật ký truy cập →
        </span>
      </section>

      <section
        id="ma-tran"
        className="flex scroll-mt-6 flex-col gap-[18px] rounded-xl border border-line bg-white p-6"
      >
        <div>
          <h2 className="text-base font-semibold leading-6 text-ink">
            Ma trận quyền truy cập · 8 vai trò
          </h2>
          <p className="text-xs leading-[18px] text-muted">
            Quản lý: tạo / sửa / duyệt trong phạm vi · Xem: chỉ đọc · —: không truy cập
          </p>
        </div>
        <div className="overflow-x-auto rounded-[10px] border border-line">
          <table className="w-full min-w-[900px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-table-head">
                {MATRIX_HEAD.map((h, i) => (
                  <th
                    key={h}
                    scope="col"
                    className={`h-9 px-3.5 font-semibold ${i === 0 ? "text-ink" : "text-muted"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row) => (
                <tr key={row[0]} className="border-t border-table-line">
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={cell} scope="row" className="h-8 px-3.5 font-semibold text-ink">
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className="h-8 px-3.5 text-muted">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <section className="flex flex-col gap-[18px] rounded-xl border border-line bg-white p-6">
          <h2 className="text-base font-semibold leading-6 text-ink">Bảo vệ dữ liệu</h2>
          <ul className="flex flex-col gap-4 text-sm leading-[22px] text-body">
            <li>✓ Chỉ chia sẻ thông tin liên hệ và địa chỉ gia đình sau khi gia sư nhận lớp.</li>
            <li>✓ Tài liệu định danh chỉ hiển thị với người xác minh.</li>
            <li>✓ Mọi thay đổi quyền và ghi nhận thu / chi đều có nhật ký.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-[18px] rounded-xl border border-line bg-white p-6">
          <h2 className="text-base font-semibold leading-6 text-ink">Lưu thông tin trung tâm</h2>
          <p className="text-xs font-semibold leading-[18px] text-muted">
            <span className={dirty ? "text-warn-dot" : justSaved ? "text-brand" : "text-warn-dot"}>●</span>{" "}
            {dirty ? "Có thay đổi chưa lưu" : justSaved ? "Đã lưu thay đổi" : "Chưa có thay đổi"}
          </p>
          <p className="text-sm leading-[22px] text-body">
            Chỉ lưu thông tin liên hệ và tên hiển thị. Không lưu khung giá hoặc tham số kinh doanh.
          </p>
          <div>
            <Button disabled={!dirty || saving} onClick={onSave}>
              {saving ? "Đang lưu…" : "Lưu cài đặt"}
            </Button>
          </div>
          {justSaved && !dirty && (
            <Notice tone="success" small>
              Đã ghi nhận trong nhật ký quản trị (mock).
            </Notice>
          )}
        </section>
      </div>
    </>
  );
}
