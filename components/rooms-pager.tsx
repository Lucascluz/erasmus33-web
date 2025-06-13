import { createClient } from "@/lib/supabase/server";
import Room from "@/lib/types/room";
import { RoomCard } from "./room-card";
import { RoomsPaginationControls } from "./rooms-pagination-controls";

const ROOMS_PER_PAGE = 9;

interface RoomsPagerProps {
    page: number;
    availability?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
}

async function getRooms(
    page: number,
    filters: {
        availability?: string;
        type?: string;
        minPrice?: number;
        maxPrice?: number;
    } = {}
): Promise<{
    rooms: Room[];
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}> {
    const supabase = await createClient();

    const from = (page - 1) * ROOMS_PER_PAGE;
    const to = from + ROOMS_PER_PAGE - 1;

    let query = supabase
        .from("rooms")
        .select("*", { count: "exact" });

    // Apply filters
    if (filters.availability === "available") {
        query = query.eq("is_available", true);
    } else if (filters.availability === "rented") {
        query = query.eq("is_available", false);
    }

    if (filters.type) {
        query = query.eq("type", filters.type);
    }

    if (filters.minPrice !== undefined) {
        query = query.gte("price", filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
        query = query.lte("price", filters.maxPrice);
    }

    const { data: rooms, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Error fetching rooms:", error);
        throw new Error("Failed to fetch rooms");
    }

    const totalCount = count || 0;
    const hasNextPage = to < totalCount - 1;
    const hasPrevPage = page > 1;

    return {
        rooms: rooms || [],
        totalCount,
        hasNextPage,
        hasPrevPage,
    };
}

export async function RoomsPager({
    page,
    availability,
    type,
    minPrice,
    maxPrice
}: RoomsPagerProps) {
    const { rooms, totalCount, hasNextPage, hasPrevPage } = await getRooms(page, {
        availability,
        type,
        minPrice,
        maxPrice,
    });

    const totalPages = Math.ceil(totalCount / ROOMS_PER_PAGE);

    if (rooms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold">No rooms found</h3>
                    <p className="text-muted-foreground">
                        Try adjusting your filters or check back later for new listings.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    Showing {rooms.length} of {totalCount} rooms
                </p>
                <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                ))}
            </div>

            <RoomsPaginationControls
                currentPage={page}
                totalPages={totalPages}
                hasNextPage={hasNextPage}
                hasPrevPage={hasPrevPage}
            />
        </div>
    );
}
