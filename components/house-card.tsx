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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Users } from "lucide-react";

interface HouseCardProps {
  house: House;
}

export function HouseCard({ house }: HouseCardProps) {
  const mainImage = house.images?.[0] || "/assets/misc/rented.png";
  const address = `${house.street} ${house.number}, ${house.postal_code}`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-video">
        <Image
          src={mainImage}
          alt={`House at ${address}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {house.floor && (
          <Badge className="absolute top-2 right-2 bg-background/80 text-foreground border">
            <Home className="w-3 h-3 mr-1" />
            Floor {house.floor}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-1">{address}</CardTitle>
        <CardDescription className="flex items-center text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          Guarda, Portugal
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {house.description || "Beautiful house available for rent."}
        </p>
      </CardContent>

      <CardFooter className="pt-3">
        <Button asChild className="w-full">
          <Link href={`/protected/houses/${house.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
