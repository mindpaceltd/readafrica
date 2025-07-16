
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail, KeyRound, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, you would handle authentication here.
    // We'll simulate a successful login and redirect.
    console.log(`Logging in as ${isAdmin ? 'Admin' : 'User'}...`);

    setTimeout(() => {
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/my-books');
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-4">
                {isAdmin ? <Shield /> : <Mail />}
            </div>
          <CardTitle className="font-headline text-2xl">
            {isAdmin ? "Admin Login" : "User Login"}
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" required className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
               <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" required className="pl-10"/>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="role-switch" className="flex flex-col space-y-1">
                <span>Login as Admin</span>
                <span className="font-normal leading-snug text-muted-foreground text-xs">
                  Toggle to access the admin dashboard.
                </span>
              </Label>
              <Switch
                id="role-switch"
                checked={isAdmin}
                onCheckedChange={setIsAdmin}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
