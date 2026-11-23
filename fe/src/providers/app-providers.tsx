"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { getAuthMeQueryKey } from "@/api/generated/peasyApi";
import { initMocks } from "@/mocks/init";
import {
  subscribeCrossTabAuthChange,
  writeCachedUser,
} from "@/lib/auth-cache";
import { useAuthStore } from "@/stores/auth-store";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/dich-vu-hoc-phi",
  "/ung-tuyen-gia-su",
  "/yeu-cau-tim-gia-su",
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
    const clearClientSession = () => {
      // Không dùng queryClient.clear() vì sẽ reset query /api/auth/me đang active về trạng thái pending (treo trang)
      queryClient.removeQueries({
        predicate: (q) => q.queryKey[0] !== "/api/auth/me",
      });
      queryClient.setQueryData(getAuthMeQueryKey(), null);
      useAuthStore.getState().logout();
      const isPublic = PUBLIC_ROUTES.some((route) =>
        route === "/" ? pathname === "/" : pathname.startsWith(route),
      );
      if (!isPublic) {
        router.replace("/login");
      }
    };

    const handleUnauthorized = () => {
      writeCachedUser(null);
      clearClientSession();
    };

    const unsubscribeCrossTab = subscribeCrossTabAuthChange((kind) => {
      if (kind === "logout") {
        clearClientSession();
      } else {
        void queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() });
      }
    });

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      unsubscribeCrossTab();
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [pathname, queryClient, router]);

  // Hướng A: Không return null ở root AppProviders (tránh lỗi dropped segment khi bật partialPrefetching / cacheComponents)
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
