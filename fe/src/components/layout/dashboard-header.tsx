"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { useSignOut } from "@/hooks/use-auth-session";
import { ROLE_LABELS, UserRole } from "@/types/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const { role, setRole, user, isAuthenticated } = useAuthStore();
  const { signOut, isPending } = useSignOut();

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shrink-0 sticky top-0 z-40 shadow-xs">
      {/* Left: Quick search / context */}
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-xs bg-secondary/50 font-semibold text-primary">
          {ROLE_LABELS[role]}
        </Badge>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Hệ thống Quản lý Trung tâm Gia sư PeasyEdu (SE100.R12)
        </span>
      </div>

      {/* Right: Role Switcher Tool + User Info */}
      <div className="flex items-center gap-4">
        {/* Quick Role Switcher for Testing */}
        <div className="flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-lg border border-border">
          <span className="text-xs font-medium text-muted-foreground hidden md:inline">
            Đổi vai trò test:
          </span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
          >
            {Object.entries(ROLE_LABELS).map(([key, label]) => (
              <option key={key} value={key} className="bg-card text-foreground">
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Public home link */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
            Về trang chủ
          </Button>
        </Link>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shadow-xs">
            {user?.name ? user.name.charAt(0) : "U"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-foreground leading-tight">{user?.name || "Người dùng"}</p>
            <p className="text-[11px] text-muted-foreground">{ROLE_LABELS[role]}</p>
          </div>
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={signOut}
              className="text-xs text-muted-foreground"
            >
              {isPending ? "Đang xuất…" : "Đăng xuất"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
