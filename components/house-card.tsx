import Link from "next/link";
import Image from "next/image";
import House from "@/lib/types/house";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Home, BedDouble } from "lucide-react";

interface HouseCardProps {
  house: House;
}

export function HouseCard({ house }: HouseCardProps) {
  const mainImage = house.images?.[0];
  const name = `House ${house.number}`
  const address = `${house.street} ${house.number}, ${house.postal_code}`;

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 h-full ${!house.is_active ? 'opacity-75' : ''}`}>
      <div className="relative aspect-[4/3]">
        {!house.is_active && (
          <Badge
            variant="destructive"
            className="absolute top-2 right-2 z-10"
          >
            Inactive
          </Badge>
        )}
        {mainImage ? (
          <Image
            src={mainImage}
            alt={`House at ${address}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Home className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p className="text-base font-medium">No images available</p>
            </div>
          </div>
        )}
      </div>

      <CardHeader className="pb-4">
        <CardTitle className="text-xl line-clamp-1">{name}</CardTitle>
        <CardDescription className="flex items-center text-base">
          <MapPin className="w-4 h-4 mr-1" />
          Guarda, Portugal
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        <p className="text-base text-muted-foreground line-clamp-3">
          {house.description || "Beautiful house available for rent."}
        </p>
      </CardContent>

      <CardFooter className="pt-0 flex flex-col gap-3">
        <Button asChild className="w-full">
          <Link href={`/protected/houses/${house.id}`}>
            House Details
          </Link>
        </Button>
        <Button asChild className="w-full bg-blue-500 text-white hover:bg-blue-600">
          <Link href={`/protected/rooms?search=${house.number}`}>
            <BedDouble className="w-4 h-4 mr-2" />
            Available Rooms
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
