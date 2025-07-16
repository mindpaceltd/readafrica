
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, KeyRound, Shield, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
        toast({
            title: "Login Failed",
            description: error?.message || "An unknown error occurred.",
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }
    
    toast({
        title: "Login Successful!",
        description: "Redirecting...",
        className: 'bg-green-600 border-green-600 text-white',
    });

    router.refresh();

    // Fetch profile to determine where to redirect
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, role')
        .eq('id', data.user.id)
        .single();
    
    if (profile?.is_admin) {
        router.push('/admin');
    } else if (profile?.role === 'publisher') {
        router.push('/publisher');
    } else {
        router.push('/my-books');
    }

  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-4">
                <Shield />
            </div>
          <CardTitle className="font-headline text-2xl">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    required 
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" passHref className="text-sm text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
               <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    id="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    required 
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                  <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline">
                    Sign Up
                </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
