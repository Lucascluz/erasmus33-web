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
import { Bed, Euro, House } from "lucide-react";

interface RoomCardProps {
    room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
    const mainImage = room.main_image || room.images?.[0];

    return (
        <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 h-full ${!room.is_available ? 'opacity-75' : ''}`}>
            <div className="relative aspect-[4/3]">
                {mainImage ? (
                    <Image
                        src={mainImage}
                        alt={`Room ${room.number} in House ${room.house_number}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            <Bed className="w-16 h-16 mx-auto mb-3 opacity-50" />
                            <p className="text-base font-medium">No images available</p>
                        </div>
                    </div>
                )}
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

            <CardContent className="pt-0 pb-4">
                <p className="text-base text-muted-foreground line-clamp-3">
                    {room.description || "Comfortable room for rent."}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        {room.spots} bed{room.spots !== 1 ? 's' : ''}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-0 flex flex-col gap-3">
                <Button asChild className="w-full">
                    <Link href={`/protected/rooms/${room.id}`}>
                        <Bed className="w-4 h-4 mr-2" />
                        Rom Details
                    </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                    <Link href={`/protected/houses/${room.house_number}`}>
                        <House className="w-4 h-4 mr-2" />
                        View House
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
