import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="w-full space-y-8">
            {/* Back navigation skeleton */}
            <Skeleton className="h-10 w-32" />

            {/* Image gallery skeleton */}
            <div className="space-y-4">
                <Skeleton className="w-full h-96 rounded-lg" />
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-lg" />
                    ))}
                </div>
            </div>

            {/* Content skeleton */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Header skeleton */}
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-6 w-1/2" />
                            </div>
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-4 w-1/3" />
                    </div>

                    {/* Description card skeleton */}
                    <div className="space-y-4 p-6 border rounded-lg">
                        <Skeleton className="h-6 w-40" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>

                    {/* Features card skeleton */}
                    <div className="space-y-4 p-6 border rounded-lg">
                        <Skeleton className="h-6 w-32" />
                        <div className="grid sm:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-4 w-32" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar skeleton */}
                <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-4 p-6 border rounded-lg">
                            <Skeleton className="h-6 w-32" />
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
