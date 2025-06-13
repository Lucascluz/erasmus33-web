import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Room from "@/lib/types/room";
import { RoomDetails } from "../../../../components/room-details";
import { Skeleton } from "@/components/ui/skeleton";

interface RoomPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getRoom(id: string): Promise<Room | null> {
    const supabase = await createClient();

    const { data: room, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching room:", error);
        return null;
    }

    return room;
}

async function RoomContent({ id }: { id: string }) {
    const room = await getRoom(id);

    if (!room) {
        notFound();
    }

    return <RoomDetails room={room} />;
}

export default async function RoomPage({ params }: RoomPageProps) {
    const resolvedParams = await params;
    return (
        <div className="w-full">
            <Suspense
                fallback={
                    <div className="space-y-8">
                        {/* Image gallery skeleton */}
                        <div className="space-y-4">
                            <Skeleton className="w-full h-96 rounded-lg" />
                            <div className="grid grid-cols-4 gap-2">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-20 rounded" />
                                ))}
                            </div>
                        </div>

                        {/* Details skeleton */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    </div>
                }
            >
                <RoomContent id={resolvedParams.id} />
            </Suspense>
        </div>
    );
}