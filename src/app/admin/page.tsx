// src/app/admin/page.tsx
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { DollarSign, Users, BookOpen, MessageSquare } from "lucide-react";

async function getStats() {
    const supabase = createClient();

    const { data: revenue, error: revenueError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'completed');

    const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });

    const { data: sales, error: salesError } = await supabase
        .from('transactions')
        .select('id', { count: 'exact' })
        .eq('status', 'completed')
        .eq('transaction_type', 'purchase');

    if (revenueError) console.error("Revenue Error:", revenueError.message);
    if (usersError) console.error("Users Error:", usersError.message);
    if (salesError) console.error("Sales Error:", salesError.message);

    const totalRevenue = revenue?.reduce((sum, current) => sum + current.amount, 0) || 0;
    const totalUsers = users?.length || 0;
    const totalSales = sales?.length || 0;

    return { totalRevenue, totalUsers, totalSales };
}
  
export default async function AdminDashboard() {
    const { totalRevenue, totalUsers, totalSales } = await getStats();

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
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                (Static Data)
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Recent activity feed will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    );
}