"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";

interface RoomsSearchProps {
    defaultValue?: string;
    defaultShowUnavailable?: boolean;
}

export function RoomsSearch({ defaultValue = "", defaultShowUnavailable = false }: RoomsSearchProps) {
    const [searchTerm, setSearchTerm] = useState(defaultValue);
    const [showUnavailable, setShowUnavailable] = useState(defaultShowUnavailable);
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setSearchTerm(defaultValue);
        setShowUnavailable(defaultShowUnavailable);
    }, [defaultValue, defaultShowUnavailable]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    // Function to perform search
    const performSearch = useCallback((term: string, includeUnavailable?: boolean) => {
        const params = new URLSearchParams(searchParams);

        if (term.trim()) {
            params.set("search", term.trim());
        } else {
            params.delete("search");
        }

        // Handle show unavailable parameter
        const unavailableValue = includeUnavailable !== undefined ? includeUnavailable : showUnavailable;
        if (unavailableValue) {
            params.set("show_unavailable", "true");
        } else {
            params.delete("show_unavailable");
        }

        // Reset to page 1 when searching
        params.set("page", "1");

        router.push(`/protected/rooms?${params.toString()}`);
    }, [router, searchParams, showUnavailable]);

    // Handle input change with debounced search
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Set new timeout for debounced search
        const newTimeout = setTimeout(() => {
            performSearch(value);
        }, 500);

        setSearchTimeout(newTimeout);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setShowUnavailable(false);

        // Clear any pending search timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
            setSearchTimeout(null);
        }

        const params = new URLSearchParams(searchParams);
        params.delete("search");
        params.delete("show_unavailable");
        params.set("page", "1");
        router.push(`/protected/rooms?${params.toString()}`);
    };

    const handleShowUnavailableChange = (checked: boolean) => {
        setShowUnavailable(checked);
        performSearch(searchTerm, checked);
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    type="text"
                    placeholder="Search by address, street or number..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                />
                {searchTerm && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <div className="flex items-center space-x-2 md:whitespace-nowrap">
                <Checkbox
                    id="show-inactive"
                    checked={showUnavailable}
                    onCheckedChange={handleShowUnavailableChange}
                />
                <Label
                    htmlFor="show-inactive"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Show unavailable rooms
                </Label>
            </div>
        </div>
    );
}

