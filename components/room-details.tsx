"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Room from "@/lib/types/room";
import Profile from "@/lib/types/profile";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Calendar, Euro, Bed, CheckCircle, XCircle, Mail, MessageCircle, FileText, Clock, Shield } from "lucide-react";
import { ImageGallery } from "@/components/image-gallery";

interface RoomDetailsProps {
    room: Room;
}

export function RoomDetails({ room }: RoomDetailsProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const supabase = createClient();

    const formattedDate = new Date(room.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('user_id', user.id)
                        .single();

                    if (profile) {
                        setUserProfile(profile);
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [supabase]);

    const handleContactMethod = (method: 'email' | 'whatsapp') => {
        const roomInfo = `Room ${room.number} - House ${room.house_number}`;
        const price = `€${room.price}/month`;

        if (method === 'email') {
            const subject = room.is_available
                ? `Interest in renting ${roomInfo}`
                : `Inquiry about availability for ${roomInfo}`;

            // Build user info string
            let userInfo = '';
            if (userProfile) {
                userInfo = `\n\nMy contact information:\n`;
                userInfo += `Name: ${userProfile.first_name} ${userProfile.last_name}\n`;
                userInfo += `Email: ${userProfile.email}\n`;
                if (userProfile.phone_number) {
                    userInfo += `Phone: ${userProfile.phone_number}\n`;
                }
                if (userProfile.country) {
                    userInfo += `Country: ${userProfile.country}\n`;
                }
                if (userProfile.preferred_language) {
                    userInfo += `Preferred Language: ${userProfile.preferred_language}\n`;
                }
            }

            const body = room.is_available
                ? `Hello,\n\nI am interested in renting ${roomInfo} (${price}).\n\nCould you please provide more information about the rental process?${userInfo}\n\nThank you!`
                : `Hello,\n\nI would like to inquire about the availability of ${roomInfo} (${price}).\n\nCould you please let me know when it might become available?${userInfo}\n\nThank you!`;

            const mailtoLink = `mailto:guarda.erasmus33@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.open(mailtoLink, '_blank');
        } else {
            // For WhatsApp, include basic user info
            let userInfo = '';
            if (userProfile) {
                userInfo = ` My name is ${userProfile.first_name} ${userProfile.last_name}`;
                if (userProfile.country) {
                    userInfo += ` from ${userProfile.country}`;
                }
                userInfo += '.';
            }

            const message = room.is_available
                ? `Hello! I'm interested in renting ${roomInfo} (${price}). Could you provide more information about the rental process?${userInfo}`
                : `Hello! I'd like to inquire about the availability of ${roomInfo} (${price}). When might it become available?${userInfo}`;

            const whatsappLink = `https://wa.me/351938554599?text=${encodeURIComponent(message)}`;
            window.open(whatsappLink, '_blank');
        }

        setIsDialogOpen(false);
    };

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
            <div className="grid lg:grid-cols-3 gap-8 lg:grid-rows-[auto_1fr] lg:items-stretch">
                {/* Main Content */}
                <div className="lg:col-span-2 lg:row-span-2 flex flex-col space-y-6">
                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold">
                                    House {room.house_number} | Room {room.number}
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
                                        {room.type} room
                                    </Badge>
                                </div>
                            </div>

                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Bed className="w-4 h-4 text-muted-foreground" />
                                <span>{room.spots} bed{room.spots !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>Listed on {formattedDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Rental Process */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                How Rental Works
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Payment Process */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <Euro className="w-4 h-4" />
                                    Payment Process
                                </h4>
                                <div className="text-sm text-muted-foreground space-y-2">
                                    <p>• First month payment + 1 extra month deposit required to secure your room</p>
                                    <p>• Deposit will be refunded at the end of your stay</p>
                                    <p>• Bills (electricity, water, gas) are divided equally between all house tenants</p>
                                    <p>• Extra gas can be requested via WhatsApp when needed</p>
                                </div>
                            </div>

                            {/* What's Included */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    What&apos;s Included
                                </h4>
                                <div className="text-sm text-muted-foreground space-y-2">
                                    <p>• Room deep cleaned before arrival</p>
                                    <p>• Pickup service from Guarda bus station (prior arrangement needed)</p>
                                    <p>• Basics provided: blankets, bed sheets, pillows, heater, hangers, and more</p>
                                    <p>• Common areas cleaned twice monthly and fully equipped</p>
                                </div>
                            </div>

                            {/* House Rules */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    House Rules
                                </h4>
                                <div className="text-sm text-muted-foreground space-y-2">
                                    <p>• <Clock className="w-3 h-3 inline mr-1" />Quiet hours: 10pm - 8am (Portuguese law)</p>
                                    <p>• Tenants responsible for cleaning personal spaces</p>
                                    <p>• No guests allowed after 10pm</p>
                                    <p>• Garden is exclusive for Erasmus33 tenants</p>
                                    <p>• Conscious use of shared spaces required</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="lg:col-start-3 lg:row-span-2 flex flex-col space-y-6">
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
                                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <AlertDialogTrigger asChild>
                                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
                                            Contact to Rent
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Choose Contact Method</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                How would you like to get in touch about renting this room?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <Button
                                                onClick={() => handleContactMethod('email')}
                                                className="flex items-center gap-2"
                                                variant="outline"
                                            >
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </Button>
                                            <Button
                                                onClick={() => handleContactMethod('whatsapp')}
                                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                WhatsApp
                                            </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            ) : (
                                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <AlertDialogTrigger asChild>
                                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white" size="lg">
                                            Currently Rented
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Choose Contact Method</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                How would you like to inquire about availability for this room?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <Button
                                                onClick={() => handleContactMethod('email')}
                                                className="flex items-center gap-2"
                                                variant="outline"
                                            >
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </Button>
                                            <Button
                                                onClick={() => handleContactMethod('whatsapp')}
                                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                WhatsApp
                                            </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </CardContent>
                    </Card>


                    {/* Description */}
                    <Card className="flex-1 flex flex-col">
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground leading-relaxed">
                                {room.description || "This comfortable room is perfect for students looking for quality accommodation in Guarda."}
                            </p>
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
