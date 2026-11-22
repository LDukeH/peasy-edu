"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { initMocks } from "@/mocks/init";
import { useAuthStore } from "@/stores/auth-store";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/dich-vu-hoc-phi",
  "/ung-tuyen-gia-su",
  "/yeu-cau-tim-gia-su",
  "/welcome",
];

export function AppProviders({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );

  useEffect(() => {
    initMocks();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      queryClient.clear();
      useAuthStore.getState().logout();
      const isPublic = PUBLIC_ROUTES.some((route) =>
        route === "/" ? pathname === "/" : pathname.startsWith(route),
      );
      if (!isPublic) {
        router.replace("/login");
      }
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [pathname, queryClient, router]);

  // Hướng A: Không return null ở root AppProviders (tránh lỗi dropped segment khi bật partialPrefetching / cacheComponents)
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
