import Link from "next/link";
import House from "@/lib/types/house";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Home, Calendar, Mail, Phone } from "lucide-react";
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

            {/* House Information */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold">{address}</h1>
                                <div className="flex items-center text-muted-foreground">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    Guarda, Portugal
                                </div>
                            </div>

                            {house.floor && (
                                <Badge variant="secondary" className="shrink-0">
                                    <Home className="w-3 h-3 mr-1" />
                                    Floor {house.floor}
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-1" />
                            Listed on {formattedDate}
                        </div>
                    </div>

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

                    {/* Property Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <Home className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm">House</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm">Guarda Location</span>
                                </div>
                                {house.floor && (
                                    <div className="flex items-center">
                                        <Home className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm">Floor {house.floor}</span>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm">Available Now</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Interested in this property? Get in touch with us for more information or to schedule a viewing.
                            </p>

                            <div className="space-y-3">
                                <Button className="w-full" asChild>
                                    <Link href="mailto:info@erasmus33.com">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Send Email
                                    </Link>
                                </Button>

                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="tel:+351000000000">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call Us
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="text-sm">
                                    <div className="font-medium">{address}</div>
                                    <div className="text-muted-foreground">Guarda, Portugal</div>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    Located in the beautiful historic city of Guarda, close to the university and city center with excellent public transportation connections.
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Actions */}
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
                                <Link href="/protected/rooms">
                                    Browse Rooms
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
