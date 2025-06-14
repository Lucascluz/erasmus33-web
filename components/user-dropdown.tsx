"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserDropdownProps {
    profilePicture?: string; // Optional, if you want to display a profile picture
    firstName: string;
    role: string;
}

export function UserDropdown({ firstName, role, profilePicture }: UserDropdownProps) {
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();

        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error);
        } else {
            router.push("/auth/login");
            router.refresh(); // Refresh to update auth state
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/60 transition-colors">
                <Avatar className="cursor-pointer">
                    <AvatarImage src={profilePicture} alt="User Avatar" />
                    <AvatarFallback className="bg-gray-500 text-white">
                        {firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <p className="hidden md:block text-sm font-medium text-accent-foreground">
                    Hey, {firstName}!
                </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push("/profile")} className="hover:bg-secondary">
                    Profile
                </DropdownMenuItem>
                {role === "admin" && (
                    <DropdownMenuItem onClick={() => router.push("/admin")} className=" hover:bg-blue-500">
                        Admin
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className=" hover:bg-red-500">
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}