
// src/app/my-books/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, ShoppingCart, Wallet, PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Tables } from "@/lib/database.types";

type BookWithCategory = Tables<'books'> & {
  categories: { name: string } | null;
};

type UserBook = {
    books: BookWithCategory
}

async function getDashboardData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const profilePromise = supabase.from('profiles').select('*').eq('id', user.id).single();
    const userBooksPromise = supabase
        .from('user_books')
        .select('*, books(*, categories(name))')
        .eq('user_id', user.id);

    const [{ data: profile }, { data: userBooks }] = await Promise.all([profilePromise, userBooksPromise]);

    return { user, profile, userBooks: userBooks as UserBook[] | null };
}

export default async function MyBooksPage() {
    const { user, profile, userBooks } = await getDashboardData();
    const purchasedBooks = userBooks?.map(ub => ub.books) || [];

    return (
        <div className="min-h-screen bg-background">
            <main>
                <h1 className="text-3xl md:text-4xl font-headline text-primary mb-8">Welcome, {profile?.full_name?.split(' ')[0] || 'User'} 👋</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-headline text-primary mb-4">My Library</h2>
                        {purchasedBooks.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                {purchasedBooks.map((book) => (
                                    <Card key={book.id} className="flex flex-col overflow-hidden transition-transform transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl bg-card">
                                        <CardHeader className="p-0">
                                            <div className="relative aspect-[3/4] w-full">
                                                <Image
                                                    src={book.thumbnail_url || 'https://placehold.co/600x800.png'}
                                                    alt={`Cover of ${book.title}`}
                                                    fill
                                                    className="object-cover rounded-t-lg"
                                                    data-ai-hint={book.data_ai_hint || 'book cover'}
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 p-4">
                                            <CardTitle className="font-headline text-xl mb-2 text-primary">
                                                {book.title}
                                            </CardTitle>
                                        </CardContent>
                                        <div className="p-4 pt-0">
                                            <Button asChild className="w-full">
                                                <Link href={`/books/${book.id}`}>
                                                    <BookOpen className="mr-2" />
                                                    Read Now
                                                </Link>
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-4 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                                <div className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4">
                                    <BookOpen className="h-full w-full" />
                                </div>
                                <h2 className="text-2xl font-headline text-primary mb-2">Your bookshelf is empty</h2>
                                <p className="text-muted-foreground mb-6">You haven't purchased any books yet.</p>
                                <Button asChild>
                                    <Link href="/books">
                                        <ShoppingCart className="mr-2" />
                                        Explore the Catalogue
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-headline text-primary mb-4">My Wallet</h2>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Wallet />
                                    <span>Balance</span>
                                </CardTitle>
                                <CardDescription>Your current account balance.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-3xl font-bold">KES {profile?.balance.toFixed(2) || '0.00'}</p>
                                <Button className="w-full">
                                    <PlusCircle className="mr-2" />
                                    Top Up
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </main>
        </div>
    );
}
