"use client";

import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
    Shield,
    Users,
    ArrowLeft,
    Search,
    Filter,
    MoreVertical,
    UserCheck,
    UserX,
    Mail,
    Phone,
    Globe
} from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

interface UserProfile {
    user_id: string;
    country: string;
    preferred_language: string;
    role: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    picture_url: string;
    is_active: boolean;
    created_at?: string;
}


function getUserInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function getRoleBadgeVariant(role: string): "default" | "secondary" | "destructive" | "outline" {
    switch (role) {
        case "admin":
            return "destructive";
        case "user":
            return "secondary";
        default:
            return "outline";
    }
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

async function handleUserActivation(userId: string, isActive: boolean, setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>) {
    const supabase = createClient();

    const { error } = await supabase
        .from("profiles")
        .update({ is_active: !isActive })
        .eq("user_id", userId);

    if (error) {
        console.error("Error updating user activation status:", error);
    } else {
        // Refresh only the updated user
        const { data: updatedUser, error: fetchError } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (!fetchError && updatedUser) {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.user_id === userId ? updatedUser : user
                )
            );
        }
    }
}

export default function UsersManagementPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const [filterOption, setFilterOption] = useState<string | null>(null); // State for filter options

    useEffect(() => {
        async function fetchUsers() {
            const supabase = await createClient();
            const { data, error } = await supabase.from("profiles").select("*");
            if (!error) {
                setUsers(data as UserProfile[]);
            }
        }
        fetchUsers();
    }, []);

    // Filter users based on search query and filter options
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
            const matchesSearch = (
                fullName.includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const matchesFilter = filterOption
                ? filterOption === "active"
                    ? user.is_active
                    : filterOption === "inactive"
                        ? !user.is_active
                        : user.role === filterOption
                : true;
            return matchesSearch && matchesFilter;
        });
    }, [users, searchQuery, filterOption]);

    // Verify admin access first

    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.is_active).length;
    const adminUsers = users.filter(user => user.role === "admin").length;
    const regularUsers = users.filter(user => user.role === "user").length;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="container mx-auto px-8 md:px-12 lg:px-20 xl:px-32 py-4">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold">User Management</h1>
                            <p className="text-sm text-muted-foreground">
                                Manage all user accounts and permissions
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Users</p>
                                    <p className="text-2xl font-bold">{totalUsers}</p>
                                </div>
                                <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Active Users</p>
                                    <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
                                </div>
                                <UserCheck className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Administrators</p>
                                    <p className="text-2xl font-bold text-red-600">{adminUsers}</p>
                                </div>
                                <Shield className="h-8 w-8 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Regular Users</p>
                                    <p className="text-2xl font-bold text-blue-600">{regularUsers}</p>
                                </div>
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-80">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="pl-10 pr-4 py-2 w-full border border-input bg-background rounded-md text-sm"
                                        value={searchQuery} // Bind input value to state
                                        onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
                                    />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white"
                                        >
                                            <Filter className="h-4 w-4" />
                                            {filterOption ? `Filter: ${filterOption}` : "Filter"}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem onClick={() => setFilterOption(null)}>
                                            All Users
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFilterOption("admin")}>
                                            Administrators
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFilterOption("user")}>
                                            Regular Users
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFilterOption("active")}>
                                            Active Users
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFilterOption("inactive")}>
                                            Inactive Users
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Users List */}
                <div className="grid gap-4">
                    {filteredUsers.map((user) => (
                        <Card key={user.user_id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 bg-primary text-primary-foreground">
                                            {user.picture_url ? (
                                                <Image
                                                    src={user.picture_url}
                                                    alt={`${user.first_name} ${user.last_name}`}
                                                    width={48}
                                                    height={48}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm font-semibold">
                                                    {getUserInitials(user.first_name, user.last_name)}
                                                </span>
                                            )}
                                        </Avatar>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-lg">
                                                    {user.first_name} {user.last_name}
                                                </h3>
                                                <Badge variant={getRoleBadgeVariant(user.role)}>
                                                    {user.role}
                                                </Badge>
                                                {!user.is_active && (
                                                    <Badge variant="outline" className="text-red-600 border-red-600">
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </div>
                                                {user.phone_number && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {user.phone_number}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <Globe className="h-3 w-3" />
                                                    {user.country}
                                                </div>
                                            </div>

                                            {user.created_at && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Joined {formatDate(user.created_at)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1">
                                            {user.is_active ? (
                                                <UserCheck className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <UserX className="h-4 w-4 text-red-600" />
                                            )}
                                            <span className="text-sm text-muted-foreground">
                                                {user.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="p-1">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    className={`hover:bg-${user.is_active ? "red-500" : "green-500"}`}
                                                    onClick={() => handleUserActivation(user.user_id, user.is_active, setUsers)}
                                                >
                                                    {user.is_active ? "Deactivate" : "Activate"}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredUsers.length === 0 && (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No users found</h3>
                            <p className="text-muted-foreground">
                                There are no users in the system yet.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
