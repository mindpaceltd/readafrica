
// src/app/my-books/notifications/page.tsx
import {
    Card,
    CardContent,
  } from "@/components/ui/card";
import { Bell, BookHeart, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

async function getNotifications() {
    const supabase = createClient();
    const { data, error } = await supabase.from('notifications').select('*').order('sent_at', { ascending: false });

    if (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
    return data;
}

const getIcon = (title: string) => {
    if (title.toLowerCase().includes('book')) return <BookHeart className="h-6 w-6 text-primary"/>;
    if (title.toLowerCase().includes('event')) return <Calendar className="h-6 w-6 text-yellow-500"/>;
    return <Bell className="h-6 w-6 text-accent"/>;
}
  
export default async function NotificationsPage() {
    const notifications = await getNotifications();

    return (
      <div>
        <div className="mb-8">
            <h1 className="text-3xl font-headline text-primary">Notifications</h1>
            <p className="text-muted-foreground">Recent announcements and alerts.</p>
        </div>
        <Card>
            <CardContent className="p-0">
                {notifications.length === 0 ? (
                    <div className="text-center text-muted-foreground p-10">
                        You have no notifications.
                    </div>
                ) : (
                    <ul className="divide-y divide-border">
                        {notifications.map((item) => (
                            <li key={item.id} className="flex items-start gap-4 p-4">
                                <div className="mt-1">
                                    {getIcon(item.title)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold">{item.title}</h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm">{item.message}</p>
                                    <p className="text-xs text-muted-foreground/80 mt-2">{new Date(item.sent_at).toLocaleString()}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
      </div>
    );
  }
