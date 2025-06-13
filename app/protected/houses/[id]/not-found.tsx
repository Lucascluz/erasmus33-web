import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="space-y-4">
                <Home className="w-16 h-16 mx-auto text-muted-foreground" />
                <h1 className="text-3xl font-bold">House Not Found</h1>
                <p className="text-muted-foreground max-w-md">
                    The house you're looking for doesn't exist or may have been removed from our listings.
                </p>
            </div>

            <div className="flex gap-4">
                <Button asChild>
                    <Link href="/protected/houses">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Houses
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/protected">
                        Go Home
                    </Link>
                </Button>
            </div>
        </div>
    );
}
