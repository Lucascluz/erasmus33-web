"use client";

import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Home,
    ArrowLeft,
    Search,
    Filter,
    MoreVertical,
    Plus,
    Euro,
    Bed,
    Users,
} from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState, useMemo } from "react";
import Room from "@/lib/types/room";

async function checkAdminAccess() {
    const supabase = createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/auth/login");
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

    if (profileError || !profile || profile.role !== "admin") {
        redirect("/protected");
    }
}

async function getAllRooms(): Promise<Room[]> {
    const supabase = await createClient();

    const { data: rooms, error } = await supabase.from("rooms").select("*");

    if (error) {
        console.error("Error fetching rooms:", error);
        return [];
    }

    console.log("Fetched rooms:", rooms);

    return rooms as Room[];
}

export default function RoomsManagementPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOption, setFilterOption] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRooms() {
            const fetchedRooms = await getAllRooms();
            setRooms(fetchedRooms);
        }
        fetchRooms();
    }, []);

    checkAdminAccess();

    const filteredRooms = useMemo(() => {
        return rooms.filter((room) => {
            const matchesSearch =
                room.number.toString().includes(searchQuery) ||
                room.house_number .includes(searchQuery) ||
                room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                room.description.toLowerCase().includes(searchQuery.toLowerCase());

            // Apply filter options
            if (filterOption === "available") {
                return matchesSearch && room.is_available;
            } else if (filterOption === "rented") {
                return matchesSearch && !room.is_available;
            }

            return matchesSearch;
        });
    }, [rooms, searchQuery, filterOption]);


    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 md:px-8 lg:px-12 py-4">
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
                            <h1 className="text-2xl font-bold">Room Management</h1>
                            <p className="text-sm text-muted-foreground">
                                Manage all rooms and their details
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
                                    placeholder="Search rooms by number, house, type, or description..."
                                    className="pl-10 pr-4 py-2 w-full border border-input bg-background rounded-md text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white"
                                    >
                                        <Filter className="h-4 w-4" />
                                        {filterOption ? `Filter: ${filterOption}` : "Filter"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => setFilterOption(null)}>
                                        All Rooms
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterOption("available")}>
                                        Available Rooms
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterOption("rented")}>
                                        Rented Rooms
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Link href="/admin/rooms/new">
                                <Button variant="default" size="lg" className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600">
                                    <Plus className="h-10 w-10" />
                                    Add New Room
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4">
                    {filteredRooms.map((room) => (
                        <Card key={room.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-lg">
                                                    Room {room.number} - House {room.house_number}
                                                </h3>
                                                <Badge
                                                    className={`${room.is_available
                                                        ? "bg-green-500 text-white"
                                                        : "bg-red-500 text-white"
                                                        }`}
                                                >
                                                    {room.is_available ? "Available" : "Rented"}
                                                </Badge>
                                                <Badge variant="secondary">
                                                    {room.type}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                                <div className="flex items-center gap-1">
                                                    <Euro className="h-4 w-4" />
                                                    <span>€{room.price}/month</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Bed className="h-4 w-4" />
                                                    <span>{room.beds} bed{room.beds !== 1 ? 's' : ''}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    <span>{room.renters} renter{room.renters !== 1 ? 's' : ''}</span>
                                                </div>
                                            </div>

                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {room.description || "No description available."}
                                            </p>

                                            {room.created_at && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Added {new Date(room.created_at).toLocaleDateString("en-US")}
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
                                                <Link href={`/protected/rooms/${room.id}`}>
                                                    View Details
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Link href={`/admin/rooms/edit/${room.id}`}>
                                                    Edit Room
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredRooms.length === 0 && (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No rooms found</h3>
                            <p className="text-muted-foreground">
                                {searchQuery || filterOption
                                    ? "No rooms match your current search and filter criteria."
                                    : "There are no rooms in the system yet."
                                }
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}