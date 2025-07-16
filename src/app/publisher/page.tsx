// src/app/publisher/page.tsx
'use client'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DollarSign, BookOpen, Library } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Stats = {
    revenue: number;
    sales: number;
    bookCount: number;
}

export default function PublisherDashboard() {
    const supabase = createClient();
    const [stats, setStats] = useState<Stats>({ revenue: 0, sales: 0, bookCount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            // Fetch books published by the current user
            const { data: books, count: bookCount, error: booksError } = await supabase
                .from('books')
                .select('id, price', { count: 'exact' })
                .eq('publisher_id', user.id);

            if (booksError) {
                console.error("Error fetching publisher books:", booksError);
                setLoading(false);
                return;
            }

            const bookIds = books.map(b => b.id);
            let totalRevenue = 0;
            let totalSales = 0;

            if (bookIds.length > 0) {
                // Fetch transactions related to those books
                const { data: transactions, error: transactionsError } = await supabase
                    .from('transactions')
                    .select('amount')
                    .in('book_id', bookIds)
                    .eq('status', 'completed');

                if (transactionsError) {
                    console.error("Error fetching transactions for publisher:", transactionsError);
                } else {
                    totalSales = transactions.length;
                    totalRevenue = transactions.reduce((sum, txn) => sum + txn.amount, 0);
                }
            }

            setStats({
                revenue: totalRevenue,
                sales: totalSales,
                bookCount: bookCount || 0,
            });

            setLoading(false);
        };

        fetchStats();
    }, [supabase]);


    return (
      <div>
        <h1 className="text-3xl font-headline text-primary mb-8">Publisher Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">KES {stats.revenue.toFixed(2)}</div>}
               <p className="text-xs text-muted-foreground">
                Revenue from your book sales
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">+{stats.sales}</div>}
               <p className="text-xs text-muted-foreground">
                Number of books sold
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Published Books
              </CardTitle>
              <Library className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.bookCount}</div>}
               <p className="text-xs text-muted-foreground">
                Your total number of books
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Getting Started</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Welcome to your publisher dashboard. Here you can manage your books, view sales analytics, and update your settings. Start by adding your first book!</p>
                </CardContent>
            </Card>
        </div>
      </div>
    );
}
