
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, KeyRound, User, Shield, Eye, EyeOff, Book, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Role = 'reader' | 'publisher';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('reader');

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
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
            full_name: fullName,
            role: selectedRole
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

    if (data.user && data.user.identities?.length === 0) {
      toast({
            title: "Email already in use",
            description: "An account with this email already exists. Please try logging in.",
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }

    toast({
        title: "Sign Up Successful!",
        description: "Please check your email to verify your account and then log in.",
        className: 'bg-green-600 border-green-600 text-white',
        duration: 8000
    });
    
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-4">
                <Shield />
            </div>
          <CardTitle className="font-headline text-2xl">
            Create an Account
          </CardTitle>
          <CardDescription>
            Join africanreads to start your journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignupSubmit} className="space-y-4">
             <div className="space-y-2">
                <Label>I want to join as a:</Label>
                <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setSelectedRole('reader')} className={cn("flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all", selectedRole === 'reader' ? 'border-primary bg-primary/10' : 'hover:bg-muted')}>
                        <Book className="h-8 w-8 text-primary mb-2" />
                        <span className="font-semibold">Reader</span>
                        <span className="text-xs text-muted-foreground text-center">Browse and read books from our collection</span>
                    </button>
                    <button type="button" onClick={() => setSelectedRole('publisher')} className={cn("flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all", selectedRole === 'publisher' ? 'border-primary bg-primary/10' : 'hover:bg-muted')}>
                        <UploadCloud className="h-8 w-8 text-primary mb-2" />
                        <span className="font-semibold">Publisher</span>
                         <span className="text-xs text-muted-foreground text-center">Upload and manage your books for readers</span>
                    </button>
                </div>
             </div>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
               <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    required 
                    className="pl-10 pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                  <span className="sr-only">{showConfirmPassword ? 'Hide password' : 'Show password'}</span>
                </button>
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
