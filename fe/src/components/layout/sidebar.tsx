"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  CheckSquare,
  Receipt,
  Calculator,
  CreditCard,
  Coins,
  BarChart3,
  Sliders,
  ShieldCheck,
  UserCog,
  History,
  Home,
  FileText,
  MessageSquare,
  Sparkles,
  Award,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { ROLE_LABELS, UserRole } from "@/types/auth";
import { LogoPeasyEdu } from "@/components/common/logo";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Khách vãng lai & Công khai",
    items: [
      {
        title: "Trang chủ",
        href: "/",
        icon: Home,
        roles: ["KHACH", "CHU_TRUNG_TAM", "DIEU_PHOI"],
      },
      {
        title: "Dịch vụ & Học phí",
        href: "/dich-vu-hoc-phi",
        icon: BookOpen,
        roles: ["KHACH", "CHU_TRUNG_TAM", "DIEU_PHOI"],
      },
    ],
  },
  {
    title: "Điều phối · Tiếp nhận & Mở lớp",
    items: [
      {
        title: "Tổng quan điều phối",
        href: "/dieu-phoi",
        icon: Sparkles,
        roles: ["CHU_TRUNG_TAM", "DIEU_PHOI"],
      },
      {
        title: "Hồ sơ ứng tuyển Gia sư",
        href: "/dieu-phoi/gia-su",
        icon: GraduationCap,
        roles: ["CHU_TRUNG_TAM", "DIEU_PHOI"],
      },
      {
        title: "Hồ sơ Phụ huynh & HV",
        href: "/dieu-phoi/hoc-vien",
        icon: Users,
        roles: ["CHU_TRUNG_TAM", "DIEU_PHOI"],
      },
      {
        title: "Yêu cầu & Ghép gia sư",
        href: "/dieu-phoi/yeu-cau",
        icon: FileText,
        roles: ["CHU_TRUNG_TAM", "DIEU_PHOI"],
      },
    ],
  },
  {
    title: "Điều phối · Lớp & Buổi học",
    items: [
      {
        title: "Danh sách Lớp học",
        href: "/dieu-phoi/lop-hoc",
        icon: BookOpen,
        roles: ["CHU_TRUNG_TAM", "DIEU_PHOI"],
      },
      {
        title: "Lịch tuần điều phối",
        href: "/dieu-phoi/lich-tuan",
        icon: Calendar,
        roles: ["CHU_TRUNG_TAM", "DIEU_PHOI"],
      },
      {
        title: "Điểm danh & Báo cáo buổi",
        href: "/dieu-phoi/buoi-hoc",
        icon: CheckSquare,
        roles: ["CHU_TRUNG_TAM", "DIEU_PHOI"],
      },
    ],
  },
  {
    title: "Tài chính & Kế toán",
    items: [
      {
        title: "Phiếu học phí",
        href: "/tai-chinh/hoc-phi",
        icon: Receipt,
        roles: ["CHU_TRUNG_TAM", "KE_TOAN"],
      },
      {
        title: "Tính học phí tháng",
        href: "/tai-chinh/tinh-phi",
        icon: Calculator,
        roles: ["CHU_TRUNG_TAM", "KE_TOAN"],
      },
      {
        title: "Công nợ phụ huynh",
        href: "/tai-chinh/cong-no",
        icon: CreditCard,
        roles: ["CHU_TRUNG_TAM", "KE_TOAN"],
      },
      {
        title: "Bảng thù lao Gia sư",
        href: "/tai-chinh/thu-lao",
        icon: Coins,
        roles: ["CHU_TRUNG_TAM", "KE_TOAN"],
      },
    ],
  },
  {
    title: "Cổng Gia sư",
    items: [
      {
        title: "Tổng quan Gia sư",
        href: "/gia-su",
        icon: GraduationCap,
        roles: ["GIA_SU"],
      },
      {
        title: "Lời mời nhận lớp",
        href: "/gia-su/loi-moi",
        icon: FileText,
        roles: ["GIA_SU"],
      },
      {
        title: "Lịch dạy & Điểm danh",
        href: "/gia-su/lich-day",
        icon: Clock,
        roles: ["GIA_SU"],
      },
      {
        title: "Bảng kê thù lao",
        href: "/gia-su/thu-lao",
        icon: Coins,
        roles: ["GIA_SU"],
      },
    ],
  },
  {
    title: "Gia đình & Học sinh",
    items: [
      {
        title: "Tổng quan gia đình",
        href: "/phu-huynh",
        icon: Home,
        roles: ["PHU_HUYNH"],
      },
      {
        title: "Tạo yêu cầu tìm gia sư",
        href: "/phu-huynh/tao-yeu-cau",
        icon: FileText,
        roles: ["PHU_HUYNH"],
      },
      {
        title: "Tiến độ lớp & Phiếu phí",
        href: "/phu-huynh/hoc-phi",
        icon: Receipt,
        roles: ["PHU_HUYNH"],
      },
      {
        title: "Góc học tập",
        href: "/hoc-vien",
        icon: Award,
        roles: ["HOC_VIEN"],
      },
      {
        title: "Đánh giá & Khiếu nại",
        href: "/phu-huynh/danh-gia",
        icon: MessageSquare,
        roles: ["PHU_HUYNH", "HOC_VIEN"],
      },
    ],
  },
  {
    title: "Quản trị & Đảm bảo chất lượng",
    items: [
      {
        title: "Báo cáo Trung tâm",
        href: "/quan-tri/bao-cao",
        icon: BarChart3,
        roles: ["CHU_TRUNG_TAM"],
      },
      {
        title: "Khung giá học phí",
        href: "/quan-tri/khung-gia",
        icon: Sliders,
        roles: ["CHU_TRUNG_TAM", "QUAN_TRI_VIEN"],
      },
      {
        title: "Phê duyệt ngoại lệ",
        href: "/quan-tri/ngoai-le",
        icon: ShieldCheck,
        roles: ["CHU_TRUNG_TAM"],
      },
      {
        title: "Tài khoản & Phân quyền",
        href: "/quan-tri/tai-khoan",
        icon: UserCog,
        roles: ["QUAN_TRI_VIEN", "CHU_TRUNG_TAM"],
      },
      {
        title: "Nhật ký kiểm toán (Audit)",
        href: "/quan-tri/nhat-ky",
        icon: History,
        roles: ["CHU_TRUNG_TAM", "QUAN_TRI_VIEN"],
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role, setRole } = useAuthStore();

  // Lọc các mục menu phù hợp với vai trò hiện tại
  const visibleSections = useMemo(() => {
    return NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    })).filter((section) => section.items.length > 0);
  }, [role]);

  return (
    <aside className="w-64 bg-[#10213a] text-white flex flex-col h-screen border-r border-white/10 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="hover:opacity-95 transition-opacity">
          <LogoPeasyEdu variant="dark" size="sm" />
        </Link>
      </div>

      {/* Role Switcher Toolbar (Dev/Testing Tool) */}
      <div className="px-4 py-3 bg-black/25 border-b border-white/10">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-[#7b95ae] block mb-1">
          Đang xem với vai trò:
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full bg-[#162e4e] text-white text-xs rounded-md border border-white/20 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#77c5cf] cursor-pointer"
        >
          {Object.entries(ROLE_LABELS).map(([key, label]) => (
            <option key={key} value={key} className="bg-[#10213a] text-white">
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {visibleSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#7b95ae]">
              {section.title}
            </h3>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                      isActive
                        ? "bg-[#116f7c] text-white font-semibold shadow-sm"
                        : "text-[#c5d4e2] hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive
                            ? "text-white"
                            : "text-[#7b95ae] group-hover:text-[#77c5cf]",
                        )}
                      />
                      <span className="truncate">{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/15 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Profile */}
      <div className="p-3 border-t border-white/10 bg-black/15">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="h-8 w-8 rounded-full bg-[#116f7c]/80 flex items-center justify-center font-bold text-xs text-white shrink-0">
            {ROLE_LABELS[role]?.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {ROLE_LABELS[role]}
            </p>
            <p className="text-[10px] text-[#7b95ae] truncate">
              Quyền theo Bảng 9
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
