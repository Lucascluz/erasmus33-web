import { createClient } from "@/lib/supabase/server";
import Room from "@/lib/types/room";
import { RoomCard } from "./room-card";
import { RoomsPaginationControls } from "./rooms-pagination-controls";

const ROOMS_PER_PAGE = 9;

interface RoomsPagerProps {
    page: number;
    search?: string;
}

async function getRooms(
    page: number,
    search?: string
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

    // Add search filter if search term is provided
    if (search && search.trim()) {
        const searchTerm = search.trim();
        query = query.or(`house_number.ilike.%${searchTerm}%,number.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%`);
    }

    const { data: rooms, error, count } = await query
        .order("house_number", { ascending: true })
        .order("number", { ascending: true })
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

export async function RoomsPager({ page, search }: RoomsPagerProps) {
    const { rooms, totalCount, hasNextPage, hasPrevPage } = await getRooms(page, search);

    const totalPages = Math.ceil(totalCount / ROOMS_PER_PAGE);

    if (rooms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold">Nenhum quarto encontrado</h3>
                    <p className="text-muted-foreground">
                        {search
                            ? `Tente buscar com outros termos ou verifique a ortografia.`
                            : "Volte mais tarde para ver novas listagens."
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
                        <>Showing {rooms.length} of {totalCount} quartos for &quot;{search}&quot;</>
                    ) : (
                        <>Showing {rooms.length} of {totalCount} quartos</>
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
