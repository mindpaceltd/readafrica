// src/app/admin/publishers/page.tsx
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

type Publisher = Tables<'profiles'> & {
    books: { count: number }[];
};


export default function PublishersPage() {
    const supabase = createClient();
    const { toast } = useToast();
    const [publishers, setPublishers] = useState<Publisher[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublishers = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*, books(count)')
                .eq('role', 'publisher');

            if (error) {
                toast({ title: 'Error fetching publishers', description: error.message, variant: 'destructive' });
            } else {
                setPublishers(data as any || []);
            }
            setLoading(false);
        };
        fetchPublishers();
    }, [supabase, toast]);
  
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-headline text-primary">Publisher Management</h1>
                <p className="text-muted-foreground">View and manage publisher accounts.</p>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Publisher</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Books</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {loading && <TableRow><TableCell colSpan={5} className="text-center">Loading publishers...</TableCell></TableRow>}
                        {!loading && publishers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user.avatar_url || `https://placehold.co/100x100.png`} alt="Avatar" />
                                            <AvatarFallback>{user.full_name?.charAt(0) || 'P'}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-0.5">
                                            <p className="font-medium">{user.full_name || 'N/A'}</p>
                                            <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.phone_number || 'Not provided'}</TableCell>
                                <TableCell>
                                   <Badge variant="secondary">{user.books[0]?.count || 0} books</Badge>
                                </TableCell>
                                <TableCell>{new Date(user.updated_at || Date.now()).toLocaleDateString()}</TableCell>
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
                                        <DropdownMenuItem>View Books</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">Suspend Publisher</DropdownMenuItem>
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