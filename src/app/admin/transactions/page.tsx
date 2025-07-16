// src/app/admin/transactions/page.tsx
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
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type Transaction = {
    id: string;
    created_at: string;
    amount: number;
    status: string;
    profiles: {
        full_name: string | null;
        phone_number: string | null;
    } | null;
    books: {
        title: string;
    } | null;
};

export default function TransactionsPage() {
    const supabase = createClient();
    const { toast } = useToast();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('transactions')
                .select('id, created_at, amount, status, profiles(full_name, phone_number), books(title)')
                .order('created_at', { ascending: false });

            if (error) {
                toast({ title: 'Error fetching transactions', description: error.message, variant: 'destructive' });
            } else {
                setTransactions(data as Transaction[] || []);
            }
            setLoading(false);
        };
        fetchTransactions();
    }, [supabase, toast]);

    return (
      <div>
        <div className="mb-8">
            <h1 className="text-3xl font-headline text-primary">Transactions</h1>
            <p className="text-muted-foreground">View all M-Pesa transactions.</p>
        </div>
        <Card>
            <CardContent className="p-0">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {loading && <TableRow><TableCell colSpan={5} className="text-center">Loading transactions...</TableCell></TableRow>}
                {!loading && transactions.map((txn) => (
                    <TableRow key={txn.id}>
                    <TableCell className="font-medium">{txn.profiles?.full_name || txn.profiles?.phone_number || 'N/A'}</TableCell>
                    <TableCell>{txn.books?.title || 'Subscription'}</TableCell>
                    <TableCell className="text-right">KES {txn.amount.toFixed(2)}</TableCell>
                    <TableCell>
                        <Badge
                        variant={
                            txn.status === 'completed' ? 'default' : txn.status === 'pending' ? 'secondary' : 'destructive'
                        }
                        className={txn.status === 'completed' ? 'bg-green-600' : ''}
                        >
                        {txn.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{new Date(txn.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
      </div>
    );
}