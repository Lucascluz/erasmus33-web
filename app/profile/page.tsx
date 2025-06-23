import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import Profile from "@/lib/types/profile"; // Corrected import
import { Mail, Phone, Globe, Languages, UserCircle, CheckCircle, XCircle } from "lucide-react";

async function getUserProfile(): Promise<Profile | null> {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/auth/login");
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (profileError) {
        console.error("Error fetching profile:", profileError);
        return null;
    }
    return profile as Profile;
}

export default async function ProfilePage() {
    const profile = await getUserProfile();

    if (!profile) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-6">Profile</h1>
                    <p className="text-red-500">Could not load profile information. Please try again later.</p>
                </div>
            </div>
        );
    }

    const getInitials = (firstName?: string, lastName?: string) => {
        if (firstName && lastName) {
            return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        }
        if (firstName) {
            return firstName.charAt(0).toUpperCase();
        }
        return "U"; // Default User initial
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex flex-col items-center mb-8">
                    <Avatar className="w-32 h-32 mb-4 border-4 border-primary/20 shadow-lg">
                        <AvatarFallback className="text-4xl bg-muted">
                            {getInitials(profile.first_name, profile.last_name)}
                        </AvatarFallback>
                    </Avatar>
                    <h1 className="text-4xl font-bold text-center">{profile.first_name} {profile.last_name}</h1>
                </div>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Mail className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-medium">{profile.email}</p>
                            </div>
                        </div>
                        {profile.phone_number && (
                            <div className="flex items-center gap-4">
                                <Phone className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone Number</p>
                                    <p className="font-medium">{profile.phone_number}</p>
                                </div>
                            </div>
                        )}
                        {profile.country && (
                            <div className="flex items-center gap-4">
                                <Globe className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Country</p>
                                    <p className="font-medium">{profile.country}</p>
                                </div>
                            </div>
                        )}
                        {profile.preferred_language && (
                            <div className="flex items-center gap-4">
                                <Languages className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Preferred Language</p>
                                    <p className="font-medium">{profile.preferred_language}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <UserCircle className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Role</p>
                                <p className="font-medium capitalize">{profile.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {profile.is_active ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                            <div>
                                <p className="text-sm text-muted-foreground">Account Status</p>
                                <p className={`font-medium ${profile.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                    {profile.is_active ? "Active" : "Inactive"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}