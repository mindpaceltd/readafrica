// src/app/my-books/notifications/page.tsx
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
  } from "@/components/ui/card";
import { Bell, BookHeart, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

  
  const notifications = [
    { 
      id: 1, 
      icon: <BookHeart className="h-6 w-6 text-primary"/>,
      title: 'New Book Available!', 
      description: '"Keys to Kingdom Finance" is now available for purchase.', 
      date: '2 days ago',
      read: false 
    },
    { 
      id: 2, 
      icon: <Bell className="h-6 w-6 text-accent"/>,
      title: 'Daily Devotional Ready', 
      description: 'Your prophetic word for today has arrived.', 
      date: '1 day ago',
      read: false
    },
    { 
      id: 3, 
      icon: <Calendar className="h-6 w-6 text-yellow-500"/>,
      title: 'Upcoming Event', 
      description: 'Live prayer session with Dr. Climate this Friday.', 
      date: '3 days ago',
      read: true 
    },
  ];
  
  export default function NotificationsPage() {
    return (
      <div>
        <div className="mb-8">
            <h1 className="text-3xl font-headline text-primary">Notifications</h1>
            <p className="text-muted-foreground">Recent announcements and alerts.</p>
        </div>
        <Card>
            <CardContent className="p-0">
                <ul className="divide-y divide-border">
                    {notifications.map((item) => (
                        <li key={item.id} className={`flex items-start gap-4 p-4 ${!item.read ? 'bg-muted/50' : ''}`}>
                            <div className="mt-1">
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold">{item.title}</h3>
                                    {!item.read && <Badge>New</Badge>}
                                </div>
                                <p className="text-muted-foreground text-sm">{item.description}</p>
                                <p className="text-xs text-muted-foreground/80 mt-2">{item.date}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      </div>
    );
  }
