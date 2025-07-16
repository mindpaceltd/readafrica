// src/app/admin/activity-logs/page.tsx
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const activityLogs = [
    { id: 1, admin: 'admin@propheticreads.com', adminName: 'Admin User', action: 'Created Book', details: 'Added "The Divine Key"', timestamp: '2023-11-01 10:30 AM' },
    { id: 2, admin: 'editor@propheticreads.com', adminName: 'Editor User', action: 'Updated Book', details: 'Edited "Breaking Free"', timestamp: '2023-11-01 09:45 AM' },
    { id: 3, admin: 'admin@propheticreads.com', adminName: 'Admin User', action: 'Sent Notification', details: 'Sent "New Book Available!"', timestamp: '2023-10-31 05:00 PM' },
    { id: 4, admin: 'admin@propheticreads.com', adminName: 'Admin User', action: 'Updated Settings', details: 'Changed site title', timestamp: '2023-10-31 04:15 PM' },
    { id: 5, admin: 'editor@propheticreads.com', adminName: 'Editor User', action: 'Created Plan', details: 'Added "Platinum Tier"', timestamp: '2023-10-30 11:00 AM' },
];
  
export default function ActivityLogsPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-headline text-primary">Admin Activity Logs</h1>
                <p className="text-muted-foreground">A record of all actions taken in the admin panel.</p>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Admin</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Timestamp</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {activityLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback>{log.adminName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-0.5">
                                            <p className="font-medium">{log.adminName}</p>
                                            <p className="text-xs text-muted-foreground">{log.admin}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={
                                        log.action.includes('Create') || log.action.includes('Sent') ? 'default' :
                                        log.action.includes('Update') ? 'secondary' :
                                        'destructive'
                                    } className={log.action.includes('Create') || log.action.includes('Sent') ? 'bg-blue-600' : ''}>{log.action}</Badge>
                                </TableCell>
                                <TableCell>{log.details}</TableCell>
                                <TableCell>{log.timestamp}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
