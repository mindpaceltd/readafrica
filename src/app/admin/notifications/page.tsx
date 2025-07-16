// src/app/admin/notifications/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Send } from "lucide-react";

export default function NotificationsPage() {
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
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="E.g., New Book Available!" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your notification message..." rows={5} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="target">Target Audience</Label>
                <Select>
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
            <Button type="submit" className="w-full">
              <Send className="mr-2" />
              Send Notification
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}