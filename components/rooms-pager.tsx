import { createClient } from "@/lib/supabase/server";
import Room from "@/lib/types/room";
import { RoomCard } from "./room-card";
import { RoomsPaginationControls } from "./rooms-pagination-controls";

const ROOMS_PER_PAGE = 9;

interface RoomsPagerProps {
    page: number;
    search?: string;
    showUnavailable?: boolean;
}

async function getRooms(
    page: number,
    search?: string,
    showUnavailable: boolean = false
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

    // Add available/unavailable filter - by default only show available rooms
    if (!showUnavailable) {
        query = query.eq("is_available", true);
    }

    // Add search filter if search term is provided
    if (search && search.trim()) {
        const searchTerm = search.trim();
            query = query.or(`house_number.eq.${searchTerm},number.eq.${searchTerm}`);
    }

    const { data: rooms, count } = await query
        .order("house_number", { ascending: true })
        .order("number", { ascending: true })
        .range(from, to);

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

export async function RoomsPager({ page, search, showUnavailable = false }: RoomsPagerProps) {
    const { rooms, totalCount, hasNextPage, hasPrevPage } = await getRooms(page, search, showUnavailable);

    const totalPages = Math.ceil(totalCount / ROOMS_PER_PAGE);

    if (rooms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold">No rooms found</h3>
                    <p className="text-muted-foreground">
                        {search
                            ? `Try searching with different terms or check your spelling.`
                            : "Come back later to see new listings."
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    {search ? (
                        <>Showing {rooms.length} of {totalCount} rooms for &quot;{search}&quot;</>
                    ) : (
                        <>Showing {rooms.length} of {totalCount} rooms</>
                    )}
                </p>
                <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
