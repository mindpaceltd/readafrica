// src/app/volunteer/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Handshake, Heart, Send } from "lucide-react";

export default function VolunteerPage() {
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
                <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="Your Name" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="you@example.com" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+254 712 345 678" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="interests">How would you like to help?</Label>
                        <Textarea id="interests" placeholder="e.g., Event organization, content translation, prayer team, etc." rows={5} />
                    </div>
                    <Button type="submit" className="w-full">
                        <Send className="mr-2" />
                        Submit Application
                    </Button>
                </form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}