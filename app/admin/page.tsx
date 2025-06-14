import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Home, Settings, Bed } from "lucide-react";
import Link from "next/link";

interface AdminProfile {
    user_id: string;
    role: string;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
}

async function checkAdminAccess(): Promise<AdminProfile> {
    const supabase = await createClient();

    // Get the current user
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/auth/login");
    }

    // Get user profile with role information
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id, role, first_name, last_name, email, is_active")
        .eq("user_id", user.id)
        .single();

    if (profileError || !profile) {
        redirect("/auth/login");
    }

    // Check if user is admin
    if (profile.role !== "admin") {
        redirect("/protected");
    }

    return profile as AdminProfile;
}

async function getAdminStats() {
    const supabase = await createClient();

    // Get total users count
    const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

    // Get active users count
    const { count: activeUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

    // Get total houses count
    const { count: totalHouses } = await supabase
        .from("houses")
        .select("*", { count: "exact", head: true });

    // Get total rooms count
    const { count: totalRooms } = await supabase
        .from("rooms")
        .select("*", { count: "exact", head: true });

    return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalHouses: totalHouses || 0,
        totalRooms: totalRooms || 0,
    };
}

export default async function AdminPage() {
    // Verify admin access first
    const adminProfile = await checkAdminAccess();
    const stats = await getAdminStats();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="container mx-auto px-8 md:px-12 lg:px-20 xl:px-32 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground">
                            Welcome back, {adminProfile.first_name}!
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Administrator
                    </Badge>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-8 md:px-12 lg:px-20 xl:px-32 py-8">

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.activeUsers} active users
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <Users className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Houses</CardTitle>
                            <Home className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalHouses}</div>
                            <p className="text-xs text-muted-foreground">
                                Listed properties
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalRooms}</div>
                            <p className="text-xs text-muted-foreground">
                                Available rooms
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link href="/admin/users">
                                <div className="p-4 border rounded-lg hover:bg-accent hover:cursor-pointer transition-colors">
                                    <Users className="h-8 w-8 text-primary mb-2" />
                                    <h3 className="font-semibold">Manage Users</h3>
                                    <p className="text-sm text-muted-foreground">
                                        View and manage user accounts
                                    </p>
                                </div>
                            </Link>
                            <Link href="/admin/houses">
                                <div className="p-4 border rounded-lg hover:bg-accent hover:cursor-pointer transition-colors">
                                    <Home className="h-8 w-8 text-primary mb-2" />
                                    <h3 className="font-semibold">Manage Houses</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Add, edit, or remove houses
                                    </p>
                                </div>
                            </Link>
                            <Link href="/admin/rooms">
                                <div className="p-4 border rounded-lg hover:bg-accent hover:cursor-pointer transition-colors">
                                    <Bed className="h-8 w-8 text-primary mb-2" />
                                    <h3 className="font-semibold">Manage Rooms</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Add, edit, or remove rooms
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}