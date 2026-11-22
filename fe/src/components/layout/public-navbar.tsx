"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoPeasyEdu } from "@/components/common/logo";
import { useAuthSession, useSignOut } from "@/hooks/use-auth-session";
import { homeForRole } from "@/lib/auth-labels";
import { cn } from "@/lib/utils";

export function PublicNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, isLoading } = useAuthSession();
  const { signOut, isPending: signingOut } = useSignOut();

  // Khớp chính xác danh sách links trên header Figma (node 2236:7205)
  const navLinks = [
    { label: "Dịch vụ & học phí", href: "/dich-vu-hoc-phi" },
    { label: "Đội ngũ gia sư", href: "/#doi-ngu-gia-su" },
    { label: "Trở thành gia sư", href: "/ung-tuyen-gia-su" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#dce4eb] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand - Đồng bộ chính xác Figma Logo */}
        <Link href="/" className="hover:opacity-95 transition-opacity">
          <LogoPeasyEdu size="md" />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#52677d]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-[#116f7c]",
                  isActive ? "font-semibold text-[#116f7c]" : "text-[#52677d]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Account actions: Đăng nhập / Tài khoản & Tìm gia sư */}
        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            <div
              aria-hidden="true"
              className="h-10 w-28 animate-pulse rounded-lg bg-slate-100"
            />
          ) : user ? (
            <>
              <Link href={homeForRole(user.vaiTro)}>
                <Button
                  variant="outline"
                  className="h-10 px-4 font-semibold text-[#33465c] border-[#dce4eb] hover:bg-slate-50 rounded-lg"
                >
                  {user.hoTen}
                </Button>
              </Link>
              <Button
                variant="ghost"
                disabled={signingOut}
                onClick={signOut}
                className="h-10 px-3 text-sm font-medium text-[#52677d] hover:text-[#116f7c]"
              >
                {signingOut ? "Đang xuất…" : "Đăng xuất"}
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                className="h-10 px-4 font-semibold text-[#33465c] border-[#dce4eb] hover:bg-slate-50 rounded-lg"
              >
                Đăng nhập
              </Button>
            </Link>
          )}
          <Link href="/yeu-cau-tim-gia-su">
            <Button
              className="h-10 px-4 font-semibold text-white bg-[#116f7c] hover:bg-[#0e5c66] rounded-lg shadow-xs"
            >
              Tìm gia sư
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-foreground focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Nav dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#dce4eb] bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block py-2 text-sm font-medium",
                pathname === link.href ? "text-[#116f7c] font-bold" : "text-[#52677d]",
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#dce4eb] flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href={homeForRole(user.vaiTro)}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full border-[#dce4eb] text-[#33465c]">
                    {user.hoTen}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  disabled={signingOut}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    void signOut();
                  }}
                  className="w-full text-[#52677d]"
                >
                  {signingOut ? "Đang xuất…" : "Đăng xuất"}
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-[#dce4eb] text-[#33465c]">
                  Đăng nhập
                </Button>
              </Link>
            )}
            <Link href="/yeu-cau-tim-gia-su" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-[#116f7c] hover:bg-[#0e5c66] text-white">
                Tìm gia sư
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
