"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Dịch vụ & Học phí", href: "/dich-vu-hoc-phi" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              Peasy<span className="text-primary">Edu</span>
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Trung tâm Gia sư ABC
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  isActive
                    ? "font-semibold text-primary border-b-2 border-primary py-1"
                    : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Đăng nhập
            </Button>
          </Link>
          <Link href="/dich-vu-hoc-phi#bang-gia">
            <Button variant="default" size="sm" className="gap-1.5 shadow-sm">
              <span>Xem bảng giá</span>
              <ArrowRight className="h-4 w-4" />
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
        <div className="md:hidden border-b border-border bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block py-2 text-sm font-medium",
                pathname === link.href ? "text-primary font-bold" : "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/dich-vu-hoc-phi#bang-gia" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="default" className="w-full">
                Xem bảng giá
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
