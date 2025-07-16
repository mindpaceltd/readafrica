// src/app/admin/users/page.tsx
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

  
const users = [
    { id: 1, phone: '+254712345678', name: 'John Doe', joined: '2023-10-26', purchases: 3, balance: 'KES 150.00' },
    { id: 2, phone: '+254722345678', name: 'Jane Smith', joined: '2023-10-25', purchases: 1, balance: 'KES 50.00' },
    { id: 3, phone: '+254733345678', name: 'Peter Jones', joined: '2023-10-25', purchases: 0, balance: 'KES 1200.00' },
    { id: 4, phone: '+254744345678', name: 'Mary Anne', joined: '2023-10-24', purchases: 5, balance: 'KES 0.00' },
    { id: 5, phone: '+254755345678', name: 'Chris Green', joined: '2023-10-23', purchases: 2, balance: 'KES 350.50' },
];
  
export default function UsersPage() {
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
                            <TableHead>Purchases</TableHead>
                            <TableHead>Balance</TableHead>
                            <TableHead>Date Joined</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`https://placehold.co/100x100.png`} alt="Avatar" />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-0.5">
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">User ID: {user.id}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{user.purchases} books</Badge>
                                </TableCell>
                                <TableCell className="font-medium">{user.balance}</TableCell>
                                <TableCell>{user.joined}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
