"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RoomsPaginationControlsProps {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export function RoomsPaginationControls({
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
}: RoomsPaginationControlsProps) {
    const searchParams = useSearchParams();

    // Helper function to create URL with preserved search params
    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        return `?${params.toString()}`;
    };

    // Generate page numbers to show
    const getPageNumbers = () => {
        const delta = 2; // Show 2 pages before and after current page
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, "...");
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) {
        return null;
    }

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center space-x-2">
            {/* Previous button */}
            <Button
                variant="outline"
                size="sm"
                asChild={hasPrevPage}
                disabled={!hasPrevPage}
            >
                {hasPrevPage ? (
                    <Link href={createPageUrl(currentPage - 1)}>
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Anterior
                    </Link>
                ) : (
                    <>
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Anterior
                    </>
                )}
            </Button>

            {/* Page numbers */}
            <div className="hidden sm:flex items-center space-x-1">
                {pageNumbers.map((pageNum, index) =>
                    pageNum === "..." ? (
                        <span key={`dots-${index}`} className="px-2 text-muted-foreground">
                            ...
                        </span>
                    ) : (
                        <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            asChild={currentPage !== pageNum}
                            disabled={currentPage === pageNum}
                        >
                            {currentPage === pageNum ? (
                                <span>{pageNum}</span>
                            ) : (
                                <Link href={createPageUrl(pageNum as number)}>{pageNum}</Link>
                            )}
                        </Button>
                    )
                )}
            </div>

            {/* Mobile page indicator */}
            <div className="sm:hidden">
                <span className="text-sm text-muted-foreground">
                    {currentPage} / {totalPages}
                </span>
            </div>

            {/* Next button */}
            <Button
                variant="outline"
                size="sm"
                asChild={hasNextPage}
                disabled={!hasNextPage}
            >
                {hasNextPage ? (
                    <Link href={createPageUrl(currentPage + 1)}>
                        Próximo
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                ) : (
                    <>
                        Próximo
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                )}
            </Button>
        </div>
    );
}
