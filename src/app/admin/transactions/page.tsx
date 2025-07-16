// src/app/admin/transactions/page.tsx
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
import { Badge } from "@/components/ui/badge";

  
  const transactions = [
    { id: 'txn_1', user: '+254712345678', book: 'Breaking Free', amount: 'KES 500', status: 'Completed', date: '2023-10-26' },
    { id: 'txn_2', user: '+254722345678', book: 'Divine Pendant Wisdom', amount: 'KES 450', status: 'Completed', date: '2023-10-25' },
    { id: 'txn_3', user: '+254733345678', book: 'The Prophetic Voice', amount: 'KES 550', status: 'Pending', date: '2023-10-25' },
    { id: 'txn_4', user: '+254744345678', book: 'Breaking Free', amount: 'KES 500', status: 'Failed', date: '2023-10-24' },
    { id: 'txn_5', user: '+254755345678', book: 'The Prophetic Voice', amount: 'KES 550', status: 'Completed', date: '2023-10-23' },
  ];
  
  export default function TransactionsPage() {
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
                    <TableHead>Book</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                    <TableCell className="font-medium">{txn.user}</TableCell>
                    <TableCell>{txn.book}</TableCell>
                    <TableCell className="text-right">{txn.amount}</TableCell>
                    <TableCell>
                        <Badge
                        variant={
                            txn.status === 'Completed' ? 'default' : txn.status === 'Pending' ? 'secondary' : 'destructive'
                        }
                        className={txn.status === 'Completed' ? 'bg-green-600' : ''}
                        >
                        {txn.status}
                        </Badge>
                    </TableCell>
                    <TableCell>{txn.date}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
      </div>
    );
  }