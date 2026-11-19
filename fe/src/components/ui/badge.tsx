import { STATUS_LABEL, type AccountStatus } from "@/mocks/types";

const tones: Record<AccountStatus, string> = {
  HOAT_DONG: "bg-brand-soft text-brand",
  BI_KHOA: "bg-danger-soft text-danger",
  CHO_KICH_HOAT: "bg-warn-soft text-warn",
};

export function StatusBadge({ status }: { status: AccountStatus }) {
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1.5 text-xs font-semibold leading-[18px] whitespace-nowrap ${tones[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
