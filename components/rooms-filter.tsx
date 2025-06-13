"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function RoomsFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentFilters = {
        availability: searchParams.get("availability") || "",
        type: searchParams.get("type") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
    };

    const applyFilters = (filters: Record<string, string>) => {
        const params = new URLSearchParams();

        // Keep existing page if no filters change, otherwise reset to page 1
        const currentPage = searchParams.get("page");
        if (currentPage && Object.keys(filters).every(key => filters[key] === currentFilters[key as keyof typeof currentFilters])) {
            params.set("page", currentPage);
        }

        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });

        router.push(`?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push("/protected/rooms");
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const filters = {
            availability: formData.get("availability") as string || "",
            type: formData.get("type") as string || "",
            minPrice: formData.get("minPrice") as string || "",
            maxPrice: formData.get("maxPrice") as string || "",
        };

        applyFilters(filters);
    };

    const hasActiveFilters = Object.values(currentFilters).some(value => value);

    return (
        <div className="space-y-4">
            {/* Active filters display */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2">
                    <div className="flex flex-wrap gap-2">
                        {currentFilters.availability && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Status: {currentFilters.availability}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => applyFilters({ ...currentFilters, availability: "" })}
                                />
                            </Badge>
                        )}
                        {currentFilters.type && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Type: {currentFilters.type}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => applyFilters({ ...currentFilters, type: "" })}
                                />
                            </Badge>
                        )}
                        {currentFilters.minPrice && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Min: €{currentFilters.minPrice}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => applyFilters({ ...currentFilters, minPrice: "" })}
                                />
                            </Badge>
                        )}
                        {currentFilters.maxPrice && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Max: €{currentFilters.maxPrice}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => applyFilters({ ...currentFilters, maxPrice: "" })}
                                />
                            </Badge>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="flex items-center gap-2 text-muted-foreground"
                    >
                        <X className="w-4 h-4" />
                        Clear all
                    </Button>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Filter Rooms</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="availability">Availability</Label>
                                <select
                                    id="availability"
                                    name="availability"
                                    defaultValue={currentFilters.availability}
                                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                                >
                                    <option value="">All</option>
                                    <option value="available">Available</option>
                                    <option value="rented">Rented</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Room Type</Label>
                                <select
                                    id="type"
                                    name="type"
                                    defaultValue={currentFilters.type}
                                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                                >
                                    <option value="">All Types</option>
                                    <option value="single">Single</option>
                                    <option value="double">Double</option>
                                    <option value="suite">Suite</option>
                                    <option value="studio">Studio</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="minPrice">Min Price (€)</Label>
                                <Input
                                    id="minPrice"
                                    name="minPrice"
                                    type="number"
                                    placeholder="0"
                                    defaultValue={currentFilters.minPrice}
                                    min="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxPrice">Max Price (€)</Label>
                                <Input
                                    id="maxPrice"
                                    name="maxPrice"
                                    type="number"
                                    placeholder="1000"
                                    defaultValue={currentFilters.maxPrice}
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" size="sm">
                                Apply Filters
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
