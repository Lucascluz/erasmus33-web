import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon, Home, Building, Users, User, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Get user profile information
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", data.user.id)
    .single();

  const userName = profile?.first_name && profile?.last_name
    ? `${profile.first_name} ${profile.last_name}`
    : data.user.email?.split('@')[0] || 'User';

  const userRole = profile?.role || 'Student';
  const memberSince = new Date(data.user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex-1 w-full flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your personalized dashboard for Erasmus33 housing.
          </p>
        </div>

        <div className="bg-accent text-sm p-4 px-6 rounded-lg text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          You are successfully logged in and have access to all protected features.
        </div>
      </div>

      {/* User Info Cards */}
      <div className="flex flex-col sm:flex-row sm:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
        {/* Profile Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Summary
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{data.user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Role</p>
              <Badge variant="secondary">{userRole}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Member since</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {memberSince}
              </p>
            </div>
            {profile?.country && (
              <div>
                <p className="text-sm font-medium">Country</p>
                <p className="text-sm text-muted-foreground">{profile.country}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and navigation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/protected/houses" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Building className="mr-2 h-4 w-4" />
                Browse Houses
              </Button>
            </Link>
            <Link href="/protected/rooms" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                View Available Rooms
              </Button>
            </Link>
            <Link href="/profile" className="block">
              <Button variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                View Full Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Admin Actions (if applicable) */}
        {userRole === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Admin Panel
              </CardTitle>
              <CardDescription>Administrative functions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/houses" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Building className="mr-2 h-4 w-4" />
                  Manage Houses
                </Button>
              </Link>
              <Link href="/admin/rooms" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Manage Rooms
                </Button>
              </Link>
              <Link href="/admin/users" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
