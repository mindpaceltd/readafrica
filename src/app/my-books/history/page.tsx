
// src/app/my-books/history/page.tsx
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
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function getTransactions() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data, error } = await supabase
        .from('transactions')
        .select('*, books(title)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error("Error fetching transactions", error);
        return [];
    }

    return data;
}

  
export default async function PurchaseHistoryPage() {
    const transactions = await getTransactions();

    return (
      <div>
        <div className="mb-8">
            <h1 className="text-3xl font-headline text-primary">Purchase History</h1>
            <p className="text-muted-foreground">A record of all your transactions.</p>
        </div>
        <Card>
            <CardContent className="p-0">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>M-Pesa Code</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {transactions.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                            You have no transaction history yet.
                        </TableCell>
                    </TableRow>
                )}
                {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                    {/* @ts-ignore */}
                    <TableCell className="font-medium">{txn.books?.title || 'Subscription'}</TableCell>
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
                    <TableCell>{new Date(txn.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="font-mono text-xs">{txn.mpesa_code}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
      </div>
    );
  }
