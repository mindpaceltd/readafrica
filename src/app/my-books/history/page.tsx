// src/app/my-books/history/page.tsx
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
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
    { id: 'txn_1', book: 'Breaking Free', amount: 'KES 500', status: 'Completed', date: '2023-10-26', code: 'RKT123ABC45' },
    { id: 'txn_2', book: 'Divine Pendant Wisdom', amount: 'KES 450', status: 'Completed', date: '2023-10-25', code: 'RKJ654DEF78' },
    { id: 'txn_3', book: 'The Prophetic Voice', amount: 'KES 550', status: 'Pending', date: '2023-10-25', code: 'RKI987GHI12' },
    { id: 'txn_4', book: 'Breaking Free', amount: 'KES 500', status: 'Failed', date: '2023-10-24', code: 'RKH321JKL45' },
  ];
  
  export default function PurchaseHistoryPage() {
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
                    <TableHead>Book Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>M-Pesa Code</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                    <TableCell className="font-medium">{txn.book}</TableCell>
                    <TableCell>{txn.amount}</TableCell>
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
                    <TableCell className="font-mono text-xs">{txn.code}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
      </div>
    );
  }
