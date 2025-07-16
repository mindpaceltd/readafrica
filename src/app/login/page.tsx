// src/app/login/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Phone } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call Firebase Auth to send an OTP
    console.log("Sending OTP...");
    setStep("otp");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would verify the OTP with Firebase Auth
    console.log("Verifying OTP...");
    // On success, redirect the user
  };


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-4">
                {step === 'phone' ? <Phone/> : <KeyRound />}
            </div>
          <CardTitle className="font-headline text-2xl">
            {step === "phone" ? "Login or Register" : "Enter OTP"}
          </CardTitle>
          <CardDescription>
            {step === "phone"
              ? "Enter your phone number to receive a one-time password."
              : "Check your phone for the code we sent you."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+254 712 345 678" required />
              </div>
              <Button type="submit" className="w-full">
                Send Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input id="otp" type="text" inputMode="numeric" pattern="\d{6}" placeholder="123456" required />
              </div>
              <Button type="submit" className="w-full">
                Verify & Login
              </Button>
               <Button variant="link" size="sm" className="w-full" onClick={() => setStep('phone')}>
                Use a different phone number
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}