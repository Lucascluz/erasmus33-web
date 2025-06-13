import { createClient } from "@/lib/supabase/client";
import House from "@/lib/types/house";
import { HouseCard } from "./house-card";
import { PaginationControls } from "./pagination-controls";

const HOUSES_PER_PAGE = 9;

interface HousesPagerProps {
  page: number;
}

async function getHouses(page: number): Promise<{
  houses: House[];
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> {
  const supabase = await createClient();
  
  const from = (page - 1) * HOUSES_PER_PAGE;
  const to = from + HOUSES_PER_PAGE - 1;

  // Get houses with efficient range query
  const { data: houses, error, count } = await supabase
    .from("houses")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching houses:", error);
    throw new Error("Failed to fetch houses");
  }

  const totalCount = count || 0;
  const hasNextPage = to < totalCount - 1;
  const hasPrevPage = page > 1;

  return {
    houses: houses || [],
    totalCount,
    hasNextPage,
    hasPrevPage,
  };
}

export async function HousesPager({ page }: HousesPagerProps) {
  const { houses, totalCount, hasNextPage, hasPrevPage } = await getHouses(page);
  
  const totalPages = Math.ceil(totalCount / HOUSES_PER_PAGE);

  if (houses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">No houses available</h3>
          <p className="text-muted-foreground">
            Check back later for new listings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {houses.length} of {totalCount} houses
        </p>
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {houses.map((house) => (
          <HouseCard key={house.id} house={house} />
        ))}
      </div>

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </div>
  );
}
