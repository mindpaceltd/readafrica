// src/app/admin/settings/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

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
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        let d = max - min;
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
    const [backgroundColor, setBackgroundColor] = useState('#F3E5F5'); // light purple E1BEE7 is not good for a light bg

    useEffect(() => {
        // On mount, get colors from CSS variables
        const root = document.documentElement;
        const primaryHsl = getComputedStyle(root).getPropertyValue('--primary').trim();
        const accentHsl = getComputedStyle(root).getPropertyValue('--accent').trim();
        const backgroundHsl = getComputedStyle(root).getPropertyValue('--background').trim();

        if (primaryHsl) {
            const [h, s, l] = primaryHsl.split(' ').map(parseFloat);
            setPrimaryColor(hslToHex(h, s, l));
        }
        if (accentHsl) {
            const [h, s, l] = accentHsl.split(' ').map(parseFloat);
            setAccentColor(hslToHex(h, s, l));
        }
        if (backgroundHsl) {
            const [h, s, l] = backgroundHsl.split(' ').map(parseFloat);
            setBackgroundColor(hslToHex(h,s,l));
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

        <Tabs defaultValue="payments" className="w-full">
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
            <TabsContent value="general">
                 <Card>
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
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