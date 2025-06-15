"use client";

import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Home,
    ArrowLeft,
    Search,
    Filter,
    MoreVertical,
    Plus,
    Euro,
    Bed,
    Eye,
    EyeOff,
    Settings,
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
    const supabase = createClient();

    const { data: rooms, error } = await supabase.from("rooms").select("*");

    if (error) {
        console.error("Error fetching rooms:", error);
        return [];
    }

    return rooms as Room[];
}

export default function RoomsManagementPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOption, setFilterOption] = useState<string | null>(null);
    const [visibleColumns, setVisibleColumns] = useState({
        house: true,
        room: true,
        type: true,
        status: true,
        price: true,
        spots: false,
        description: false,
        added: false,
    });

    const toggleColumn = (column: keyof typeof visibleColumns) => {
        setVisibleColumns(prev => ({
            ...prev,
            [column]: !prev[column]
        }));
    };

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
                room.house_number.includes(searchQuery) ||
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
            <div className="container mx-auto px-8 md:px-12 lg:px-20 xl:px-32 py-4">
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
                            <div className="flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-2"
                                        >
                                            <Settings className="h-4 w-4" />
                                            Columns
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {Object.entries(visibleColumns).map(([key, visible]) => (
                                            <DropdownMenuItem
                                                key={key}
                                                onClick={() => toggleColumn(key as keyof typeof visibleColumns)}
                                                className="flex items-center gap-2"
                                            >
                                                {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b">
                                    {visibleColumns.house && <TableHead className="h-14 px-6 text-left font-semibold text-base align-middle">House</TableHead>}
                                    {visibleColumns.room && <TableHead className="h-14 px-6 text-left font-semibold text-base align-middle">Room</TableHead>}
                                    {visibleColumns.type && <TableHead className="h-14 px-6 text-left font-semibold text-base align-middle">Type</TableHead>}
                                    {visibleColumns.status && <TableHead className="h-14 px-6 text-center font-semibold text-base align-middle">Status</TableHead>}
                                    {visibleColumns.price && <TableHead className="h-14 px-6 text-left font-semibold text-base align-middle">Price</TableHead>}
                                    {visibleColumns.spots && <TableHead className="h-14 px-6 text-left font-semibold text-base align-middle">spots</TableHead>}
                                    {visibleColumns.description && <TableHead className="h-14 px-6 text-left font-semibold text-base align-middle">Description</TableHead>}
                                    {visibleColumns.added && <TableHead className="h-14 px-6 text-left font-semibold text-base align-middle">Added</TableHead>}
                                    <TableHead className="h-14 px-6 text-right font-semibold text-base align-middle">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRooms.map((room) => (
                                    <TableRow key={room.id} className="hover:bg-muted/50 transition-colors">
                                        {visibleColumns.house && (
                                            <TableCell className="py-4 px-6 align-middle">
                                                <span className="font-medium text-base">House {room.house_number}</span>
                                            </TableCell>
                                        )}
                                        {visibleColumns.room && (
                                            <TableCell className="py-4 px-6 align-middle">
                                                <span className="font-medium text-base">Room {room.number}</span>
                                            </TableCell>
                                        )}
                                        {visibleColumns.type && (
                                            <TableCell className="py-4 px-6 align-middle">
                                                <Badge variant="secondary" className="font-medium text-sm px-3 py-1">
                                                    {room.type}
                                                </Badge>
                                            </TableCell>
                                        )}
                                        {visibleColumns.status && (
                                            <TableCell className="py-4 px-6 text-center align-middle">
                                                <Badge
                                                    className={`font-medium text-sm px-3 py-1 ${room.is_available
                                                        ? "bg-green-500 text-white"
                                                        : "bg-red-500 text-white"
                                                        }`}
                                                >
                                                    {room.is_available ? "Available" : "Rented"}
                                                </Badge>
                                            </TableCell>
                                        )}
                                        {visibleColumns.price && (
                                            <TableCell className="py-4 px-6 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <Euro className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium text-base">€{room.price}/month</span>
                                                </div>
                                            </TableCell>
                                        )}
                                        {visibleColumns.spots && (
                                            <TableCell className="py-4 px-6 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <Bed className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-base">{room.spots} bed{room.spots !== 1 ? 's' : ''}</span>
                                                </div>
                                            </TableCell>
                                        )}
                                        {visibleColumns.description && (
                                            <TableCell className="py-4 px-6 max-w-xs align-middle">
                                                <p className="text-base text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {room.description || "No description available."}
                                                </p>
                                            </TableCell>
                                        )}
                                        {visibleColumns.added && (
                                            <TableCell className="py-4 px-6 align-middle">
                                                {room.created_at && (
                                                    <span className="text-sm text-muted-foreground font-medium">
                                                        {new Date(room.created_at).toLocaleDateString("en-US", {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                )}
                                            </TableCell>
                                        )}
                                        <TableCell className="py-4 px-6 text-right align-middle">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="p-2 h-8 w-8">
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
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

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