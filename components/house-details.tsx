import Link from "next/link";
import House from "@/lib/types/house";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { ImageGallery } from "@/components/image-gallery";

interface HouseDetailsProps {
    house: House;
}

export function HouseDetails({ house }: HouseDetailsProps) {
    const address = `${house.street} ${house.number}, ${house.postal_code}`;
    const formattedDate = new Date(house.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="space-y-8">
            {/* Back navigation */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/protected/houses">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Houses
                    </Link>
                </Button>
            </div>

            {/* Image Gallery */}
            <ImageGallery images={house.images} address={address} />

            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">House {house.number}</h1>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {address}
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4 mr-1" />
                                Listed on {formattedDate}
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            {/* House Information */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>About this house</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {house.description ||
                                    "This beautiful house is located in a prime area of Guarda, perfect for students and professionals. The property offers excellent amenities and is well-connected to the city center and university."
                                }
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/protected/houses">
                                    View More Houses
                                </Link>
                            </Button>

                            <Button variant="outline" className="w-full" asChild>
                                <Link href={`/protected/rooms?search=${house.number}`}>
                                    House {house.number} Rooms
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
