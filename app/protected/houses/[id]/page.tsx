import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import House from "@/lib/types/house";
import { HouseDetails } from "../../../../components/house-details";
import { Skeleton } from "@/components/ui/skeleton";

interface HousePageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getHouse(id: string): Promise<House | null> {
    const supabase = await createClient();

    const { data: house, error } = await supabase
        .from("houses")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching house:", error);
        return null;
    }

    return house;
}

async function HouseContent({ id }: { id: string }) {
    const house = await getHouse(id);

    if (!house) {
        notFound();
    }

    return <HouseDetails house={house} />;
}

export default async function HousePage({ params }: HousePageProps) {
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
                                    <Skeleton key={i} className="aspect-square rounded-lg" />
                                ))}
                            </div>
                        </div>

                        {/* Content skeleton */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="space-y-4">
                                    <Skeleton className="h-8 w-3/4" />
                                    <Skeleton className="h-6 w-1/2" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-32 w-full rounded-lg" />
                                <Skeleton className="h-48 w-full rounded-lg" />
                            </div>
                        </div>
                    </div>
                }
            >
                <HouseContent id={resolvedParams.id} />
            </Suspense>
        </div>
    );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: HousePageProps) {
    const resolvedParams = await params;
    const house = await getHouse(resolvedParams.id);

    if (!house) {
        return {
            title: "House Not Found",
            description: "The requested house could not be found.",
        };
    }

    const address = `${house.street} ${house.number}, ${house.postal_code}`;

    return {
        title: `House at ${address} | Erasmus33`,
        description: house.description || `Beautiful house for rent at ${address} in Guarda, Portugal.`,
        openGraph: {
            title: `House at ${address}`,
            description: house.description,
            images: house.images?.[0] ? [house.images[0]] : [],
        },
    };
}