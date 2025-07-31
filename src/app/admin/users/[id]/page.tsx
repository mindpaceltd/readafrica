// src/app/admin/users/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, DollarSign, Edit, Hash, Mail, Phone, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Tables } from "@/lib/database.types";

type UserProfile = Tables<'profiles'> & { user_email: string | null };
type Transaction = Tables<'transactions'> & { books: Pick<Tables<'books'>, 'title'> | null };
type UserBook = { books: Pick<Tables<'books'>, 'id' | 'title' | 'thumbnail_url'> };

async function getUserDetails(userId: string) {
    const supabase = createClient();
    const profilePromise = supabase.from('profiles').select('*').eq('id', userId).single();
    const transactionsPromise = supabase
        .from('transactions')
        .select('*, books(title)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    const booksPromise = supabase
        .from('user_books')
        .select('books(id, title, thumbnail_url)')
        .eq('user_id', userId);

    const [{data: profile, error: profileError}, {data: transactions}, {data: books}] = await Promise.all([profilePromise, transactionsPromise, booksPromise]);

    if (profileError || !profile) {
        notFound();
    }
    
    // Admin-only call to get user email
    const { data: { user } } = await supabase.auth.admin.getUserById(userId);

    return { 
        profile: {
            ...profile,
            user_email: user?.email || null
        } as UserProfile, 
        transactions: transactions as Transaction[], 
        purchasedBooks: (books as UserBook[]).map(ub => ub.books) 
    };
}


export default async function UserDetailsPage({ params }: { params: { id: string } }) {
    const { profile, transactions, purchasedBooks } = await getUserDetails(params.id);
    
    const totalSpent = transactions.reduce((acc, txn) => acc + (txn.status === 'completed' ? txn.amount : 0), 0);
    
    return (
        <div>
            <div className="mb-4">
                <Button asChild variant="ghost">
                    <Link href="/admin/users">
                        <ArrowLeft className="mr-2" />
                        Back to All Users
                    </Link>
                </Button>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                             <Avatar className="h-16 w-16">
                                <AvatarImage src={profile.avatar_url || undefined} />
                                <AvatarFallback>{profile.full_name?.charAt(0) ?? 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>{profile.full_name}</CardTitle>
                                <CardDescription>
                                    <Badge variant={profile.role === 'admin' ? 'default' : profile.role === 'publisher' ? 'secondary' : 'outline'}>{profile.role}</Badge>
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <UserIcon className="h-4 w-4" />
                                <span>User ID: {profile.id}</span>
                            </div>
                             <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>{profile.user_email || 'No email provided'}</span>
                            </div>
                             <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>{profile.phone_number || 'No phone provided'}</span>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-muted-foreground">Joined:</span>
                                <span className="font-medium">{new Date(profile.updated_at || Date.now()).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                         <CardHeader>
                            <CardTitle>Financials</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center justify-between p-3 rounded-md bg-muted">
                                <div className="flex items-center gap-2">
                                   <DollarSign className="h-5 w-5 text-green-500"/>
                                   <span className="text-muted-foreground">Total Spent</span>
                                </div>
                                <span className="font-bold text-lg">KES {totalSpent.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-md bg-muted">
                                <div className="flex items-center gap-2">
                                   <BookOpen className="h-5 w-5 text-blue-500"/>
                                   <span className="text-muted-foreground">Books Purchased</span>
                                </div>
                                <span className="font-bold text-lg">{purchasedBooks.length}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Purchased Books</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {purchasedBooks.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">This user has not purchased any books.</p>
                            ) : (
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {purchasedBooks.map(book => (
                                        <Link href={`/admin/books?q=${book.title}`} key={book.id}>
                                            <div className="border rounded-md p-2 text-center hover:bg-muted transition-colors">
                                                <p className="text-sm font-medium truncate">{book.title}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Transaction History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center h-24">No transactions found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.map(txn => (
                                            <TableRow key={txn.id}>
                                                <TableCell className="font-medium">{txn.books?.title || 'Subscription'}</TableCell>
                                                <TableCell>KES {txn.amount.toFixed(2)}</TableCell>
                                                <TableCell>
                                                     <Badge variant={txn.status === 'completed' ? 'default' : 'secondary'} className={txn.status === 'completed' ? 'bg-green-600' : ''}>
                                                        {txn.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{new Date(txn.created_at).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
