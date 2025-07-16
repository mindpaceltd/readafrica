// src/app/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookHeart, Sparkles } from "lucide-react";
import Image from "next/image";
import { books } from "@/lib/data";
import { EbookCard } from "@/components/ebook-card";

export default function HomePage() {

  const featuredBooks = books.filter(b => b.isFeatured).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-accent to-primary/80 text-primary-foreground text-center py-20 md:py-32 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-headline mb-4">Welcome to Prophetic Reads</h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
                Your source for transformative e-books and daily spiritual nourishment from Dr. Climate Wiseman.
            </p>
            <Button size="lg" asChild>
                <Link href="/books">
                    Explore the Book Catalog <ArrowRight className="ml-2"/>
                </Link>
            </Button>
          </div>
        </section>

        <div className="max-w-6xl mx-auto space-y-16 p-4 md:p-8">

          {/* Featured Books Section */}
          {featuredBooks.length > 0 && (
             <section id="featured">
                <h2 className="text-3xl md:text-4xl font-headline text-primary text-center mb-8">
                    Featured Books
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {featuredBooks.map((book) => (
                    <EbookCard key={book.id} book={book} />
                ))}
                </div>
            </section>
          )}

          {/* Devotionals CTA */}
           <section className="bg-card border rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                    <Sparkles className="h-12 w-12 text-primary mx-auto md:mx-0 mb-4"/>
                    <h2 className="text-3xl font-headline text-primary mb-2">Daily Prophetic Word</h2>
                    <p className="text-muted-foreground max-w-2xl">
                        Receive a unique and inspiring message for your day, tailored to provide spiritual guidance and upliftment.
                    </p>
                </div>
                <Button size="lg" asChild variant="outline" className="flex-shrink-0">
                    <Link href="/devotionals">
                        Get Your Daily Word <ArrowRight className="ml-2"/>
                    </Link>
                </Button>
          </section>

        </div>
      </main>
      <footer
        className="text-center p-6 text-muted-foreground text-sm"
        suppressHydrationWarning
      >
        <p>&copy; {new Date().getFullYear()} Dr. Climate Wiseman. All rights reserved.</p>
      </footer>
    </div>
  );
}
