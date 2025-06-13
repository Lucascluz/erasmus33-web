import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export function Navbar() {
    return (
        <nav className="w-full flex flex-col sticky top-0 z-50">
            {/* Bottom Layer */}
            <div className="w-full h-10 z-0" style={{ backgroundImage: 'url(/assets/misc/faixa.png)', backgroundSize: 'cover', position: 'absolute', top: '16px', left: 0 }}></div>

            {/* Top Layer */}
            <div className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-background/80 backdrop-blur-sm shadow-md z-10 relative">
                <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
                    <div className="flex items-center gap-4">
                        <Avatar className="cursor-pointer w-12 h-12">
                            <Link href="/" className="flex items-center justify-center w-full h-full">
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
                        <AuthButton />
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </nav>
    );
}
