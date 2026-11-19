"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CreateAccountDialog,
  LockDialog,
  ResultDialog,
  RoleRequestDialog,
} from "@/components/admin/account-dialogs";
import { PageHeading } from "@/components/admin/page-heading";
import { StatusBadge } from "@/components/ui/badge";
import { Button, buttonClasses } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { setAccountStatus, useAccounts } from "@/mocks/db";
import { formatPhone } from "@/mocks/format";
import { useMockSession } from "@/mocks/session";
import { ROLE_LABEL, type Account } from "@/mocks/types";

type Dialog =
  | { type: "create" }
  | { type: "lock"; account: Account; unlock: boolean }
  | { type: "role"; account: Account }
  | { type: "result"; message?: string }
  | null;

export default function AccountsPage() {
  const accounts = useAccounts();
  const { account: me } = useMockSession();
  const [dialog, setDialog] = useState<Dialog>(null);
  const close = () => setDialog(null);
  const done = (message: string) => setDialog({ type: "result", message });

  const count = (s: Account["status"]) => accounts.filter((a) => a.status === s).length;
  const stats = [
    ["Tổng tài khoản", accounts.length],
    ["Đang hoạt động", count("HOAT_DONG")],
    ["Chờ kích hoạt", count("CHO_KICH_HOAT")],
    ["Bị khóa", count("BI_KHOA")],
  ] as const;

  return (
    <>
      <PageHeading
        title="Tài khoản"
        subtitle="Tạo và quản lý quyền truy cập theo vai trò, không thay đổi quyền nghiệp vụ khi chưa được duyệt."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="flex min-h-[104px] flex-col gap-1.5 rounded-[10px] border border-line bg-white p-5">
            <p className="text-xs leading-[18px] text-text-muted">{label}</p>
            <p className="text-2xl leading-10 text-ink">{value}</p>
          </div>
        ))}
      </div>

      <section className="flex flex-col gap-4 rounded-[10px] border border-line bg-white p-5">
        <div className="flex items-center gap-4">
          <h2 className="flex-1 text-xl font-semibold leading-7 text-ink">Danh sách tài khoản</h2>
          <Button onClick={() => setDialog({ type: "create" })}>Tạo tài khoản</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="text-sm font-semibold leading-5 text-text-muted">
                <th scope="col" className="w-[250px] py-2.5 pr-3">Người dùng</th>
                <th scope="col" className="w-[160px] py-2.5 pr-3">Vai trò</th>
                <th scope="col" className="w-[190px] py-2.5 pr-3">Số điện thoại</th>
                <th scope="col" className="w-[150px] py-2.5 pr-3">Trạng thái</th>
                <th scope="col" className="py-2.5">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => {
                const isMe = a.id === me?.id;
                return (
                  <tr key={a.id} className="border-b border-line align-middle">
                    <td className="py-3 pr-3">
                      <p className="text-sm font-semibold leading-5 text-ink">{a.fullName}</p>
                      <p className="mt-[3px] text-xs leading-[18px] text-text-muted">
                        {a.code}
                        {isMe && " · Đang đăng nhập"}
                      </p>
                    </td>
                    <td className="py-3 pr-3 text-sm leading-[22px] text-body">{ROLE_LABEL[a.role]}</td>
                    <td className="py-3 pr-3 text-sm leading-[22px] text-body">{formatPhone(a.phone)}</td>
                    <td className="py-3 pr-3"><StatusBadge status={a.status} /></td>
                    <td className="py-3">
                      {isMe ? (
                        <span className="text-xs leading-[18px] text-text-muted">Tài khoản của bạn</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {a.status === "BI_KHOA" ? (
                            <Button variant="secondary" onClick={() => setDialog({ type: "lock", account: a, unlock: true })}>
                              Mở khóa
                            </Button>
                          ) : (
                            <>
                              {a.role === "GIA_SU" ? (
                                <Button variant="secondary" onClick={() => setDialog({ type: "role", account: a })}>
                                  Gán vai trò
                                </Button>
                              ) : (
                                <Link href="/admin/settings#ma-tran" className={buttonClasses("secondary")}>
                                  Xem quyền
                                </Link>
                              )}
                              {a.status === "CHO_KICH_HOAT" && (
                                <Button
                                  variant="secondary"
                                  onClick={() => {
                                    setAccountStatus(a.id, "HOAT_DONG");
                                    done(`${a.code} · ${a.fullName}: đã kích hoạt.`);
                                  }}
                                >
                                  Kích hoạt
                                </Button>
                              )}
                              <Button variant="secondary" onClick={() => setDialog({ type: "lock", account: a, unlock: false })}>
                                Khóa
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-xs leading-[18px] text-text-muted">
          Không khóa tài khoản đang sử dụng. Khóa truy cập không tự dừng các lớp đang vận hành.
        </p>
      </section>

      <Notice title="Phân quyền tối thiểu theo công việc">
        Quản trị viên quản lý truy cập; không tự cấp quyền Chủ trung tâm, không thay đổi khung giá hoặc tham số kinh doanh.
      </Notice>

      {dialog?.type === "create" && <CreateAccountDialog onClose={close} onDone={done} />}
      {dialog?.type === "lock" && (
        <LockDialog account={dialog.account} unlock={dialog.unlock} onClose={close} onDone={done} />
      )}
      {dialog?.type === "role" && <RoleRequestDialog account={dialog.account} onClose={close} onDone={done} />}
      {dialog?.type === "result" && <ResultDialog message={dialog.message} onClose={close} />}
    </>
  );
}
