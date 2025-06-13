"use client";

import { cn } from "@/lib/utils/utils";
import { createClient } from "@/lib/supabase/client";
import { getAuthRedirectUrl } from "@/lib/utils/site-url";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const redirectUrl = getAuthRedirectUrl("/auth/confirm-email");
      console.log("Sign-up redirect URL:", redirectUrl);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },

      });

      if (signUpError) throw signUpError;

      const userId = data.user?.id;
      if (!userId) throw new Error("Failed to retrieve user ID.");

      let profilePictureUrl = "";
      if (profilePicture) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("profile_pictures")
          .upload(`${userId}/${profilePicture.name}`, profilePicture);

        if (uploadError) throw uploadError;

        profilePictureUrl = supabase.storage
          .from("profile_pictures")
          .getPublicUrl(uploadData?.path || "").data?.publicUrl || "";
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        country: country,
        preferred_language: preferredLanguage,
        role: "user",
        email: email,
        picture_url: profilePictureUrl,
        is_active: false,
      });

      if (profileError) throw profileError;

      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 max-w-4xl mx-auto", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  type="text"
                  placeholder="Your First Name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  type="text"
                  placeholder="Your Last Name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="Your Phone Number"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="Your Country"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="preferred-language">Preferred Language</Label>
                <Input
                  id="preferred-language"
                  type="text"
                  placeholder="Your Preferred Language"
                  required
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repeat-password">Repeat Password</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="profile-picture">Profile Picture</Label>
                <Input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setProfilePicture(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? "Creating an account..." : "Sign up"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
