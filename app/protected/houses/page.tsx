import { Suspense } from "react";
import { HousesPager } from "@/components/houses-pager";
import { Skeleton } from "@/components/ui/skeleton";

export default async function HousesPage({
    searchParams,
}: {
    searchParams: { page?: string };
}) {
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || "1", 10);

    return (
        <div className="w-full">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Houses</h1>
                    <p className="text-muted-foreground">
                        Browse available houses for rent in Guarda
                    </p>
                </div>

                <Suspense
                    key={page}
                    fallback={
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <HousesPager page={page} />
                </Suspense>
            </div>
        </div>
    );
}