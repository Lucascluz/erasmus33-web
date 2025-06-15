import { Suspense } from "react";
import { HousesPager } from "@/components/houses-pager";
import { HousesSearch } from "@/components/houses-search";
import { Skeleton } from "@/components/ui/skeleton";

export default async function HousesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || "1", 10);
    const search = resolvedSearchParams.search || "";

    return (
        <div className="w-full">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Casas</h1>
                    <p className="text-muted-foreground">
                        Navegue pelas casas disponíveis para alugar na Guarda
                    </p>
                </div>

                <div className="w-full max-w-2xl">
                    <HousesSearch defaultValue={search} />
                </div>

                <Suspense
                    key={`${page}-${search}`}
                    fallback={
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="space-y-4">
                                        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <Skeleton className="h-4 w-2/3" />
                                            <Skeleton className="h-10 w-full rounded-md" />
                                            <Skeleton className="h-10 w-full rounded-md" />
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
                    <HousesPager page={page} search={search} />
                </Suspense>
            </div>
        </div>
    );
}