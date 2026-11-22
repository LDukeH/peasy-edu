"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthSession } from "@/hooks/use-auth-session";
import { homeForRole } from "@/lib/auth-labels";

export function RootRedirect() {
  const router = useRouter();
  const { ready, user } = useAuthSession();

  useEffect(() => {
    if (!ready) return;
    router.replace(user ? homeForRole(user.vaiTro) : "/login");
  }, [ready, user, router]);

  return null;
}
