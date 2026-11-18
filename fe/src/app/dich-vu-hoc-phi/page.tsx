"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertCircle,
  Clock,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { DataTable, ColumnDef } from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatVND } from "@/lib/utils";

interface PriceItem {
  id: string;
  capHoc: string;
  nhomMon: string;
  trinhDoGiaSu: "Sinh viên" | "Giáo viên";
  hinhThuc: "Tại nhà" | "Trực tuyến";
  thoiLuong: string;
  giaToiThieu: number;
  giaToiDa: number;
  ghiChu?: string;
}

const MOCK_PRICE_DATA: PriceItem[] = [
  {
    id: "KG01",
    capHoc: "Tiểu học (Lớp 1–5)",
    nhomMon: "Năng khiếu & Kỹ năng sống",
    trinhDoGiaSu: "Sinh viên",
    hinhThuc: "Tại nhà",
    thoiLuong: "90 phút",
    giaToiThieu: 120000,
    giaToiDa: 150000,
    ghiChu: "Tuân thủ TT 29/2024: chỉ dạy năng khiếu",
  },
  {
    id: "KG02",
    capHoc: "Tiểu học (Lớp 1–5)",
    nhomMon: "Năng khiếu (Piano/Vẽ/Cờ vua)",
    trinhDoGiaSu: "Giáo viên",
    hinhThuc: "Tại nhà",
    thoiLuong: "90 phút",
    giaToiThieu: 180000,
    giaToiDa: 240000,
  },
  {
    id: "KG03",
    capHoc: "THCS (Lớp 6–8)",
    nhomMon: "Toán, Văn, Tiếng Anh, Lý",
    trinhDoGiaSu: "Sinh viên",
    hinhThuc: "Tại nhà",
    thoiLuong: "120 phút",
    giaToiThieu: 130000,
    giaToiDa: 160000,
  },
  {
    id: "KG04",
    capHoc: "THCS (Lớp 6–8)",
    nhomMon: "Toán, Văn, Tiếng Anh, Lý",
    trinhDoGiaSu: "Giáo viên",
    hinhThuc: "Tại nhà",
    thoiLuong: "120 phút",
    giaToiThieu: 190000,
    giaToiDa: 250000,
  },
  {
    id: "KG05",
    capHoc: "Lớp 9 (Luyện thi vào 10)",
    nhomMon: "Toán, Văn, Tiếng Anh Chuyên",
    trinhDoGiaSu: "Sinh viên",
    hinhThuc: "Tại nhà",
    thoiLuong: "120 phút",
    giaToiThieu: 150000,
    giaToiDa: 180000,
    ghiChu: "Sinh viên trường Sư phạm / ĐHQG giỏi",
  },
  {
    id: "KG06",
    capHoc: "Lớp 9 (Luyện thi vào 10)",
    nhomMon: "Toán, Văn, Tiếng Anh Chuyên",
    trinhDoGiaSu: "Giáo viên",
    hinhThuc: "Tại nhà",
    thoiLuong: "120 phút",
    giaToiThieu: 220000,
    giaToiDa: 300000,
    ghiChu: "Giáo viên nhiều năm kinh nghiệm",
  },
  {
    id: "KG07",
    capHoc: "THPT (Lớp 10–12)",
    nhomMon: "Toán, Lý, Hóa, Sinh, Văn",
    trinhDoGiaSu: "Sinh viên",
    hinhThuc: "Tại nhà",
    thoiLuong: "120 phút",
    giaToiThieu: 140000,
    giaToiDa: 170000,
  },
  {
    id: "KG08",
    capHoc: "THPT (Lớp 10–12)",
    nhomMon: "Toán, Lý, Hóa, Sinh, Văn",
    trinhDoGiaSu: "Giáo viên",
    hinhThuc: "Tại nhà",
    thoiLuong: "120 phút",
    giaToiThieu: 200000,
    giaToiDa: 280000,
  },
  {
    id: "KG09",
    capHoc: "Luyện thi ĐGNL & Tốt nghiệp",
    nhomMon: "Tổ hợp KHTN / KHXH",
    trinhDoGiaSu: "Giáo viên",
    hinhThuc: "Trực tuyến",
    thoiLuong: "90 phút",
    giaToiThieu: 180000,
    giaToiDa: 230000,
    ghiChu: "Học qua Google Meet / Zoom",
  },
  {
    id: "KG10",
    capHoc: "Ngoại ngữ & Chứng chỉ",
    nhomMon: "IELTS / TOEIC / Giao tiếp",
    trinhDoGiaSu: "Giáo viên",
    hinhThuc: "Tại nhà",
    thoiLuong: "90 phút",
    giaToiThieu: 250000,
    giaToiDa: 350000,
    ghiChu: "Cam kết đầu ra theo mục tiêu",
  },
];

