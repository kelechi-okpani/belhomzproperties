"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    className?: string;
}

export function CustomPagination({
                                     currentPage,
                                     totalPages,
                                     totalItems,
                                     pageSize,
                                     onPageChange,
                                     onPageSizeChange,
                                     pageSizeOptions = [10, 20, 50, 100],
                                     className = "",
                                 }: PaginationProps) {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    // Helper to generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) {
                end = 4;
            } else if (currentPage >= totalPages - 2) {
                start = totalPages - 3;
            }

            if (start > 2) pages.push("...");

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages - 1) pages.push("...");

            pages.push(totalPages);
        }

        return pages;
    };

    if (totalPages <= 1 && totalItems === 0) return null;

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3 ${className}`}>
            {/* Item Range Counter */}
            <div className="text-xs text-[var(--color-ink-muted)]">
                Showing <span className="font-semibold text-[var(--color-ink)]">{startItem}</span> to{" "}
                <span className="font-semibold text-[var(--color-ink)]">{endItem}</span> of{" "}
                <span className="font-semibold text-[var(--color-ink)]">{totalItems}</span> entries
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {/* Page Size Selector */}
                {onPageSizeChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--color-ink-muted)]">Rows per page:</span>
                        <Select
                            value={String(pageSize)}
                            onValueChange={(val) => onPageSizeChange(Number(val))}
                        >
                            <SelectTrigger className="h-8 w-[70px] text-xs border-[var(--color-border)] bg-[var(--color-paper)]">
                                <SelectValue placeholder={String(pageSize)} />
                            </SelectTrigger>
                            <SelectContent align="end">
                                {pageSizeOptions.map((option) => (
                                    <SelectItem key={option} value={String(option)} className="text-xs">
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Navigation Controls */}
                <div className="flex items-center space-x-1">
                    {/* First Page */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-[var(--color-ink)] border-[var(--color-border)]"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage <= 1}
                        aria-label="First page"
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>

                    {/* Previous Page */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-[var(--color-ink)] border-[var(--color-border)]"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page Number Buttons */}
                    <div className="hidden sm:flex items-center space-x-1">
                        {getPageNumbers().map((page, index) => (
                            typeof page === "number" ? (
                                <Button
                                    key={index}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    className={`h-8 w-8 text-xs font-mono p-0 ${
                                        currentPage === page
                                            ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                                            : "border-[var(--color-border)] text-[var(--color-ink)]"
                                    }`}
                                    onClick={() => onPageChange(page)}
                                >
                                    {page}
                                </Button>
                            ) : (
                                <span key={index} className="px-1 text-xs text-[var(--color-ink-muted)]">
                  {page}
                </span>
                            )
                        ))}
                    </div>

                    {/* Mobile Current Page Indicator */}
                    <span className="sm:hidden text-xs font-mono text-[var(--color-ink)] px-2">
            {currentPage} / {totalPages || 1}
          </span>

                    {/* Next Page */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-[var(--color-ink)] border-[var(--color-border)]"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        aria-label="Next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Last Page */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-[var(--color-ink)] border-[var(--color-border)]"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage >= totalPages}
                        aria-label="Last page"
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}