import { Suspense } from "react";
import { RoomsPager } from "@/components/rooms-pager";
import { RoomsFilter } from "@/components/rooms-filter";
import { Skeleton } from "@/components/ui/skeleton";

export default async function RoomsPage({
    searchParams,
}: {
    searchParams: {
        page?: string;
        availability?: string;
        type?: string;
        minPrice?: string;
        maxPrice?: string;
    };
}) {
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || "1", 10);
    const availability = resolvedSearchParams.availability;
    const type = resolvedSearchParams.type;
    const minPrice = resolvedSearchParams.minPrice ? parseInt(resolvedSearchParams.minPrice, 10) : undefined;
    const maxPrice = resolvedSearchParams.maxPrice ? parseInt(resolvedSearchParams.maxPrice, 10) : undefined;

    return (
        <div className="w-full">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Rooms</h1>
                    <p className="text-muted-foreground">
                        Browse available rooms for rent in Guarda
                    </p>
                </div>

                <RoomsFilter />

                <Suspense
                    key={`${page}-${availability}-${type}-${minPrice}-${maxPrice}`}
                    fallback={
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="space-y-4">
                                        <Skeleton className="h-48 w-full rounded-lg" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center">
                                <Skeleton className="h-10 w-32" />
                            </div>
                        </div>
                    }
                >
                    <RoomsPager
                        page={page}
                        availability={availability}
                        type={type}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />
                </Suspense>
            </div>
        </div>
    );
}