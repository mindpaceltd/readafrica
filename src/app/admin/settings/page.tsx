
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

// Helper function to convert HSL string to a hex color
const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};


// Helper function to convert hex color to an HSL string
const hexToHsl = (hex: string): string => {
    if (!hex || hex.length < 7) return "0 0% 0%";

    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    // Find min and max values of R, G, B
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
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

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
}


export default function SettingsPage() {

    const [primaryColor, setPrimaryColor] = useState('#4A148C');
    const [accentColor, setAccentColor] = useState('#5E35B1');
    const [backgroundColor, setBackgroundColor] = useState('#F3E5F5');

    useEffect(() => {
        const root = document.documentElement;
        // The HSL values are stored without the var() wrapper.
        // E.g. --primary: 271 70% 31%
        const primaryHsl = getComputedStyle(root).getPropertyValue('--primary').trim();
        const accentHsl = getComputedStyle(root).getPropertyValue('--accent').trim();
        const backgroundHsl = getComputedStyle(root).getPropertyValue('--background').trim();
        
        if (primaryHsl) {
            const [h, s, l] = primaryHsl.split(' ').map(val => parseFloat(val.replace('%', '')));
            if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
              setPrimaryColor(hslToHex(h, s, l));
            }
        }
        if (accentHsl) {
            const [h, s, l] = accentHsl.split(' ').map(val => parseFloat(val.replace('%', '')));
             if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
              setAccentColor(hslToHex(h, s, l));
            }
        }
        if (backgroundHsl) {
            const [h, s, l] = backgroundHsl.split(' ').map(val => parseFloat(val.replace('%', '')));
            if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
             setBackgroundColor(hslToHex(h,s,l));
            }
        }

    }, []);

    const handleColorChange = (colorType: string, value: string) => {
        const root = document.documentElement;
        const hslValue = hexToHsl(value);
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
