"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const isMockingEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_API_MOCKING === "true";

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
  const [isReady, setIsReady] = useState(!isMockingEnabled);

  useEffect(() => {
    if (!isMockingEnabled) return;

    import("@/mocks/browser")
      .then(({ worker }) =>
        worker.start({
          onUnhandledFrame: "bypass",
        }),
      )
      .then(() => setIsReady(true));
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

  if (!isReady) {
    return null; // Chờ MSW worker khởi động xong mới gửi request đầu tiên
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
