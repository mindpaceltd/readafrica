
// src/app/admin/settings/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/lib/database.types";
import Image from "next/image";

type Settings = Tables<'app_settings'>;

export default function SettingsPage() {
    const supabase = createClient();
    const { toast } = useToast();
    const [settings, setSettings] = useState<Partial<Settings>>({});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('app_settings').select('*').eq('id', 1).single();
            if (error) {
                toast({ title: "Error fetching settings", description: error.message, variant: 'destructive' });
            } else if (data) {
                setSettings(data);
                if (data.logo_url) {
                    setLogoPreview(data.logo_url);
                }
            }
            setLoading(false);
        };
        fetchSettings();
    }, [supabase, toast]);
    

    const handleInputChange = (field: keyof Settings, value: any) => {
        setSettings(prev => ({...prev, [field]: value}));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };
    
    const handleSave = async (dataToSave: Partial<Settings>) => {
        setIsSubmitting(true);
        const { error } = await supabase.from('app_settings').update(dataToSave).eq('id', 1);

        if (error) {
            toast({ title: "Save failed", description: error.message, variant: 'destructive' });
        } else {
            toast({ title: "Settings saved successfully!" });
        }
        setIsSubmitting(false);
    };

    const handleSeoSave = async () => {
        let logo_url = settings.logo_url;
        if (logoFile) {
            const fileExt = logoFile.name.split('.').pop();
            const filePath = `public/${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('logos').upload(filePath, logoFile);
            if (uploadError) {
                toast({ title: "Logo upload failed", description: uploadError.message, variant: 'destructive' });
                return;
            }
            const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(filePath);
            logo_url = publicUrl;
        }
        await handleSave({ 
            site_title: settings.site_title, 
            site_description: settings.site_description, 
            footer_text: settings.footer_text,
            logo_url: logo_url
        });
    }

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-headline text-primary">Settings</h1>
            <p className="text-muted-foreground">Manage your application settings and configurations.</p>
        </div>

        {loading ? (
             <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        ) : (
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="roles">Admin Roles</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Site Identity & SEO</CardTitle>
                            <CardDescription>Manage your site's public-facing information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="site-title">Site Title</Label>
                                <Input id="site-title" value={settings.site_title || ''} onChange={e => handleInputChange('site_title', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="site-description">Site Description</Label>
                                <Textarea id="site-description" value={settings.site_description || ''} onChange={e => handleInputChange('site_description', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="footer-text">Footer Text</Label>
                                <Textarea id="footer-text" value={settings.footer_text || ''} onChange={e => handleInputChange('footer_text', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Site Logo</Label>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-sm relative overflow-hidden">
                                        {logoPreview ? <Image src={logoPreview} alt="Logo Preview" fill className="object-contain" /> : 'Current'}
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="logo-upload" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                            <div className="flex flex-col items-center justify-center">
                                                <UploadCloud className="w-8 h-8 text-muted-foreground"/>
                                                <p className="text-sm text-muted-foreground text-center px-1"><span className="font-semibold">Click to upload</span></p>
                                                {logoFile && <p className="text-xs text-green-500 mt-1 truncate max-w-full px-2">{logoFile.name}</p>}
                                            </div>
                                            <Input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleLogoChange}/>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <Button onClick={handleSeoSave} disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                                Save SEO Info
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Application Settings</CardTitle>
                            <CardDescription>
                                Manage general application configurations.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <h3 className="font-medium">Maintenance Mode</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Temporarily disable user access to the app.
                                    </p>
                                </div>
                                <Switch checked={settings.maintenance_mode} onCheckedChange={(val) => handleSave({ maintenance_mode: val })} aria-label="Maintenance mode" />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <h3 className="font-medium">Allow New Registrations</h3>
                                    <p className="text-sm text-muted-foreground">
                                    Control whether new users can register.
                                    </p>
                                </div>
                                <Switch checked={settings.allow_registrations} onCheckedChange={(val) => handleSave({ allow_registrations: val })} aria-label="Allow new registrations" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="payments">
                    <Card>
                    <CardHeader>
                        <CardTitle>Payment Gateway</CardTitle>
                        <CardDescription>
                            Configure your M-Pesa Daraja API keys for processing payments.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="consumer-key">Consumer Key</Label>
                            <Input id="consumer-key" type="password" value={settings.mpesa_consumer_key || ''} onChange={e => handleInputChange('mpesa_consumer_key', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="consumer-secret">Consumer Secret</Label>
                            <Input id="consumer-secret" type="password" value={settings.mpesa_consumer_secret || ''} onChange={e => handleInputChange('mpesa_consumer_secret', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passkey">Passkey</Label>
                            <Input id="passkey" type="password" value={settings.mpesa_passkey || ''} onChange={e => handleInputChange('mpesa_passkey', e.target.value)} />
                        </div>
                        <Button 
                            onClick={() => handleSave({ 
                                mpesa_consumer_key: settings.mpesa_consumer_key, 
                                mpesa_consumer_secret: settings.mpesa_consumer_secret, 
                                mpesa_passkey: settings.mpesa_passkey 
                            })}
                            disabled={isSubmitting}
                        >
                             {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="roles">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Roles</CardTitle>
                            <CardDescription>
                                Manage roles and permissions for admin users. (Feature coming soon)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">This section is under development.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        )}
    </div>
  );
}
