// src/app/admin/settings/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-headline text-primary">Settings</h1>
            <p className="text-muted-foreground">Manage your application settings and configurations.</p>
        </div>

        <Tabs defaultValue="payments" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="payments">Payments</TabsTrigger>
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
                        </CardDescription>
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