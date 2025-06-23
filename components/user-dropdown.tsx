"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface UserDropdownProps {
    firstName: string;
    lastName: string;
    role: string;
}

export function UserDropdown({ firstName, lastName, role }: UserDropdownProps) {
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

    // Generate initials from first and last name
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/60 transition-colors">
                <Avatar className="cursor-pointer">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(firstName, lastName)}
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