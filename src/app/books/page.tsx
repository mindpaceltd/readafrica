// src/app/books/page.tsx
'use client';

import { useState } from "react";
import { EbookCard } from "@/components/ebook-card";
import { books } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";

export default function BooksPage() {
  const allTags = ['All', ...Array.from(new Set(books.flatMap(book => book.tags || [])))];
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const filteredBooks = selectedTag === 'All'
    ? books.filter(book => book.status === 'published')
    : books.filter(book => book.status === 'published' && book.tags?.includes(selectedTag));

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 max-w-5xl mx-auto p-4 md:p-8">
        {/* E-Book Catalog */}
        <section id="catalog" className="w-full">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-headline text-primary">
                E-Book Catalog
                </h1>
                <p className="text-muted-foreground mt-2">Filter our library of books by theme</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
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
      </main>
    </div>
  );
}
