import Link from "next/link";
import { Button } from "./ui/button";
import { UserDropdown } from "./user-dropdown";
import type { User } from "@supabase/supabase-js";

interface Profile {
    role: string;
    first_name: string;
    profile_picture: string | null;
}

interface AuthButtonProps {
    user: User | null;
    profile: Profile | null;
}

export function AuthButton({ user, profile }: AuthButtonProps) {

    return user && profile ? (
        <div className="flex items-center gap-4">
            <UserDropdown
                firstName={profile.first_name}
                role={profile.role}
                profilePicture={profile.profile_picture ?? undefined}
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
