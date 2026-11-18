"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  CalendarCheck,
  Search,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const [selectedSubject, setSelectedSubject] = useState("Toán");
  const [selectedGrade, setSelectedGrade] = useState("Lớp 10");
  const [selectedMode, setSelectedMode] = useState("Tất cả hình thức");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#10213a]/5 via-background to-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-5">
              <Badge variant="accent" className="px-3.5 py-1 text-xs gap-1.5 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Mô hình môi giới gia sư có quản lý chuẩn SE100.R12</span>
              </Badge>

              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl sm:leading-tight">
                Tìm gia sư giỏi, minh bạch học phí{" "}
                <span className="text-primary block sm:inline">theo từng buổi học</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Trung tâm gia sư một cơ sở theo dõi chất lượng từng buổi dạy.
                Cam kết hồ sơ gia sư đã xác minh, <strong>học thử 1 buổi miễn phí</strong> nếu không đạt,
                thanh toán trả sau và không thu cọc.
              </p>

              {/* QUICK SEARCH BOX */}
              <div className="mt-8 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-lg max-w-4xl mx-auto text-left">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 items-end">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Môn học</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Toán">Toán học</option>
                      <option value="Ngữ văn">Ngữ văn</option>
                      <option value="Tiếng Anh">Tiếng Anh (IELTS/Giao tiếp)</option>
                      <option value="Vật lý">Vật lý</option>
                      <option value="Hóa học">Hóa học</option>
                      <option value="Piano / Vẽ">Năng khiếu (Piano/Vẽ)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Cấp học</label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Tiểu học">Tiểu học (Năng khiếu & Kỹ năng)</option>
                      <option value="THCS (Lớp 6–9)">THCS (Lớp 6–9)</option>
                      <option value="Lớp 10">Lớp 10 (Vào 10 / Chuyên)</option>
                      <option value="THPT (Lớp 11–12)">THPT (Ôn thi tốt nghiệp & ĐGNL)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Hình thức dạy</label>
                    <select
                      value={selectedMode}
                      onChange={(e) => setSelectedMode(e.target.value)}
                      className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Tất cả hình thức">Tất cả hình thức</option>
                      <option value="Tại nhà học viên">Tại nhà (TP.HCM)</option>
                      <option value="Trực tuyến">Trực tuyến (Meet / Zoom)</option>
                    </select>
                  </div>

                  <Link href="/dich-vu-hoc-phi#bang-gia" className="w-full">
                    <Button variant="default" className="w-full h-10 gap-2 font-semibold">
                      <Search className="h-4 w-4" />
                      <span>Xem khung giá</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST & STATS STRIP */}
        <section className="border-y border-border bg-card/50 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
              <div>
                <p className="text-3xl font-extrabold text-primary sm:text-4xl">150+</p>
                <p className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground">
                  Gia sư đã xác minh hồ sơ
                </p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-foreground sm:text-4xl">200+</p>
                <p className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground">
                  Lớp học hoạt động thường xuyên
                </p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-primary sm:text-4xl">2.000+</p>
                <p className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground">
                  Buổi học đối soát mỗi tháng
                </p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#116f7c] sm:text-4xl">100%</p>
                <p className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground">
                  Miễn phí buổi học thử không đạt
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CORE SERVICES */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Dịch vụ gia sư đáp ứng mọi mục tiêu học tập
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Cung cấp hình thức linh hoạt, phù hợp với thời gian biểu và ngân sách của từng gia đình
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Card 1 */}
              <Card className="hover:shadow-md transition-shadow border-border">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <CardTitle>Gia sư 1 kèm 1 tại nhà</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Gia sư đến tận nhà học viên tại các khu vực TP. Hồ Chí Minh. Lộ trình cá nhân hóa theo học lực và mục tiêu cụ thể.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      <span>Thời lượng 90–120 phút/buổi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      <span>Điểm danh & nhận xét từng buổi học</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="hover:shadow-md transition-shadow border-border">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-secondary text-primary-deep flex items-center justify-center mb-2">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle>Học nhóm nhỏ (2–4 bạn)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Dành cho anh chị em trong nhà hoặc bạn bè cùng lớp học chung địa điểm. Giúp tăng tương tác học tập và tiết kiệm học phí mỗi bạn.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      <span>Học phí/buổi ưu đãi theo số học viên</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      <span>Điểm danh riêng biệt từng học viên</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="hover:shadow-md transition-shadow border-border">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-accent/20 text-primary flex items-center justify-center mb-2">
                    <CalendarCheck className="h-6 w-6" />
                  </div>
                  <CardTitle>Gia sư trực tuyến</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Học qua Google Meet / Zoom không giới hạn địa lý. Phù hợp cho ôn thi chuyên đề, học ngoại ngữ, hoặc học sinh ở xa.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      <span>Mức học phí linh hoạt, tiết kiệm</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      <span>Chia sẻ bài giảng và tài liệu học trực tiếp</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 4-STEP PROCESS (Hình 1 Báo cáo SE100) */}
        <section className="bg-muted/40 py-16 sm:py-20 border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="secondary" className="mb-2">Quy trình chuẩn</Badge>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                4 bước đơn giản từ đăng ký đến lớp học chính thức
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Quy trình minh bạch đảm bảo gia sư phù hợp và quyền lợi học thử của học viên
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-card p-5 relative">
                <span className="text-3xl font-black text-primary/20">01</span>
                <h3 className="text-base font-bold text-foreground mt-2 mb-1.5">Gửi yêu cầu học</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Phụ huynh gửi thông tin môn học, lớp, thời gian và mục tiêu. NV tư vấn liên hệ trong 24 giờ.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 relative">
                <span className="text-3xl font-black text-primary/20">02</span>
                <h3 className="text-base font-bold text-foreground mt-2 mb-1.5">Đề xuất ≤ 3 gia sư</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Hệ thống chấm điểm ghép theo môn, khu vực, lịch rảnh. Gửi 3 hồ sơ để gia đình chọn lựa.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 relative border-primary/40 shadow-xs">
                <span className="text-3xl font-black text-primary/40">03</span>
                <h3 className="text-base font-bold text-foreground mt-2 mb-1.5">Học thử 1 buổi</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Đánh giá phương pháp và tương tác. Nếu không đạt: <strong>miễn phí 100%</strong> và đổi gia sư khác.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 relative">
                <span className="text-3xl font-black text-primary/20">04</span>
                <h3 className="text-base font-bold text-foreground mt-2 mb-1.5">Mở lớp & Trả sau</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Lập lịch cố định, sinh buổi học. Phụ huynh thanh toán học phí vào ngày 10 hằng tháng theo số buổi học thực tế.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="bg-primary py-12 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold">
                Bạn cần tìm gia sư cho con hoặc muốn đăng ký làm gia sư?
              </h3>
              <p className="text-sm text-white/80">
                Đội ngũ điều phối viên của Peasy Edu luôn sẵn sàng hỗ trợ tư vấn miễn phí.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/dich-vu-hoc-phi">
                <Button variant="secondary" size="lg" className="font-bold">
                  Bảng giá & Dịch vụ
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
