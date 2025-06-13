import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { UserDropdown } from "./user-dropdown";

export async function AuthButton() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let profile = null;
    if (user) {
        const { data } = await supabase
            .from("profiles")
            .select("role, first_name, picture_url")
            .eq("user_id", user.id)
            .single();

        if (data) {
            profile = {
                role: data.role,
                first_name: data.first_name,
                profile_picture: data.picture_url,
            };
        }
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
