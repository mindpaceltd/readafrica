// src/app/volunteer/page.tsx
'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Handshake, Heart, Send, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitVolunteerForm } from "@/app/actions";

export default function VolunteerPage() {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        interests: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value}));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await submitVolunteerForm(formData);
            setIsSubmitted(true);
        } catch (error) {
            toast({
                title: 'Submission Failed',
                description: 'An error occurred while submitting your application.',
                variant: 'destructive'
            });
        } finally {
            setIsSubmitting(false);
        }
    }
  
    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-muted/40 py-12 px-4 flex items-center justify-center">
                 <div className="text-center p-8">
                    <div className="inline-block bg-green-500 text-white p-4 rounded-full mb-4">
                        <CheckCircle className="h-12 w-12"/>
                    </div>
                    <h1 className="text-3xl font-headline text-primary">Thank You!</h1>
                    <p className="mt-2 text-lg text-muted-foreground">Your application has been received. We'll be in touch soon.</p>
                </div>
            </div>
        )
    }

  return (
    <div className="min-h-screen bg-muted/40 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
            <div className="inline-block bg-primary text-primary-foreground p-4 rounded-full mb-4">
                <Handshake className="h-10 w-10"/>
            </div>
            <h1 className="text-4xl md:text-5xl font-headline text-primary">Join the Ministry Team</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Become a vital part of our mission to spread the prophetic word. Your time and talents can make an eternal impact.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Volunteer Sign-up</CardTitle>
                <CardDescription>
                    Fill out the form below and we'll get in touch with you about opportunities to serve.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input id="full_name" placeholder="Your Name" required value={formData.full_name} onChange={handleInputChange} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="you@example.com" required value={formData.email} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input id="phone_number" type="tel" placeholder="+254 712 345 678" value={formData.phone_number} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="interests">How would you like to help?</Label>
                        <Textarea id="interests" placeholder="e.g., Event organization, content translation, prayer team, etc." rows={5} value={formData.interests} onChange={handleInputChange} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <Loader2 className="mr-2 animate-spin" />
                        ) : (
                            <Send className="mr-2" />
                        )}
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                </form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
