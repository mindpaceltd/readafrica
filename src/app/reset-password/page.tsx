
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  // The password reset flow in Supabase uses a code in the URL fragment.
  // We need to check for it on the client side.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes('access_token')) {
        setError("Invalid or expired password reset link.");
        toast({
            title: "Invalid Link",
            description: "The password reset link is not valid. Please request a new one.",
            variant: "destructive"
        });
        router.push('/forgot-password');
    }
  }, [router, toast]);


  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        toast({
            title: "Passwords do not match",
            variant: "destructive",
        });
        return;
    }
    setIsSubmitting(true);
    
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        toast({
            title: "Password Reset Failed",
            description: error.message,
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }

    toast({
        title: "Password Updated!",
        description: "Your password has been successfully reset. You can now log in.",
        className: 'bg-green-600 border-green-600 text-white',
    });
    router.push('/login');
  };

  if(error) {
      return (
         <div className="min-h-screen bg-background flex items-center justify-center p-4">
             <Card className="w-full max-w-sm text-center">
                 <CardHeader>
                     <CardTitle className="text-destructive">Error</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p>{error}</p>
                    <Button asChild className="mt-4">
                        <Link href="/forgot-password">Request a new link</Link>
                    </Button>
                 </CardContent>
             </Card>
         </div>
      )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">
            Set New Password
          </CardTitle>
          <CardDescription>
            Enter and confirm your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordResetSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
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
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
