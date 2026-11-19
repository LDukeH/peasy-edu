"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, SelectField } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Notice } from "@/components/ui/notice";
import { saveCategory } from "@/mocks/db";
import type { CategoryGroup, CategoryItem } from "@/mocks/types";

export const GROUP_LABEL: Record<CategoryGroup, string> = {
  SUBJECT: "Môn học",
  GRADE: "Cấp lớp",
  AREA: "Khu vực",
};

export function CategoryDialog({
  group,
  item,
  onClose,
  onDone,
}: {
  group: CategoryGroup;
  item?: CategoryItem; // có = sửa, không = thêm mới
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [active, setActive] = useState(item?.active ?? true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Vui lòng nhập tên hiển thị.");
      return;
    }
    setBusy(true);
    const res = await saveCategory({ id: item?.id, group, name, description, active });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onDone(`${GROUP_LABEL[group]}: đã lưu “${res.data.name}”.`);
  }

  return (
    <Modal title="Cập nhật danh mục" onClose={onClose}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[18px]">
        <SelectField label="Nhóm danh mục" value={group} disabled onChange={() => {}}>
          <option value={group}>{GROUP_LABEL[group]}</option>
        </SelectField>
        <Field
          variant="dialog"
          label="Tên hiển thị *"
          value={name}
          error={error}
          placeholder="Tiếng Nhật"
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
        />
        <Field
          variant="dialog"
          label="Mô tả"
          value={description}
          placeholder="Ngoại ngữ · Áp dụng từ THCS"
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm leading-[22px] text-body">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="size-4 accent-brand"
          />
          Đang dùng (bỏ chọn để tạm dừng, không xóa dữ liệu cũ)
        </label>
        <Notice>
          Danh mục được dùng thống nhất trong tiếp nhận và ghép lớp. Việc cập nhật không làm thay đổi khung giá.
        </Notice>
        <div className="flex gap-3">
          <Button type="submit" disabled={busy}>{busy ? "Đang lưu…" : "Lưu danh mục"}</Button>
          <Button variant="secondary" onClick={onClose}>Hủy</Button>
        </div>
      </form>
    </Modal>
  );
}
