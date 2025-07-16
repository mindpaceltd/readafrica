// src/app/admin/activity-logs/page.tsx
import {
    Card,
    CardContent,
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
import { createClient } from "@/lib/supabase/server";

async function getActivityLogs() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('activity_logs')
        .select(`
            *,
            profiles (
                full_name,
                avatar_url
            )
        `)
        .order('timestamp', { ascending: false });

    if (error) {
        console.error("Error fetching activity logs:", error);
        return [];
    }
    return data;
}

export default async function ActivityLogsPage() {
    const activityLogs = await getActivityLogs();
    
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
                        {activityLogs.length === 0 && (
                             <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No activity logs found.
                                </TableCell>
                            </TableRow>
                        )}
                        {activityLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            {/* @ts-ignore */}
                                            <AvatarImage src={log.profiles?.avatar_url || ''} />
                                            <AvatarFallback>
                                                {/* @ts-ignore */}
                                                {log.profiles?.full_name?.charAt(0) || 'A'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-0.5">
                                            {/* @ts-ignore */}
                                            <p className="font-medium">{log.profiles?.full_name || 'Unknown Admin'}</p>
                                            <p className="text-xs text-muted-foreground">{log.admin_id}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={
                                        log.action.includes('Create') || log.action.includes('Sent') ? 'default' :
                                        log.action.includes('Update') ? 'secondary' :
                                        'destructive'
                                    } className={log.action.includes('Create') || log.action.includes('Sent') ? 'bg-blue-600' : ''}>
                                        {log.action}
                                    </Badge>
                                </TableCell>
                                <TableCell>{log.details}</TableCell>
                                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
