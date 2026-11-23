"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import {
  CapHoc,
  NhomMon,
  TrangThaiMonHoc,
  type SubjectDto,
} from "@/api/generated/model";
import {
  getSubjectsFindAllQueryKey,
  useSubjectsCreate,
  useSubjectsRemove,
  useSubjectsUpdate,
} from "@/api/generated/peasyApi";
import { Button } from "@/components/ui/button";
import { Field, SelectField } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Notice } from "@/components/ui/notice";
import { extractApiError } from "@/lib/api-error";
import {
  ALL_CAP_HOC,
  ALL_NHOM_MON,
  CAP_HOC_LABEL,
  NHOM_MON_LABEL,
} from "@/lib/auth-labels";

export function SubjectDialog({
  subject,
  onClose,
  onDone,
}: {
  subject?: SubjectDto; // có = sửa/xóa, không = thêm mới
  onClose: () => void;
  onDone: (message: string) => void;
}) {
  const queryClient = useQueryClient();
  const createMutation = useSubjectsCreate();
  const updateMutation = useSubjectsUpdate();
  const removeMutation = useSubjectsRemove();

  const [tenMon, setTenMon] = useState(subject?.tenMon ?? "");
  const [nhomMon, setNhomMon] = useState<NhomMon>(
    subject?.nhomMon ?? NhomMon.VAN_HOA,
  );
  const [capHoc, setCapHoc] = useState<CapHoc[]>(
    subject?.capHoc ?? [CapHoc.THCS, CapHoc.THPT],
  );
  const [moTa, setMoTa] = useState(subject?.moTa ?? "");
  const [active, setActive] = useState(
    subject ? subject.trangThai === TrangThaiMonHoc.DANG_SU_DUNG : true,
  );
  const [error, setError] = useState("");

  const busy =
    createMutation.isPending ||
    updateMutation.isPending ||
    removeMutation.isPending;

  function toggleCapHoc(level: CapHoc) {
    setCapHoc((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
    setError("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!tenMon.trim()) {
      setError("Vui lòng nhập tên môn học.");
      return;
    }
    if (capHoc.length === 0) {
      setError("Vui lòng chọn ít nhất một cấp học áp dụng.");
      return;
    }
    if (
      capHoc.includes(CapHoc.TIEU_HOC) &&
      nhomMon !== NhomMon.NANG_KHIEU_KY_NANG
    ) {
      setError(
        "Cấp Tiểu học chỉ áp dụng cho nhóm Năng khiếu & Kỹ năng (TT 29/2024).",
      );
      return;
    }

    try {
      if (subject) {
        const updated = await updateMutation.mutateAsync({
          id: subject.id,
          data: {
            tenMon: tenMon.trim(),
            nhomMon,
            capHoc,
            moTa: moTa.trim() || undefined,
            trangThai: active
              ? TrangThaiMonHoc.DANG_SU_DUNG
              : TrangThaiMonHoc.NGUNG_SU_DUNG,
          },
        });
        await queryClient.invalidateQueries({
          queryKey: getSubjectsFindAllQueryKey(),
        });
        onDone(`Môn học: đã cập nhật ${updated.ma} · “${updated.tenMon}”.`);
      } else {
        const created = await createMutation.mutateAsync({
          data: {
            tenMon: tenMon.trim(),
            nhomMon,
            capHoc,
            moTa: moTa.trim() || undefined,
          },
        });
        await queryClient.invalidateQueries({
          queryKey: getSubjectsFindAllQueryKey(),
        });
        onDone(`Môn học: đã thêm ${created.ma} · “${created.tenMon}”.`);
      }
    } catch (err) {
      setError(extractApiError(err, "Không thể lưu môn học.").message);
    }
  }

  async function onDelete() {
    if (!subject) return;
    setError("");
    try {
      await removeMutation.mutateAsync({ id: subject.id });
      await queryClient.invalidateQueries({
        queryKey: getSubjectsFindAllQueryKey(),
      });
      onDone(`Môn học: đã xóa ${subject.ma} · “${subject.tenMon}”.`);
    } catch (err) {
      const parsed = extractApiError(err, "Không thể xóa môn học.");
      if (parsed.statusCode === 409) {
        setError(
          `${parsed.message} Hãy bỏ chọn "Đang dùng" và lưu để chuyển sang Ngừng dùng.`,
        );
      } else {
        setError(parsed.message);
      }
    }
  }

  return (
    <Modal
      title={subject ? `Cập nhật môn ${subject.ma}` : "Thêm môn học mới"}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-[18px]">
        {error && <Notice tone="error">{error}</Notice>}

        <Field
          variant="dialog"
          label="Tên môn học *"
          value={tenMon}
          placeholder="Tiếng Nhật"
          onChange={(e) => {
            setTenMon(e.target.value);
            setError("");
          }}
        />

        <SelectField
          label="Nhóm môn *"
          value={nhomMon}
          onChange={(e) => {
            setNhomMon(e.target.value as NhomMon);
            setError("");
          }}
        >
          {ALL_NHOM_MON.map((g) => (
            <option key={g} value={g}>
              {NHOM_MON_LABEL[g]}
            </option>
          ))}
        </SelectField>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold leading-5 text-body">
            Cấp học áp dụng *
          </span>
          <div className="flex flex-wrap gap-3">
            {ALL_CAP_HOC.map((level) => {
              const checked = capHoc.includes(level);
              return (
                <label
                  key={level}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-canvas px-3 py-1.5 text-xs font-medium text-body"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCapHoc(level)}
                    className="size-4 accent-brand"
                  />
                  {CAP_HOC_LABEL[level]}
                </label>
              );
            })}
          </div>
        </div>

        <Field
          variant="dialog"
          label="Mô tả"
          value={moTa}
          placeholder="Ngoại ngữ · Áp dụng từ THCS"
          onChange={(e) => setMoTa(e.target.value)}
        />

        {subject && (
          <label className="flex cursor-pointer items-center gap-2 text-sm leading-[22px] text-body">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="size-4 accent-brand"
            />
            Đang dùng (bỏ chọn để ngừng sử dụng, giữ nguyên dữ liệu lớp cũ)
          </label>
        )}

        <Notice>
          Tiểu học chỉ áp dụng môn thuộc nhóm Năng khiếu & Kỹ năng theo TT
          29/2024.
        </Notice>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={busy}>
            {createMutation.isPending || updateMutation.isPending
              ? "Đang lưu…"
              : "Lưu môn học"}
          </Button>
          {subject && (
            <Button
              type="button"
              variant="danger"
              disabled={busy}
              onClick={onDelete}
            >
              {removeMutation.isPending ? "Đang xóa…" : "Xóa môn"}
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
        </div>
      </form>
    </Modal>
  );
}
