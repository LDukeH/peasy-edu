"use client";

import { useState } from "react";
import { TrangThaiMonHoc, type SubjectDto } from "@/api/generated/model";
import { useSubjectsFindAll } from "@/api/generated/peasyApi";
import { ResultDialog } from "@/components/admin/account-dialogs";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { SubjectDialog } from "@/components/admin/category-dialog";
import { PageHeading } from "@/components/admin/page-heading";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { extractApiError } from "@/lib/api-error";
import {
  ALL_CAP_HOC,
  CAP_HOC_LABEL,
  NHOM_MON_LABEL,
  TRANG_THAI_MON_HOC_LABEL,
} from "@/lib/auth-labels";

type Dialog =
  | { type: "edit"; subject?: SubjectDto }
  | { type: "result"; message: string }
  | null;

const REFERENCE_AREAS = [
  "Quận 1",
  "Quận 3",
  "Quận 7",
  "Bình Thạnh",
  "TP. Thủ Đức",
  "Học trực tuyến (Online)",
];

export default function CategoriesPage() {
  const { data: subjects = [], isPending, isError, error } = useSubjectsFindAll();
  const [dialog, setDialog] = useState<Dialog>(null);
  const close = () => setDialog(null);

  return (
    <>
      <PageHeading
        title="Danh mục dùng chung"
        subtitle="Môn học, cấp học và khu vực được dùng thống nhất khi tiếp nhận và ghép gia sư."
      />
      <AdminTabs />

      {isError && (
        <Notice tone="error">
          {extractApiError(error, "Không thể tải danh sách môn học.").message}
        </Notice>
      )}

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Cột Môn học — Nối API thật /api/subjects */}
        <section className="flex min-h-[540px] min-w-0 flex-[1.4] flex-col gap-4 rounded-[10px] border border-line bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold leading-7 text-ink">
              Môn học
            </h2>
            <Button
              variant="secondary"
              onClick={() => setDialog({ type: "edit" })}
            >
              Thêm môn
            </Button>
          </div>

          {isPending ? (
            <p className="py-4 text-sm text-text-muted">Đang tải môn học…</p>
          ) : subjects.length === 0 ? (
            <p className="py-4 text-sm text-text-muted">
              Chưa có môn học nào.
            </p>
          ) : (
            <ul>
              {subjects.map((s) => {
                const isActive = s.trangThai === TrangThaiMonHoc.DANG_SU_DUNG;
                return (
                  <li key={s.id} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => setDialog({ type: "edit", subject: s })}
                      title="Bấm để sửa hoặc xóa môn học"
                      className="flex w-full cursor-pointer items-center gap-3 py-2.5 text-left hover:bg-canvas"
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-medium leading-[22px] ${
                            isActive
                              ? "text-body"
                              : "text-text-muted line-through"
                          }`}
                        >
                          <span className="mr-1.5 font-semibold text-ink">
                            {s.ma}
                          </span>
                          {s.tenMon}
                        </p>
                        <p className="text-xs leading-[18px] text-text-muted">
                          {NHOM_MON_LABEL[s.nhomMon]} ·{" "}
                          {s.capHoc.map((c) => CAP_HOC_LABEL[c]).join(", ")}
                        </p>
                      </div>
                      <span
                        className={`text-xs leading-[18px] whitespace-nowrap ${
                          isActive ? "text-brand" : "text-warn"
                        }`}
                      >
                        {TRANG_THAI_MON_HOC_LABEL[s.trangThai]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Cột Cấp học — Danh mục chuẩn theo enum CapHoc */}
        <section className="flex min-h-[540px] min-w-0 flex-1 flex-col gap-4 rounded-[10px] border border-line bg-white p-5">
          <h2 className="text-xl font-semibold leading-7 text-ink">Cấp học</h2>
          <ul>
            {ALL_CAP_HOC.map((level) => (
              <li
                key={level}
                className="flex items-center justify-between border-b border-line py-2.5 text-sm leading-[22px] text-body"
              >
                <span>{CAP_HOC_LABEL[level]}</span>
                <span className="text-xs leading-[18px] text-brand">
                  Đang dùng
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs leading-[18px] text-text-muted">
            Cấp học được chuẩn hóa theo hệ thống để kiểm tra điều kiện môn học.
          </p>
        </section>

        {/* Cột Khu vực — Tham chiếu */}
        <section className="flex min-h-[540px] min-w-0 flex-1 flex-col gap-4 rounded-[10px] border border-line bg-white p-5">
          <h2 className="text-xl font-semibold leading-7 text-ink">Khu vực</h2>
          <ul>
            {REFERENCE_AREAS.map((area) => (
              <li
                key={area}
                className="flex items-center justify-between border-b border-line py-2.5 text-sm leading-[22px] text-body"
              >
                <span>{area}</span>
                <span className="text-xs leading-[18px] text-brand">
                  Đang dùng
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs leading-[18px] text-text-muted">
            Khu vực phục vụ dùng để lọc gia sư và ghép lớp, không phải danh sách
            chi nhánh.
          </p>
        </section>
      </div>

      <Notice title="Đối chiếu điều kiện trước khi ghép lớp">
        Tiểu học chỉ áp dụng môn năng khiếu và kỹ năng theo TT 29/2024. Chỉnh sửa
        danh mục không thay đổi học phí hoặc quy tắc kinh doanh.
      </Notice>

      {dialog?.type === "edit" && (
        <SubjectDialog
          key={dialog.subject?.id ?? "new-subject"}
          subject={dialog.subject}
          onClose={close}
          onDone={(message) => setDialog({ type: "result", message })}
        />
      )}
      {dialog?.type === "result" && (
        <ResultDialog message={dialog.message} onClose={close} />
      )}
    </>
  );
}
