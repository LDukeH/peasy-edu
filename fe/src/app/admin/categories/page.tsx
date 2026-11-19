"use client";

import { useState } from "react";
import { AdminTabs } from "@/components/admin/admin-tabs";
import { ResultDialog } from "@/components/admin/account-dialogs";
import { CategoryDialog, GROUP_LABEL } from "@/components/admin/category-dialog";
import { PageHeading } from "@/components/admin/page-heading";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { useCategories } from "@/mocks/db";
import type { CategoryGroup, CategoryItem } from "@/mocks/types";

type Dialog =
  | { type: "edit"; group: CategoryGroup; item?: CategoryItem }
  | { type: "result"; message: string }
  | null;

export default function CategoriesPage() {
  const categories = useCategories();
  const [dialog, setDialog] = useState<Dialog>(null);
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);

  const by = (g: CategoryGroup) => categories.filter((c) => c.group === g);
  const grades = by("GRADE");
  const selectedGrade =
    grades.find((g) => g.id === selectedGradeId) ??
    grades.find((g) => g.name === "Lớp 8") ??
    grades[0];

  const close = () => setDialog(null);

  function Column({
    group,
    action,
    onAction,
    note,
  }: {
    group: CategoryGroup;
    action: string;
    onAction: () => void;
    note?: string;
  }) {
    const items = by(group);
    return (
      <section className="flex min-h-[650px] min-w-0 flex-1 flex-col gap-4 rounded-[10px] border border-line bg-white p-5">
        <h2 className="text-xl font-semibold leading-7 text-ink">{GROUP_LABEL[group]}</h2>
        <div>
          <Button variant="secondary" onClick={onAction} disabled={items.length === 0 && group === "GRADE"}>
            {action}
          </Button>
        </div>
        <ul>
          {items.map((c) => {
            const selected = group === "GRADE" && c.id === selectedGrade?.id;
            return (
              <li key={c.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() =>
                    group === "GRADE"
                      ? setSelectedGradeId(c.id)
                      : setDialog({ type: "edit", group, item: c })
                  }
                  aria-pressed={group === "GRADE" ? selected : undefined}
                  title={group === "GRADE" ? "Chọn lớp rồi bấm nút Sửa" : "Bấm để sửa"}
                  className={`flex w-full cursor-pointer items-center gap-2 py-2 text-left hover:bg-canvas ${selected ? "bg-brand-soft/60" : ""}`}
                >
                  <span className={`flex-1 text-sm leading-[22px] ${c.active ? "text-body" : "text-text-muted line-through"}`}>
                    {c.name}
                  </span>
                  <span className={`text-xs leading-[18px] whitespace-nowrap ${c.active ? "text-brand" : "text-warn"}`}>
                    {c.active ? "Đang dùng" : "Tạm dừng"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {note && <p className="text-xs leading-[18px] text-text-muted">{note}</p>}
      </section>
    );
  }

  return (
    <>
      <PageHeading
        title="Danh mục dùng chung"
        subtitle="Môn học, cấp lớp và khu vực được dùng thống nhất khi tiếp nhận và ghép gia sư."
      />
      <AdminTabs />

      <div className="flex flex-col gap-4 lg:flex-row">
        {Column({
          group: "SUBJECT",
          action: "Thêm môn",
          onAction: () => setDialog({ type: "edit", group: "SUBJECT" }),
        })}
        {Column({
          group: "GRADE",
          action: `Sửa ${selectedGrade?.name ?? "cấp lớp"}`,
          onAction: () =>
            selectedGrade && setDialog({ type: "edit", group: "GRADE", item: selectedGrade }),
        })}
        {Column({
          group: "AREA",
          action: "Thêm khu vực",
          onAction: () => setDialog({ type: "edit", group: "AREA" }),
          note: "Khu vực phục vụ dùng để lọc gia sư và ghép lớp, không phải danh sách chi nhánh.",
        })}
      </div>

      <Notice title="Đối chiếu điều kiện trước khi ghép lớp">
        Tiểu học chỉ áp dụng môn năng khiếu và kỹ năng theo TT 29/2024. Chỉnh sửa danh mục không thay đổi học phí hoặc quy tắc kinh doanh.
      </Notice>

      {dialog?.type === "edit" && (
        <CategoryDialog
          key={dialog.item?.id ?? `new-${dialog.group}`}
          group={dialog.group}
          item={dialog.item}
          onClose={close}
          onDone={(message) => setDialog({ type: "result", message })}
        />
      )}
      {dialog?.type === "result" && <ResultDialog message={dialog.message} onClose={close} />}
    </>
  );
}
