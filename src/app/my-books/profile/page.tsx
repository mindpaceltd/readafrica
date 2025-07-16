
// src/app/my-books/profile/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Trash2, HeartHandshake, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ full_name: string | null, avatar_url: string | null } | null>(null);
  const [fullName, setFullName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data, error } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', user.id)
            .single();
        
        if (error) {
            toast({ title: "Error fetching profile", description: error.message, variant: "destructive" });
        } else if (data) {
            setProfile(data);
            setFullName(data.full_name || '');
            setAvatarPreview(data.avatar_url);
        }
      }
      setLoading(false);
    }
    fetchProfile();
  }, [supabase, toast]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    let avatarUrl = profile?.avatar_url;

    if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile);

        if (uploadError) {
            toast({ title: "Avatar Upload Failed", description: uploadError.message, variant: "destructive" });
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatarUrl = publicUrl;
    }

    const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, avatar_url: avatarUrl })
        .eq('id', user.id);

    if (error) {
        toast({ title: "Profile Update Failed", description: error.message, variant: "destructive" });
    } else {
        toast({ title: "Profile Updated!", className: "bg-green-600 text-white border-green-600" });
        if (avatarUrl) {
            setAvatarPreview(avatarUrl);
        }
        setAvatarFile(null);
    }
  }
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  if (loading) {
      return <ProfileSkeleton />;
  }

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
                        <CardDescription>Changes are saved when you click the button.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={avatarPreview || "https://placehold.co/100x100"} />
                                    <AvatarFallback>{fullName.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <Button asChild variant="outline">
                                    <Label htmlFor="avatar-upload">
                                        <Camera className="mr-2" />
                                        Change Avatar
                                    </Label>
                                </Button>
                                <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" value={user?.email || ''} readOnly disabled />
                                </div>
                            </div>
                            <div>
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <h3 className="font-semibold">Logout</h3>
                            <p className="text-sm text-muted-foreground mb-2">Log out of your current session.</p>
                            <Button variant="outline" onClick={handleLogout}>
                                <LogOut className="mr-2"/>
                                Logout
                            </Button>
                        </div>
                         <div>
                            <h3 className="font-semibold text-destructive">Delete Account</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            <Button variant="destructive">
                                <Trash2 className="mr-2"/>
                                Delete My Account
                            </Button>
                        </div>
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

function ProfileSkeleton() {
    return (
        <div>
        <div className="mb-8">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-64 mt-2" />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-40" />
                        <Skeleton className="h-5 w-56 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <Skeleton className="h-10 w-36" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div>
                           <Skeleton className="h-10 w-32" />
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-40" />
                    </CardHeader>
                    <CardContent>
                       <Skeleton className="h-10 w-44" />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1">
                 <Card>
                    <CardHeader>
                       <Skeleton className="h-7 w-48" />
                       <Skeleton className="h-5 w-full mt-2" />
                       <Skeleton className="h-5 w-3/4 mt-1" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
    )
}

    