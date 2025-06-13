"use client";

import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Home,
    ArrowLeft,
    Search,
    MoreVertical,
    Plus,
} from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState, useMemo } from "react";

interface House {
    number: number;
    id: string;
    street: string;
    created_at?: string;
}

async function getAllHouses(): Promise<House[]> {
    const supabase = await createClient();

    const { data: houses, error } = await supabase.from("houses").select("*");

    if (error) {
        console.error("Error fetching houses:", error);
        return [];
    }

    return houses as House[];
}

export default function HousesManagementPage() {
    const [houses, setHouses] = useState<House[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchHouses() {
            const fetchedHouses = await getAllHouses();
            setHouses(fetchedHouses);
        }
        fetchHouses();
    }, []);

    const filteredHouses = useMemo(() => {
        return houses.filter((house) => {
            const matchesSearch =
                house.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
                house.number.toString().includes(searchQuery);

            // Simplify filtering logic since 'is_active' does not exist
            return matchesSearch;
        });
    }, [houses, searchQuery]);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Home className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold">House Management</h1>
                            <p className="text-sm text-muted-foreground">
                                Manage all houses and their details
                            </p>
                        </div>
                    </div>
                </div>

                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative flex-1 sm:w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search houses by name, street, or number..."
                                    className="pl-10 pr-4 py-2 w-full border border-input bg-background rounded-md text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Link href="/admin/houses/new">
                                <Button variant="default" size="lg" className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600">
                                    <Plus className="h-10 w-10" />
                                    Add New House
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4">
                    {filteredHouses.map((house) => (
                        <Card key={house.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl font-semibold">
                                            {house.number}
                                        </span>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-lg">
                                                    {house.street} {house.number}
                                                </h3>
                                            </div>

                                            {house.created_at && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Added {new Date(house.created_at).toLocaleDateString("en-US")}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="p-1">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Link href={`/protected/houses/${house.id}`}>
                                                    View Details
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Link href={`/admin/houses/edit/${house.id}`}>
                                                    Edit House
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredHouses.length === 0 && (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No houses found</h3>
                            <p className="text-muted-foreground">
                                There are no houses in the system yet.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}