
// src/app/admin/notifications/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

export default function NotificationsPage() {
    const { toast } = useToast();
    const supabase = createClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        target_audience: 'all'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value}));
    };
    
    const handleSelectChange = (value: string) => {
        setFormData(prev => ({...prev, target_audience: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from('notifications').insert({
            ...formData,
            created_by: user?.id || null,
        });

        if (error) {
            toast({ title: "Failed to send notification", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Notification Sent!", description: "Your message has been queued for delivery." });
            setFormData({ title: '', message: '', target_audience: 'all' });
        }
        setIsSubmitting(false);
    }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-headline text-primary">Send Notification</h1>
        <p className="text-muted-foreground">Send custom messages or alerts to your users.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-full w-fit mb-4">
                <Bell />
            </div>
          <CardTitle className="text-center">Compose Message</CardTitle>
          <CardDescription className="text-center">
            This message will be sent as a push notification to the selected user group.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="E.g., New Book Available!" required value={formData.title} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your notification message..." rows={5} required value={formData.message} onChange={handleInputChange}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="target">Target Audience</Label>
                <Select value={formData.target_audience} onValueChange={handleSelectChange}>
                    <SelectTrigger id="target">
                        <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="purchased">Users with Purchases</SelectItem>
                        <SelectItem value="no-purchase">Users with No Purchases</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                    <Loader2 className="mr-2 animate-spin" /> Sending...
                </>
              ) : (
                <>
                    <Send className="mr-2" /> Send Notification
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
