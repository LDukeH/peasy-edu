export const isMockingEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_API_MOCKING === "true";

// Deduplicate worker.start() ở module-level để React 19 Strict Mode không khởi động 2 lần
let workerStartPromise: Promise<unknown> | null = null;

export function initMocks(): Promise<unknown> {
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
