"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";
import { UserDropdown } from "./user-dropdown";
import { useEffect, useState } from "react";

interface UserProfile {
    role: string;
    first_name: string;
    profile_picture: string; // We'll map picture_url to this
}

export function AuthButtonClient() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        // Get initial user
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("role, first_name, picture_url")
                    .eq("user_id", user.id)
                    .single();

                if (error) {
                    console.error("Error fetching profile:", error);
                    setProfile(null);
                } else if (data) {
                    setProfile({
                        role: data.role,
                        first_name: data.first_name,
                        profile_picture: data.picture_url,
                    });
                } else {
                    setProfile(null);
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        };

        getUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);

                if (session?.user) {
                    const { data, error } = await supabase
                        .from("profiles")
                        .select("role, first_name, picture_url")
                        .eq("user_id", session.user.id)
                        .single();

                    if (error) {
                        console.error("Error fetching profile:", error);
                        setProfile(null);
                    } else if (data) {
                        setProfile({
                            role: data.role,
                            first_name: data.first_name,
                            profile_picture: data.picture_url,
                        });
                    } else {
                        setProfile(null);
                    }
                } else {
                    setProfile(null);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center gap-4">
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
            </div>
        );
    }

    return user && profile ? (
        <div className="flex items-center gap-4">
            <UserDropdown
                firstName={profile.first_name}
                role={profile.role}
                profilePicture={profile.profile_picture}
            />
        </div>
    ) : (
        <div className="flex items-center gap-4">
            <Button asChild size="sm" variant={"outline"}>
                <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" variant={"default"}>
                <Link href="/auth/sign-up">Sign up</Link>
            </Button>
        </div>
    );
}