export default function DichVuHocPhiPage() {
  const [filterCapHoc, setFilterCapHoc] = useState<string>("Tất cả");
  const [filterTrinhDo, setFilterTrinhDo] = useState<string>("Tất cả");

  const filteredData = useMemo(() => {
    return MOCK_PRICE_DATA.filter((item) => {
      const matchCap =
        filterCapHoc === "Tất cả" || item.capHoc.includes(filterCapHoc);
      const matchTrinhDo =
        filterTrinhDo === "Tất cả" || item.trinhDoGiaSu === filterTrinhDo;
      return matchCap && matchTrinhDo;
    });
  }, [filterCapHoc, filterTrinhDo]);

  // Cấu hình các cột cho DataTable dùng chung
  const columns: ColumnDef<PriceItem>[] = [
    {
      header: "Cấp học & Môn",
      cell: (row) => (
        <div>
          <p className="font-semibold text-foreground text-sm">{row.capHoc}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{row.nhomMon}</p>
        </div>
      ),
    },
    {
      header: "Trình độ gia sư",
      cell: (row) => (
        <Badge
          variant={row.trinhDoGiaSu === "Giáo viên" ? "default" : "secondary"}
          className="text-xs"
        >
          {row.trinhDoGiaSu}
        </Badge>
      ),
    },
    {
      header: "Hình thức & Thời lượng",
      cell: (row) => (
        <div className="text-xs text-foreground">
          <span className="font-medium">{row.hinhThuc}</span>
          <span className="text-muted-foreground"> · {row.thoiLuong}</span>
        </div>
      ),
    },
    {
      header: "Khung học phí / buổi",
      headerClassName: "text-right",
      className: "text-right",
      cell: (row) => (
        <div className="text-right">
          <span className="font-bold text-primary text-sm">
            {formatVND(row.giaToiThieu)} – {formatVND(row.giaToiDa)}
          </span>
          {row.ghiChu && (
            <p className="text-[11px] text-muted-foreground mt-0.5">{row.ghiChu}</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1">
        {/* BANNER HEADER */}
        <section className="bg-gradient-to-r from-[#10213a] to-[#116f7c] py-14 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            <Badge variant="accent" className="bg-white/15 text-white border-white/20">
              Công khai theo Thông tư 29/2024/TT-BGDĐT
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Dịch vụ đào tạo & Bảng khung giá học phí
            </h1>
            <p className="max-w-2xl text-sm sm:text-base text-white/80 leading-relaxed">
              Bảng giá niêm yết công khai tham khảo theo từng cấp học, môn học và trình độ gia sư.
              Học phí được tính theo buổi học thực tế diễn ra và thanh toán trả sau định kỳ hằng tháng.
            </p>
          </div>
        </section>

        {/* SECTION: BẢNG KHUNG GIÁ (DÙNG DATATABLE) */}
        <section id="bang-gia" className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Bảng tra cứu khung học phí tham khảo
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Đơn giá cụ thể được thỏa thuận trong khung và ghi nhận cố định vào thỏa thuận dịch vụ
                </p>
              </div>

              {/* BỘ LỌC DỮ LIỆU */}
              <div className="flex items-center gap-3">
                <select
                  value={filterCapHoc}
                  onChange={(e) => setFilterCapHoc(e.target.value)}
                  className="h-9 rounded-lg border border-input bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Tất cả">Tất cả cấp học</option>
                  <option value="Tiểu học">Tiểu học (Năng khiếu)</option>
                  <option value="THCS">THCS (Lớp 6–9)</option>
                  <option value="THPT">THPT (Lớp 10–12)</option>
                  <option value="Luyện thi">Luyện thi tốt nghiệp</option>
                  <option value="Ngoại ngữ">Ngoại ngữ / IELTS</option>
                </select>

                <select
                  value={filterTrinhDo}
                  onChange={(e) => setFilterTrinhDo(e.target.value)}
                  className="h-9 rounded-lg border border-input bg-card px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Tất cả">Mọi trình độ gia sư</option>
                  <option value="Sinh viên">Sinh viên</option>
                  <option value="Giáo viên">Giáo viên / Cử nhân</option>
                </select>
              </div>
            </div>

            {/* BẢNG DATATABLE CHÍNH */}
            <DataTable
              columns={columns}
              data={filteredData}
              emptyTitle="Không tìm thấy khung giá phù hợp"
              emptyDescription="Vui lòng thử điều chỉnh lại bộ lọc cấp học hoặc trình độ gia sư."
              pageSize={10}
            />
          </div>
        </section>

        {/* SECTION: 4 NGUYÊN TẮC HỌC PHÍ MINH BẠCH (MỤC 6.7 SE100) */}
        <section className="bg-muted/40 py-12 sm:py-16 border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                4 chính sách thanh toán bảo vệ quyền lợi gia đình
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                Được chuẩn hóa thành quy tắc trong hợp đồng và tự động tính toán trên hệ thống
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Học thử 1 buổi miễn phí</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  Nếu sau buổi học thử đầu tiên gia đình thấy chưa phù hợp, buổi học sẽ được <strong>miễn phí 100%</strong> và trung tâm sẽ đề xuất gia sư khác.
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Thanh toán trả sau</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Không thu tiền cọc trước</strong>. Ngày 3 hằng tháng trung tâm gửi phiếu học phí tổng hợp số buổi đã học của tháng trước, hạn thanh toán ngày 10.
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="h-10 w-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center mb-2">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Xác nhận buổi học 2 chiều</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  Sau mỗi buổi dạy, gia sư cập nhật nội dung và điểm danh. Phụ huynh có 48 giờ để xác nhận hoặc phản đối trước khi đưa vào phiếu học phí.
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Quy định báo nghỉ rõ ràng</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  Học viên báo nghỉ trước $\ge 12$ giờ: miễn phí 0%. Báo muộn $&lt; 12$ giờ: tính 50% học phí buổi đó để hỗ trợ chi phí đi lại của gia sư.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-12 bg-card border-t border-border text-center">
          <div className="mx-auto max-w-3xl px-4 space-y-4">
            <h3 className="text-xl font-bold text-foreground sm:text-2xl">
              Sẵn sàng tìm một người đồng hành học tập cho con?
            </h3>
            <p className="text-sm text-muted-foreground">
              Hãy để lại nhu cầu học tập, nhân viên tư vấn sẽ phân tích hồ sơ và gửi bạn danh sách gia sư phù hợp nhất.
            </p>
            <div className="pt-2">
              <Link href="/">
                <Button size="lg" className="gap-2 font-bold shadow-md">
                  <span>Trở về trang chủ</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
