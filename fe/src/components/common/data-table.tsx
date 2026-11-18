"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EmptyState } from "./empty-state";
import { LoadingSkeleton } from "./loading-skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  header: string | React.ReactNode;
  accessorKey?: keyof T;
  cell?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  keyExtractor?: (item: T, index: number) => string | number;
  pageSize?: number;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyTitle = "Không có dữ liệu",
  emptyDescription = "Hiện chưa có bản ghi nào để hiển thị.",
  emptyAction,
  keyExtractor,
  pageSize = 10,
  className,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("w-full rounded-xl border border-border bg-card p-4 shadow-sm", className)}>
        <LoadingSkeleton variant="table-row" count={5} />
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
        className={className}
      />
    );
  }

  // Pagination calculation
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  return (
    <div className={cn("w-full rounded-xl border border-border bg-card shadow-sm overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn("px-4 py-3.5 whitespace-nowrap", col.headerClassName)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 bg-card">
            {currentData.map((row, rowIdx) => {
              const rowKey = keyExtractor
                ? keyExtractor(row, startIndex + rowIdx)
                : startIndex + rowIdx;

              return (
                <tr
                  key={rowKey}
                  className="hover:bg-muted/40 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={cn("px-4 py-3.5 text-foreground align-middle", col.className)}
                    >
                      {col.cell
                        ? col.cell(row, startIndex + rowIdx)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? "")
                        : null}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Hiển thị <span className="font-semibold text-foreground">{startIndex + 1}</span>–
            <span className="font-semibold text-foreground">
              {Math.min(startIndex + pageSize, data.length)}
            </span>{" "}
            trong tổng số <span className="font-semibold text-foreground">{data.length}</span> kết quả
          </p>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Trang trước</span>
            </Button>
            <span className="text-xs font-medium px-2">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 px-2"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Trang sau</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
