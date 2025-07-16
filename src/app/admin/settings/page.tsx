
// src/app/admin/settings/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Helper function to convert hex color to an HSL string, now defined correctly outside the component.
const hexToHslString = (hex: string): string => {
    if (!hex.startsWith('#')) return '';
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
  
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
  
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

export default function SettingsPage() {
    // Default to the correct theme colors.
    const [primaryColor, setPrimaryColor] = useState('#4A148C');
    const [accentColor, setAccentColor] = useState('#5E35B1');
    const [backgroundColor, setBackgroundColor] = useState('#E1BEE7'); // Matching light purple from guidelines

    // This effect runs once on the client to sync the color pickers with the current theme.
    useEffect(() => {
        const root = document.documentElement;
        
        const getHexFromHslVar = (varName: string) => {
            const hslStr = getComputedStyle(root).getPropertyValue(varName).trim();
            if (!hslStr) return null;
            const [h, s, l] = hslStr.split(' ').map(val => parseFloat(val));
            if (isNaN(h) || isNaN(s) || isNaN(l)) return null;

            const s_norm = s / 100;
            const l_norm = l / 100;
            const k = (n: number) => (n + h / 30) % 12;
            const a = s_norm * Math.min(l_norm, 1 - l_norm);
            const f = (n: number) =>
                l_norm - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
            return `#${[0, 8, 4].map(n => Math.round(f(n) * 255).toString(16).padStart(2, '0')).join('')}`;
        };
        
        const initialPrimary = getHexFromHslVar('--primary');
        const initialAccent = getHexFromHslVar('--accent');
        const initialBackground = getHexFromHslVar('--background');

        if(initialPrimary) setPrimaryColor(initialPrimary);
        if(initialAccent) setAccentColor(initialAccent);
        if(initialBackground) setBackgroundColor(initialBackground);

    }, []);

    const handleColorChange = (colorType: string, value: string) => {
        const root = document.documentElement;
        const hslValue = hexToHslString(value);
        if (!hslValue) return;

        if (colorType === 'primary') {
            setPrimaryColor(value);
            root.style.setProperty('--primary', hslValue);
        } else if (colorType === 'accent') {
            setAccentColor(value);
            root.style.setProperty('--accent', hslValue);
        } else if (colorType === 'background') {
            setBackgroundColor(value);
            root.style.setProperty('--background', hslValue);
        }
    };

  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-headline text-primary">Settings</h1>
            <p className="text-muted-foreground">Manage your application settings and configurations.</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="roles">Admin Roles</TabsTrigger>
            </TabsList>
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
                        <Input id="consumer-key" type="password" defaultValue="**************" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="consumer-secret">Consumer Secret</Label>
                        <Input id="consumer-secret" type="password" defaultValue="**************" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="passkey">Passkey</Label>
                        <Input id="passkey" type="password" defaultValue="**************" />
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="appearance">
                <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                        Customize the look and feel of your application.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="primary-color">Primary Color</Label>
                            <div className="relative">
                                <Input id="primary-color" type="color" value={primaryColor} onChange={(e) => handleColorChange('primary', e.target.value)} className="p-1 h-10 w-full" />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="accent-color">Accent Color</Label>
                            <Input id="accent-color" type="color" value={accentColor} onChange={(e) => handleColorChange('accent', e.target.value)} className="p-1 h-10 w-full" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="background-color">Background Color</Label>
                            <Input id="background-color" type="color" value={backgroundColor} onChange={(e) => handleColorChange('background', e.target.value)} className="p-1 h-10 w-full"/>
                        </div>
                    </div>
                    <Button>Save Theme</Button>
                </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="general" className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Site Identity & SEO</CardTitle>
                         <CardDescription>Manage your site's public-facing information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="site-title">Site Title</Label>
                            <Input id="site-title" defaultValue="Prophetic Reads" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="site-description">Site Description</Label>
                            <Textarea id="site-description" defaultValue="E-books and daily devotionals by Dr. Climate Wiseman." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="footer-text">Footer Text</Label>
                            <Textarea id="footer-text" defaultValue="© 2024 Dr. Climate Wiseman. All rights reserved." />
                        </div>
                         <div className="space-y-2">
                            <Label>Site Logo</Label>
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-sm">
                                    Current
                                </div>
                                 <div className="flex-1">
                                    <label htmlFor="logo-upload" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                        <div className="flex flex-col items-center justify-center">
                                            <UploadCloud className="w-8 h-8 text-muted-foreground"/>
                                            <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                                        </div>
                                        <Input id="logo-upload" type="file" className="hidden" />
                                    </label>
                                 </div>
                            </div>
                        </div>
                         <Button>Save SEO Info</Button>
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
                            <Switch aria-label="Maintenance mode" />
                        </div>
                         <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <h3 className="font-medium">Allow New Registrations</h3>
                                <p className="text-sm text-muted-foreground">
                                   Control whether new users can register.
                                </p>
                            </div>
                            <Switch defaultChecked aria-label="Allow new registrations" />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="roles">
                 <Card>
                    <CardHeader>
                        <CardTitle>Admin Roles</CardTitle>
                        <CardDescription>
                            Manage roles and permissions for admin users. (Feature coming soon)
                        </Description>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">This section is under development.</p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
