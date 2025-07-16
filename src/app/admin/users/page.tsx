// src/app/admin/users/page.tsx
'use client';

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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { Tables } from "@/lib/database.types";
import { useToast } from "@/hooks/use-toast";

export default function UsersPage() {
    const supabase = createClient();
    const { toast } = useToast();
    const [users, setUsers] = useState<Tables<'profiles'>[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('profiles').select('*');
            if (error) {
                toast({ title: 'Error fetching users', description: error.message, variant: 'destructive' });
            } else {
                setUsers(data || []);
            }
            setLoading(false);
        };
        fetchUsers();
    }, [supabase, toast]);
  
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-headline text-primary">User Management</h1>
                <p className="text-muted-foreground">View and manage your app users.</p>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Balance</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {loading && <TableRow><TableCell colSpan={5} className="text-center">Loading users...</TableCell></TableRow>}
                        {!loading && users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user.avatar_url || `https://placehold.co/100x100.png`} alt="Avatar" />
                                            <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-0.5">
                                            <p className="font-medium">{user.full_name || 'N/A'}</p>
                                            <p className="text-xs text-muted-foreground">User ID: {user.id}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.phone_number || 'Not provided'}</TableCell>
                                <TableCell>
                                    <Badge variant={user.is_admin ? 'default' : 'secondary'}>{user.is_admin ? 'Admin' : 'User'}</Badge>
                                </TableCell>
                                <TableCell className="font-medium">KES {user.balance.toFixed(2)}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">Suspend User</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}