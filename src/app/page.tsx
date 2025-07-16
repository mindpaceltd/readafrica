
'use client';

import { useState } from "react";
import { EbookCard } from "@/components/ebook-card";
import { DevotionalCard } from "@/components/devotional-card";
import { books } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const allTags = ['All', ...Array.from(new Set(books.flatMap(book => book.tags || [])))];
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const filteredBooks = selectedTag === 'All'
    ? books
    : books.filter(book => book.tags?.includes(selectedTag));

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-accent to-primary/80 text-primary-foreground text-center py-16 md:py-24 px-4">
            <h1 className="text-4xl md:text-5xl font-headline mb-4">Welcome to Prophetic Reads</h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/90 mb-8">
                Your source for transformative e-books and daily spiritual nourishment from Dr. Climate Wiseman.
            </p>
        </section>

        <div className="max-w-5xl mx-auto space-y-12 p-4 md:p-8">
          {/* Quick link to Devotionals */}
          <section>
            <DevotionalCard />
            <div className="text-center mt-4">
                 <Button asChild variant="outline">
                    <Link href="/devotionals">
                        View All Devotionals <ArrowRight className="ml-2"/>
                    </Link>
                 </Button>
            </div>
          </section>

          {/* E-Book Catalog */}
          <section id="catalog">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-3xl md:text-4xl font-headline text-primary">
                E-Book Catalog
                </h2>
                <p className="text-muted-foreground mt-1 md:mt-0">Filter books by theme</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
                {allTags.map(tag => (
                    <Button 
                        key={tag} 
                        variant={selectedTag === tag ? "default" : "outline"}
                        onClick={() => handleTagClick(tag)}
                        className="capitalize"
                    >
                        {tag}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredBooks.map((book) => (
                <EbookCard key={book.id} book={book} />
              ))}
            </div>
            {filteredBooks.length === 0 && (
                <div className="text-center py-16 px-4 border-2 border-dashed border-muted-foreground/30 rounded-lg col-span-full">
                    <div className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4">
                        <Tag className="h-full w-full"/>
                    </div>
                    <h2 className="text-2xl font-headline text-primary mb-2">No Books Found</h2>
                    <p className="text-muted-foreground">There are no books matching the tag "{selectedTag}".</p>
                </div>
            )}
          </section>
        </div>
      </main>
      <footer
        className="text-center p-4 text-muted-foreground text-sm"
        suppressHydrationWarning
      >
        <p>&copy; {new Date().getFullYear()} Dr. Climate Wiseman. All rights reserved.</p>
      </footer>
    </div>
  );
}
