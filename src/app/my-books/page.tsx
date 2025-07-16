// src/app/my-books/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { books, type Book } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, ShoppingCart, Wallet, PlusCircle } from "lucide-react";

export default function MyBooksPage() {
  const [purchasedBooks, setPurchasedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Check for purchased books on the client side only
    const purchased = books.filter(book => {
      return localStorage.getItem(`book_${book.id}_purchased`) === 'true';
    });
    setPurchasedBooks(purchased);
    
    // In a real app, you'd fetch this from your backend
    const mockBalance = parseFloat(localStorage.getItem('user_balance') || '150.00');
    setBalance(mockBalance);

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-6">Welcome, Brayan 👋</h1>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h2 className="text-2xl font-headline text-primary mb-4">My Library</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                    {[...Array(2)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <div className="relative aspect-[3/4] w-full bg-muted rounded-t-lg"></div>
                            <CardContent className="p-4 space-y-2">
                                <div className="h-6 w-3/4 bg-muted rounded"></div>
                                <div className="h-10 w-full bg-muted rounded"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <div className="md:col-span-1">
                <h2 className="text-2xl font-headline text-primary mb-4">My Wallet</h2>
                 <Card className="animate-pulse">
                    <CardHeader>
                        <div className="h-8 w-1/2 bg-muted rounded"></div>
                        <div className="h-4 w-3/4 bg-muted rounded"></div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="h-10 w-1/3 bg-muted rounded"></div>
                        <div className="h-10 w-full bg-muted rounded"></div>
                    </CardContent>
                 </Card>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
       <main>
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-8">Welcome, Brayan 👋</h1>
        
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
                            src={book.thumbnailUrl}
                            alt={`Cover of ${book.title}`}
                            fill
                            className="object-cover rounded-t-lg"
                            data-ai-hint={book.dataAiHint}
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
                        <BookOpen className="h-full w-full"/>
                    </div>
                    <h2 className="text-2xl font-headline text-primary mb-2">Your bookshelf is empty</h2>
                    <p className="text-muted-foreground mb-6">You haven't purchased any books yet.</p>
                    <Button asChild>
                    <Link href="/">
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
                        <p className="text-3xl font-bold">KES {balance.toFixed(2)}</p>
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
