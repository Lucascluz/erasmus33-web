import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export async function Navbar() {
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
    return (
        <nav className="w-full flex flex-col sticky top-0 z-50">
            {/* Bottom Layer */}
            <div className="w-full h-16 z-0" style={{ backgroundImage: 'url(/assets/misc/faixa.png)', backgroundSize: 'cover', position: 'absolute', left: 0 }}></div>

            {/* Top Layer */}
            <div className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background/80 backdrop-blur-sm shadow-md z-10 relative">
                <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
                    <div className="flex items-center gap-4">
                        <Avatar className="cursor-pointer w-12 h-12">
                            <Link href={user ? "/protected" : "/"} className="flex items-center justify-center w-full h-full">
                                <AvatarImage
                                    src="/assets/logo.png"
                                    alt="Erasmus33 Logo"
                                />
                            </Link>
                        </Avatar>

                        <Link href="/protected/houses" className="text-lg font-semibold text-foreground">
                            Houses
                        </Link>

                        <Link href="/protected/rooms" className="ml-4 text-lg font-semibold text-foreground">
                            Rooms
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <AuthButton user={user} profile={profile} />
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </nav>
    );
}
