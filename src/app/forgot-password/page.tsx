
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
        toast({
            title: "Error Sending Email",
            description: error.message,
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }

    toast({
        title: "Check your email!",
        description: "We've sent a password reset link to your email address.",
        className: 'bg-green-600 border-green-600 text-white',
    });

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">
            Forgot Password
          </CardTitle>
          <CardDescription>
            Enter your email and we'll send you a link to reset it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordResetRequest} className="space-y-6">
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
                <Link href="/login" className="text-primary hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
