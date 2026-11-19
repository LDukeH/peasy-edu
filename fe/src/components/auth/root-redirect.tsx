"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { homeFor, useMockSession } from "@/mocks/session";

export function RootRedirect() {
  const router = useRouter();
  const { ready, account } = useMockSession();

  useEffect(() => {
    if (!ready) return;
    router.replace(account ? homeFor(account.role) : "/login");
  }, [ready, account, router]);

  return null;
}
