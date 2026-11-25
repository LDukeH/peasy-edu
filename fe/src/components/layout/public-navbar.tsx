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

  const navLinks = [
    { label: "Dịch vụ & học phí", href: "/dich-vu-hoc-phi" },
    { label: "Đội ngũ gia sư", href: "/#doi-ngu-gia-su" },
    { label: "Trở thành gia sư", href: "/ung-tuyen-gia-su" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#dce4eb]/70">
      <div className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-[80px]">
        <Link href="/" className="hover:opacity-95 transition-opacity">
          <LogoPeasyEdu size="md" boxed />
        </Link>

        <nav className="hidden md:flex items-center gap-[28px] text-sm font-normal leading-[22px] text-[#52677d]">
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

        <div className="hidden md:flex items-center gap-3">
          {isLoading ? (
            <div
              aria-hidden="true"
              className="h-[44px] w-28 animate-pulse rounded-[8px] bg-[#eaf0f5]"
            />
          ) : user ? (
            <>
              <Link href={homeForRole(user.vaiTro)}>
                <Button variant="secondary">{user.hoTen}</Button>
              </Link>
              <Button
                variant="ghost"
                disabled={signingOut}
                onClick={signOut}
                className="text-sm font-medium text-[#52677d] hover:text-[#116f7c]"
              >
                {signingOut ? "Đang xuất…" : "Đăng xuất"}
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="secondary">Đăng nhập</Button>
            </Link>
          )}
          <Link href="/yeu-cau-tim-gia-su">
            <Button variant="primary">Tìm gia sư</Button>
          </Link>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[#172b4d] focus:outline-none"
          aria-label="Mở menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#dce4eb] bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block py-2 text-sm",
                pathname === link.href
                  ? "text-[#116f7c] font-semibold"
                  : "text-[#52677d] font-normal",
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#dce4eb] flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href={homeForRole(user.vaiTro)}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="secondary" className="w-full">
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
                <Button variant="secondary" className="w-full">
                  Đăng nhập
                </Button>
              </Link>
            )}
            <Link
              href="/yeu-cau-tim-gia-su"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button variant="primary" className="w-full">
                Tìm gia sư
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
