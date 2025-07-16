// src/app/my-books/profile/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Trash2, HeartHandshake } from "lucide-react";

export default function ProfilePage() {
  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-headline text-primary">My Profile</h1>
            <p className="text-muted-foreground">View and update your account details.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Changes will be saved automatically.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src="https://placehold.co/100x100" />
                                <AvatarFallback>B</AvatarFallback>
                            </Avatar>
                            <Button variant="outline">
                                <Camera className="mr-2" />
                                Change Avatar
                            </Button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" defaultValue="Brayan" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" defaultValue="+254712345678" readOnly />
                            </div>
                        </div>
                        <div>
                            <Button>Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-destructive">Delete Account</CardTitle>
                         <CardDescription>
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive">
                            <Trash2 className="mr-2"/>
                            Delete My Account
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <HeartHandshake className="text-primary"/>
                            Support the Ministry
                        </CardTitle>
                        <CardDescription>
                            Your generous contribution helps us spread the word and continue our work.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full">Donate Now</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
