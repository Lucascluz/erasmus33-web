"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface RoomsSearchProps {
    defaultValue?: string;
}

export function RoomsSearch({ defaultValue = "" }: RoomsSearchProps) {
    const [searchTerm, setSearchTerm] = useState(defaultValue);
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setSearchTerm(defaultValue);
    }, [defaultValue]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    // Function to perform search
    const performSearch = useCallback((term: string) => {
        const params = new URLSearchParams(searchParams);

        if (term.trim()) {
            params.set("search", term.trim());
        } else {
            params.delete("search");
        }

        // Reset to page 1 when searching
        params.set("page", "1");

        router.push(`/protected/rooms?${params.toString()}`);
    }, [router, searchParams]);

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

        // Clear any pending search timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
            setSearchTimeout(null);
        }

        const params = new URLSearchParams(searchParams);
        params.delete("search");
        params.set("page", "1");
        router.push(`/protected/rooms?${params.toString()}`);
    };

    return (
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
                type="text"
                placeholder="Pesquisar por endereço, rua ou número..."
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
    );
}

