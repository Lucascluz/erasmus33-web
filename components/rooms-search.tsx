"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export function RoomsSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

    useEffect(() => {
        setSearchQuery(searchParams.get("search") || "");
    }, [searchParams]);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);

        const params = new URLSearchParams();

        if (value.trim()) {
            params.set("search", value.trim());
        }

        // Reset to page 1 when searching
        params.set("page", "1");

        router.push(`?${params.toString()}`);
    };

    return (
        <div className="w-full">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search rooms by house number, room number, type, or description..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full"
                />
            </div>
        </div>
    );
}
