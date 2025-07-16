// src/app/my-books/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { books, type Book } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ShoppingCart } from "lucide-react";

export default function MyBooksPage() {
  const [purchasedBooks, setPurchasedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const purchased = books.filter(book => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(`book_${book.id}_purchased`) === 'true';
      }
      return false;
    });
    setPurchasedBooks(purchased);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-6">My Books</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[...Array(3)].map((_, i) => (
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
    );
  }

  return (
    <div className="min-h-screen bg-background">
       <main className="max-w-5xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-8">My Books</h1>

        {purchasedBooks.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
      </main>
    </div>
  );
}