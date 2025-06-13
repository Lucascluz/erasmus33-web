import Link from "next/link";
import Image from "next/image";
import Room from "@/lib/types/room";
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
import { Users, Bed, Euro } from "lucide-react";

interface RoomCardProps {
    room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
    const mainImage = room.images?.[0] || "/assets/logo.png";

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative aspect-video">
                <Image
                    src={mainImage}
                    alt={`Room ${room.number} in House ${room.house_number}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                    <Badge
                        className={`${room.is_available
                                ? "bg-green-500/80 text-white"
                                : "bg-red-500/80 text-white"
                            } border-none`}
                    >
                        {room.is_available ? "Available" : "Rented"}
                    </Badge>
                    <Badge className="bg-background/80 text-foreground border">
                        {room.type}
                    </Badge>
                </div>
            </div>

            <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                   House {room.house_number} - Room {room.number}
                </CardTitle>
                <CardDescription className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                        <Euro className="w-4 h-4 mr-1" />
                        <span className="font-semibold">€{room.price}/month</span>
                    </div>
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {room.description || "Comfortable room for rent."}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        {room.beds} bed{room.beds !== 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {room.renters} renter{room.renters !== 1 ? 's' : ''}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-3">
                <Button asChild className="w-full">
                    <Link href={`/protected/rooms/${room.id}`}>
                        View Details
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
