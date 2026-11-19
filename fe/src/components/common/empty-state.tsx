import React from "react";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/60 p-10 text-center transition-all",
        className,
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/80 text-primary mb-4 shadow-inner">
        {icon || <FolderOpen className="h-8 w-8 text-primary/80" />}
      </div>
      <h3 className="text-base font-bold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="max-w-md text-sm text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <div>
          {action.href ? (
            <Link href={action.href}>
              <Button variant="default" size="sm">
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button variant="default" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
