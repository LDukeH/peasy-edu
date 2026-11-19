"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const isMockingEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_API_MOCKING === "true";

// Deduplicate worker.start() ở module-level để React 19 Strict Mode không khởi động 2 lần
let workerStartPromise: Promise<unknown> | null = null;

function initMocks(): Promise<unknown> {
  // SSR guard: Không khởi động MSW trên server
  if (typeof window === "undefined" || !isMockingEnabled) {
    return Promise.resolve();
  }

  if (!workerStartPromise) {
    workerStartPromise = import("@/mocks/browser")
      .then(({ worker }) =>
        worker.start({
          // Trong MSW 3.x (^3.0.6), option chính thức là onUnhandledFrame.
          // Giữ cả onUnhandledRequest để tương thích.
          onUnhandledFrame: "bypass",
          ...({ onUnhandledRequest: "bypass" } as Record<string, unknown>),
        }),
      )
      .catch((err) => {
        console.error("[MSW] Failed to initialize mock service worker:", err);
      });
  }

  return workerStartPromise ?? Promise.resolve();
}

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
      if (!pathname.startsWith("/login")) {
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
