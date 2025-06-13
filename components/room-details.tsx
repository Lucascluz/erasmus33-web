import Link from "next/link";
import Room from "@/lib/types/room";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Home, Calendar, Euro, Bed, Users, CheckCircle, XCircle } from "lucide-react";
import { ImageGallery } from "@/components/image-gallery";

interface RoomDetailsProps {
    room: Room;
}

export function RoomDetails({ room }: RoomDetailsProps) {
    const formattedDate = new Date(room.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="space-y-8">
            {/* Back navigation */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/protected/rooms">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Rooms
                    </Link>
                </Button>
            </div>

            {/* Image Gallery */}
            <ImageGallery
                images={room.images}
                address={`Room ${room.number} - House ${room.house_number}`}
            />

            {/* Room Information */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold">
                                    Room {room.number} - House {room.house_number}
                                </h1>
                                <div className="flex items-center gap-4">
                                    <Badge
                                        className={`${room.is_available
                                                ? "bg-green-500 text-white"
                                                : "bg-red-500 text-white"
                                            }`}
                                    >
                                        {room.is_available ? (
                                            <>
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Available
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-3 h-3 mr-1" />
                                                Rented
                                            </>
                                        )}
                                    </Badge>
                                    <Badge variant="secondary">
                                        {room.type}
                                    </Badge>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-3xl font-bold text-primary">
                                    €{room.price}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    per month
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Bed className="w-4 h-4 text-muted-foreground" />
                                <span>{room.beds} bed{room.beds !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>{room.renters} renter{room.renters !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>Listed on {formattedDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {room.description || "This comfortable room is perfect for students looking for quality accommodation in Guarda."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Room Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Room Features</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <Bed className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">{room.beds} bed{room.beds !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">Up to {room.renters} renter{room.renters !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Home className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">{room.type} room</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Pricing Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Euro className="w-5 h-5" />
                                Pricing
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">
                                    €{room.price}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    per month
                                </div>
                            </div>

                            {room.is_available ? (
                                <Button className="w-full" size="lg">
                                    Contact to Rent
                                </Button>
                            ) : (
                                <Button className="w-full" size="lg" disabled>
                                    Currently Rented
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* House Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>House Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">House Number:</span>
                                    <span>{room.house_number}</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href={`/protected/houses/${room.house_id}`}>
                                    View House Details
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
