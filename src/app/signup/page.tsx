
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, KeyRound, User, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        toast({
            title: "Passwords do not match",
            description: "Please check your passwords and try again.",
            variant: "destructive",
        });
        return;
    }
    setIsSubmitting(true);
    
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
            full_name: fullName,
        },
      },
    });

    if (error) {
        toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }

    if(data.user && data.user.identities && data.user.identities.length === 0) {
        toast({
            title: "Sign Up Error",
            description: "A user with this email already exists but is unconfirmed. Please check your email to confirm your account.",
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }

    toast({
        title: "Check your email!",
        description: "We've sent a confirmation link to your email address.",
        className: 'bg-green-600 border-green-600 text-white',
    });

    // Don't redirect immediately, user needs to confirm email first.
    // They will be redirected from the confirmation link.
    setIsSubmitting(false);
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-4">
                <Shield />
            </div>
          <CardTitle className="font-headline text-2xl">
            Create an Account
          </CardTitle>
          <CardDescription>
            Join Prophetic Reads to start your journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignupSubmit} className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    id="fullName" 
                    type="text" 
                    placeholder="John Doe" 
                    required 
                    className="pl-10"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
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
              <Label htmlFor="password">Password</Label>
               <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
               <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline">
                    Login
                </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
