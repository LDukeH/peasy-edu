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
  "Bình Thạnh",
  "Phú Nhuận",
  "Gò Vấp",
  "Thủ Đức",
  "Quận 3",
  "Học trực tuyến (Online)",
];

export default function CategoriesPage() {
  const {
    data: subjects = [],
    isPending,
    isError,
    error,
  } = useSubjectsFindAll();
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Cột Môn học — Nối API thật /api/subjects */}
        <section className="flex min-h-[540px] lg:min-h-[650px] min-w-0 flex-col items-start gap-4 rounded-[10px] border border-[#dce4eb] bg-white p-5">
          <h2 className="text-xl font-semibold leading-7 text-[#172b4d]">
            Môn học
          </h2>
          <Button
            variant="secondary"
            onClick={() => setDialog({ type: "edit" })}
          >
            Thêm môn
          </Button>

          {isPending ? (
            <p className="py-4 text-sm text-[#52677d]">Đang tải môn học…</p>
          ) : subjects.length === 0 ? (
            <p className="py-4 text-sm text-[#52677d]">
              Chưa có môn học nào.
            </p>
          ) : (
            <ul className="w-full">
              {subjects.map((s) => {
                const isActive = s.trangThai === TrangThaiMonHoc.DANG_SU_DUNG;
                return (
                  <li key={s.id} className="border-b border-[#dce4eb]">
                    <button
                      type="button"
                      onClick={() => setDialog({ type: "edit", subject: s })}
                      title="Bấm để sửa hoặc xóa môn học"
                      className="flex w-full cursor-pointer items-center gap-3 py-2 text-left hover:bg-[#f5f8fa] transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm leading-[22px] ${
                            isActive
                              ? "text-[#33465c]"
                              : "text-[#52677d] line-through"
                          }`}
                        >
                          <span className="mr-1.5 font-semibold text-[#172b4d]">
                            {s.ma}
                          </span>
                          {s.tenMon}
                        </p>
                        <p className="text-xs leading-[18px] text-[#52677d]">
                          {NHOM_MON_LABEL[s.nhomMon]} ·{" "}
                          {s.capHoc.map((c) => CAP_HOC_LABEL[c]).join(", ")}
                        </p>
                      </div>
                      <span
                        className={`text-xs leading-[18px] whitespace-nowrap ${
                          isActive ? "text-[#116f7c]" : "text-[#7a440a]"
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

        {/* Cột Cấp học — Giữ 5 cấp chuẩn theo enum CapHoc */}
        <section className="flex min-h-[540px] lg:min-h-[650px] min-w-0 flex-col items-start gap-4 rounded-[10px] border border-[#dce4eb] bg-white p-5">
          <h2 className="text-xl font-semibold leading-7 text-[#172b4d]">
            Cấp học
          </h2>
          <ul className="w-full">
            {ALL_CAP_HOC.map((level) => (
              <li
                key={level}
                className="flex items-center justify-between border-b border-[#dce4eb] py-2 text-sm leading-[22px] text-[#33465c]"
              >
                <span>{CAP_HOC_LABEL[level]}</span>
                <span className="text-xs leading-[18px] text-[#116f7c]">
                  Đang dùng
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs leading-[18px] text-[#52677d]">
            Cấp học được chuẩn hóa theo hệ thống để kiểm tra điều kiện môn học.
          </p>
        </section>

        {/* Cột Khu vực — Tham chiếu */}
        <section className="flex min-h-[540px] lg:min-h-[650px] min-w-0 flex-col items-start gap-4 rounded-[10px] border border-[#dce4eb] bg-white p-5">
          <h2 className="text-xl font-semibold leading-7 text-[#172b4d]">
            Khu vực
          </h2>
          <ul className="w-full">
            {REFERENCE_AREAS.map((area) => (
              <li
                key={area}
                className="flex items-center justify-between border-b border-[#dce4eb] py-2 text-sm leading-[22px] text-[#33465c]"
              >
                <span>{area}</span>
                <span className="text-xs leading-[18px] text-[#116f7c]">
                  Đang dùng
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs leading-[18px] text-[#52677d]">
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
