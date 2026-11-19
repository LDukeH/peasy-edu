import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingSkeletonProps {
  variant?: "text" | "card" | "table-row" | "avatar";
  count?: number;
  className?: string;
}

export function LoadingSkeleton({
  variant = "text",
  count = 1,
  className,
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === "card") {
    return (
      <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {items.map((i) => (
          <div
            key={i}
            className="flex flex-col space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm animate-pulse"
          >
            <div className="h-32 w-full rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted/80" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-5 w-20 rounded bg-muted" />
              <div className="h-8 w-24 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table-row") {
    return (
      <div className={cn("w-full space-y-2", className)}>
        {items.map((i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-4 rounded-lg border border-border/60 bg-card/70 animate-pulse"
          >
            <div className="h-4 w-12 rounded bg-muted" />
            <div className="h-4 flex-1 rounded bg-muted" />
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-6 w-16 rounded-full bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "avatar") {
    return (
      <div className={cn("flex items-center space-x-3", className)}>
        {items.map((i) => (
          <div
            key={i}
            className="h-10 w-10 rounded-full bg-muted animate-pulse shrink-0"
          />
        ))}
      </div>
    );
  }

  // Default: text lines
  return (
    <div className={cn("space-y-2.5", className)}>
      {items.map((i) => (
        <div
          key={i}
          className="h-4 w-full rounded bg-muted animate-pulse"
          style={{ width: i === count - 1 && count > 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}
