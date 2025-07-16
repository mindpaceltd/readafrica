
// src/app/admin/page.tsx
import {
    Card,
    CardContent,
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
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { DollarSign, Users, BookOpen, MessageSquare } from "lucide-react";

async function getStats() {
    const supabase = createClient();

    const revenuePromise = supabase
        .from('transactions')
        .select('amount', { count: 'exact' })
        .eq('status', 'completed');

    const usersPromise = supabase
        .from('profiles')
        .select('id', { count: 'exact' });

    const salesPromise = supabase
        .from('transactions')
        .select('id', { count: 'exact' })
        .eq('status', 'completed')
        .eq('transaction_type', 'purchase');

    const devotionalsPromise = supabase
        .from('devotionals')
        .select('id', { count: 'exact' })
        .not('sent_at', 'is', null)

    const transactionsPromise = supabase
        .from('transactions')
        .select('id, created_at, amount, status, profiles(full_name, phone_number), books(title)')
        .order('created_at', { ascending: false })
        .limit(5);

    const [
        { data: revenue, error: revenueError, count: revenueCount }, 
        { error: usersError, count: usersCount }, 
        { error: salesError, count: salesCount },
        { error: devotionalsError, count: devotionalsCount },
        { data: recentTransactions, error: transactionsError }
    ] = await Promise.all([revenuePromise, usersPromise, salesPromise, devotionalsPromise, transactionsPromise]);


    if (revenueError) console.error("Revenue Error:", revenueError.message);
    if (usersError) console.error("Users Error:", usersError.message);
    if (salesError) console.error("Sales Error:", salesError.message);
    if (devotionalsError) console.error("Devotionals Error:", devotionalsError.message);
    if (transactionsError) console.error("Transactions Error:", transactionsError.message);


    const totalRevenue = revenue?.reduce((sum, current) => sum + current.amount, 0) || 0;
    const totalUsers = usersCount || 0;
    const totalSales = salesCount || 0;
    const totalDevotionals = devotionalsCount || 0;

    return { totalRevenue, totalUsers, totalSales, totalDevotionals, recentTransactions };
}
  
export default async function AdminDashboard() {
    const { totalRevenue, totalUsers, totalSales, totalDevotionals, recentTransactions } = await getStats();

    return (
      <div>
        <h1 className="text-3xl font-headline text-primary mb-8">Admin Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Book Sales</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalSales}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Devotional Engagements
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalDevotionals}</div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
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
                        {recentTransactions && recentTransactions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                    No recent transactions.
                                </TableCell>
                            </TableRow>
                        )}
                        {recentTransactions && recentTransactions.map((txn) => (
                            <TableRow key={txn.id}>
                            {/* @ts-ignore */}
                            <TableCell className="font-medium">{txn.profiles?.full_name || txn.profiles?.phone_number || 'N/A'}</TableCell>
                             {/* @ts-ignore */}
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
                            <TableCell>{new Date(txn.created_at).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    );
}
