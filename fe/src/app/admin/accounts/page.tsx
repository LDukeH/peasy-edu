"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { TrangThaiTaiKhoan, type UserDto } from "@/api/generated/model";
import {
  getUsersFindAllQueryKey,
  usersFindAll,
} from "@/api/generated/peasyApi";
import {
  CreateAccountDialog,
  EditAccountDialog,
  LockDialog,
  ResultDialog,
} from "@/components/admin/account-dialogs";
import { PageHeading } from "@/components/admin/page-heading";
import { StatusBadge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { useAuthSession } from "@/hooks/use-auth-session";
import { extractApiError } from "@/lib/api-error";
import { formatPhone, VAI_TRO_LABEL } from "@/lib/auth-labels";

type Dialog =
  | { type: "create" }
  | { type: "edit"; account: UserDto }
  | { type: "lock"; account: UserDto; unlock: boolean }
  | { type: "result"; message?: string }
  | null;

const ACCOUNTS_PAGE_SIZE = 100;

async function fetchAllAccounts(signal?: AbortSignal): Promise<{
  items: UserDto[];
  total: number;
}> {
  const first = await usersFindAll(
    { page: 1, pageSize: ACCOUNTS_PAGE_SIZE },
    undefined,
    signal,
  );
  const totalPages = Math.ceil(first.total / first.pageSize);
  if (totalPages <= 1) {
    return { items: first.items, total: first.total };
  }

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      usersFindAll(
        { page: index + 2, pageSize: first.pageSize },
        undefined,
        signal,
      ),
    ),
  );

  const byId = new Map<number, UserDto>();
  for (const item of first.items) byId.set(item.id, item);
  for (const page of rest) {
    for (const item of page.items) byId.set(item.id, item);
  }

  const items = Array.from(byId.values());
  return { items, total: Math.max(first.total, items.length) };
}

export default function AccountsPage() {
  const { user: me } = useAuthSession();
  const { data, isPending, isError, error } = useQuery({
    queryKey: [...getUsersFindAllQueryKey(), "all"],
    queryFn: ({ signal }) => fetchAllAccounts(signal),
  });

  const [dialog, setDialog] = useState<Dialog>(null);
  const close = () => setDialog(null);
  const done = (message: string) => setDialog({ type: "result", message });

  const accounts = data?.items ?? [];
  const total = data?.total ?? accounts.length;
  const activeCount = accounts.filter(
    (a) => a.trangThai === TrangThaiTaiKhoan.HOAT_DONG,
  ).length;
  const lockedCount = accounts.filter(
    (a) => a.trangThai === TrangThaiTaiKhoan.BI_KHOA,
  ).length;

  const stats = [
    ["Tổng tài khoản", total],
    ["Đang hoạt động", activeCount],
    ["Bị khóa", lockedCount],
  ] as const;

  return (
    <>
      <PageHeading
        title="Tài khoản"
        subtitle="Tạo và quản lý quyền truy cập theo vai trò trong hệ thống."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="flex min-h-[104px] flex-col gap-1.5 rounded-[10px] border border-line bg-white p-5"
          >
            <p className="text-xs leading-[18px] text-text-muted">{label}</p>
            <p className="text-2xl leading-10 text-ink">
              {isPending ? "…" : value}
            </p>
          </div>
        ))}
      </div>

      <section className="flex flex-col gap-4 rounded-[10px] border border-line bg-white p-5">
        <div className="flex items-center gap-4">
          <h2 className="flex-1 text-xl font-semibold leading-7 text-ink">
            Danh sách tài khoản
          </h2>
          <Button onClick={() => setDialog({ type: "create" })}>
            Tạo tài khoản
          </Button>
        </div>

        {isError && (
          <Notice tone="error">
            {extractApiError(error, "Không thể tải danh sách tài khoản.").message}
          </Notice>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="text-sm font-semibold leading-5 text-text-muted">
                <th scope="col" className="w-[260px] py-2.5 pr-3">
                  Người dùng
                </th>
                <th scope="col" className="w-[170px] py-2.5 pr-3">
                  Vai trò
                </th>
                <th scope="col" className="w-[190px] py-2.5 pr-3">
                  Số điện thoại
                </th>
                <th scope="col" className="w-[150px] py-2.5 pr-3">
                  Trạng thái
                </th>
                <th scope="col" className="py-2.5">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {isPending ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-sm text-text-muted"
                  >
                    Đang tải danh sách tài khoản…
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-sm text-text-muted"
                  >
                    Chưa có tài khoản nào.
                  </td>
                </tr>
              ) : (
                accounts.map((a) => {
                  const isMe = a.id === me?.id;
                  return (
                    <tr
                      key={a.id}
                      className="border-b border-line align-middle"
                    >
                      <td className="py-3 pr-3">
                        <p className="text-sm font-semibold leading-5 text-ink">
                          {a.hoTen}
                        </p>
                        <p className="mt-[3px] text-xs leading-[18px] text-text-muted">
                          {a.maDoiTuong ? `${a.maDoiTuong} · ` : ""}
                          {a.tenDangNhap}
                          {isMe && " · Đang đăng nhập"}
                        </p>
                      </td>
                      <td className="py-3 pr-3 text-sm leading-[22px] text-body">
                        {VAI_TRO_LABEL[a.vaiTro]}
                      </td>
                      <td className="py-3 pr-3 text-sm leading-[22px] text-body">
                        {formatPhone(a.soDienThoai)}
                      </td>
                      <td className="py-3 pr-3">
                        <StatusBadge status={a.trangThai} />
                      </td>
                      <td className="py-3">
                        {isMe ? (
                          <span className="text-xs leading-[18px] text-text-muted">
                            Tài khoản của bạn
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="secondary"
                              onClick={() =>
                                setDialog({ type: "edit", account: a })
                              }
                            >
                              Sửa
                            </Button>
                            {a.trangThai === TrangThaiTaiKhoan.BI_KHOA ? (
                              <Button
                                variant="secondary"
                                onClick={() =>
                                  setDialog({
                                    type: "lock",
                                    account: a,
                                    unlock: true,
                                  })
                                }
                              >
                                Mở khóa
                              </Button>
                            ) : (
                              <>
                                <Link
                                  href="/admin/settings#ma-tran"
                                  className={buttonClasses("secondary")}
                                >
                                  Xem quyền
                                </Link>
                                <Button
                                  variant="secondary"
                                  onClick={() =>
                                    setDialog({
                                      type: "lock",
                                      account: a,
                                      unlock: false,
                                    })
                                  }
                                >
                                  Khóa
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs leading-[18px] text-text-muted">
          Không khóa tài khoản đang sử dụng. Khóa truy cập không tự dừng các lớp
          đang vận hành.
        </p>
      </section>

      <Notice title="Phân quyền tối thiểu theo công việc">
        Quản lý thực hiện tạo tài khoản, gán vai trò và khóa/mở khóa truy cập
        trực tiếp trên hệ thống.
      </Notice>

      {dialog?.type === "create" && (
        <CreateAccountDialog onClose={close} onDone={done} />
      )}
      {dialog?.type === "edit" && (
        <EditAccountDialog
          account={dialog.account}
          onClose={close}
          onDone={done}
        />
      )}
      {dialog?.type === "lock" && (
        <LockDialog
          account={dialog.account}
          unlock={dialog.unlock}
          onClose={close}
          onDone={done}
        />
      )}
      {dialog?.type === "result" && (
        <ResultDialog message={dialog.message} onClose={close} />
      )}
    </>
  );
}
