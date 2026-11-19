"use client";

import React, { useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/common/data-table";
import { formatVND, formatDateVN } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { ROLE_LABELS } from "@/types/auth";

interface RequestItem {
  id: string;
  maYeuCau: string;
  phuHuynh: string;
  hocVien: string;
  monHoc: string;
  capLop: string;
  nganSachBuoi: number;
  hinhThuc: "Tại nhà" | "Online";
  ngayTao: string;
  trangThai: "MOI" | "DA_TU_VAN" | "DANG_TIM_GS" | "DA_DE_XUAT";
}

const MOCK_REQUESTS: RequestItem[] = [
  {
    id: "1",
    maYeuCau: "YC2610-001",
    phuHuynh: "Trần Thị Mai (PH0001)",
    hocVien: "Nguyễn Minh Khang (Lớp 10)",
    monHoc: "Toán học (Nâng cao)",
    capLop: "Lớp 10",
    nganSachBuoi: 200000,
    hinhThuc: "Tại nhà",
    ngayTao: "2026-11-15T08:30:00Z",
    trangThai: "MOI",
  },
  {
    id: "2",
    maYeuCau: "YC2610-002",
    phuHuynh: "Lê Văn Hùng (PH0002)",
    hocVien: "Lê Bảo Trâm (Lớp 8)",
    monHoc: "Tiếng Anh (IELTS 5.5)",
    capLop: "Lớp 8",
    nganSachBuoi: 180000,
    hinhThuc: "Tại nhà",
    ngayTao: "2026-11-14T10:15:00Z",
    trangThai: "DA_TU_VAN",
  },
  {
    id: "3",
    maYeuCau: "YC2610-003",
    phuHuynh: "Phạm Thu Hương (PH0003)",
    hocVien: "Phạm Tuấn Anh (Lớp 12)",
    monHoc: "Vật lý (Luyện thi ĐGNL)",
    capLop: "Lớp 12",
    nganSachBuoi: 220000,
    hinhThuc: "Online",
    ngayTao: "2026-11-13T14:00:00Z",
    trangThai: "DANG_TIM_GS",
  },
  {
    id: "4",
    maYeuCau: "YC2610-004",
    phuHuynh: "Hoàng Đức Nam (PH0004)",
    hocVien: "Hoàng Gia Huy (Lớp 4)",
    monHoc: "Piano cơ bản (Năng khiếu)",
    capLop: "Lớp 4",
    nganSachBuoi: 250000,
    hinhThuc: "Tại nhà",
    ngayTao: "2026-11-12T09:20:00Z",
    trangThai: "DA_DE_XUAT",
  },
];

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "accent" }> = {
  MOI: { label: "Mới tạo", variant: "warning" },
  DA_TU_VAN: { label: "Đã tư vấn", variant: "secondary" },
  DANG_TIM_GS: { label: "Đang tìm GS", variant: "default" },
  DA_DE_XUAT: { label: "Đã đề xuất", variant: "success" },
};

export default function DieuPhoiOverviewPage() {
  const { role } = useAuthStore();
  const [viewState, setViewState] = useState<"data" | "loading" | "empty">("data");

  const columns: ColumnDef<RequestItem>[] = [
    {
      header: "Mã YC",
      accessorKey: "maYeuCau",
      className: "font-mono font-bold text-xs text-primary",
    },
    {
      header: "Phụ huynh & Học viên",
      cell: (row) => (
        <div>
          <p className="font-semibold text-foreground text-xs">{row.phuHuynh}</p>
          <p className="text-[11px] text-muted-foreground">{row.hocVien}</p>
        </div>
      ),
    },
    {
      header: "Môn & Hình thức",
      cell: (row) => (
        <div>
          <span className="font-medium text-xs text-foreground">{row.monHoc}</span>
          <span className="text-[11px] text-muted-foreground"> ({row.hinhThuc})</span>
        </div>
      ),
    },
    {
      header: "Ngân sách / buổi",
      headerClassName: "text-right",
      className: "text-right",
      cell: (row) => (
        <span className="font-semibold text-xs text-foreground">
          {formatVND(row.nganSachBuoi)}
        </span>
      ),
    },
    {
      header: "Ngày gửi",
      cell: (row) => (
        <span className="text-xs text-muted-foreground">{formatDateVN(row.ngayTao)}</span>
      ),
    },
    {
      header: "Trạng thái",
      cell: (row) => {
        const config = STATUS_MAP[row.trangThai] || { label: row.trangThai, variant: "secondary" };
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      header: "Thao tác",
      className: "text-right",
      cell: () => (
        <Button variant="outline" size="sm" className="h-7 text-xs">
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Tổng quan Phân hệ Điều phối
            </h1>
            <Badge variant="accent">{ROLE_LABELS[role]}</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Theo dõi tiếp nhận yêu cầu tìm gia sư, tiến độ ghép lớp và lịch học tuần.
          </p>
        </div>

        {/* State Toggle for QA & Learning */}
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border">
          <span className="text-xs font-medium text-muted-foreground px-2">Xem trạng thái:</span>
          <Button
            size="sm"
            variant={viewState === "data" ? "default" : "ghost"}
            className="h-7 text-xs"
            onClick={() => setViewState("data")}
          >
            Có dữ liệu
          </Button>
          <Button
            size="sm"
            variant={viewState === "loading" ? "default" : "ghost"}
            className="h-7 text-xs"
            onClick={() => setViewState("loading")}
          >
            Skeleton Loading
          </Button>
          <Button
            size="sm"
            variant={viewState === "empty" ? "default" : "ghost"}
            className="h-7 text-xs"
            onClick={() => setViewState("empty")}
          >
            Empty State
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Yêu cầu mới tiếp nhận
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">12</div>
            <p className="text-[11px] text-muted-foreground mt-1">Cần tư vấn trong vòng 24h</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Đang ghép gia sư
            </CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">18</div>
            <p className="text-[11px] text-muted-foreground mt-1">Tối đa 3 đề xuất / yêu cầu</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Lớp đang hoạt động
            </CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-emerald-600">200</div>
            <p className="text-[11px] text-muted-foreground mt-1">Gia sư phụ trách không trùng lịch</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Hồ sơ gia sư chờ duyệt
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-amber-600">7</div>
            <p className="text-[11px] text-muted-foreground mt-1">Cần đối chiếu CCCD và bằng cấp</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table using reusable DataTable */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">
            Danh sách yêu cầu tìm gia sư gần đây
          </h2>
          <Button variant="default" size="sm" className="h-8 text-xs">
            + Tiếp nhận yêu cầu mới
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={viewState === "empty" ? [] : MOCK_REQUESTS}
          isLoading={viewState === "loading"}
          emptyTitle="Chưa có yêu cầu tìm gia sư nào"
          emptyDescription="Khi phụ huynh gửi form trên website hoặc nhân viên tiếp nhận qua điện thoại/Zalo, danh sách sẽ hiển thị tại đây."
          emptyAction={{
            label: "Tạo yêu cầu mới",
            onClick: () => alert("Mở modal tiếp nhận yêu cầu tìm gia sư"),
          }}
          pageSize={5}
        />
      </div>
    </div>
  );
}
