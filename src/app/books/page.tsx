// src/app/books/page.tsx
'use client';

import { useState } from "react";
import { EbookCard } from "@/components/ebook-card";
import { books } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag, Search, BookUp } from "lucide-react";

export default function BooksPage() {
  const allTags = ['All', ...Array.from(new Set(books.flatMap(book => book.tags || [])))];
  
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [purchaseType, setPurchaseType] = useState('all');

  const filteredBooks = books.filter(book => {
    const statusMatch = book.status === 'published';
    const tagMatch = selectedTag === 'All' || book.tags?.includes(selectedTag);
    const searchMatch = searchTerm.trim() === '' || 
                        book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        book.description.toLowerCase().includes(searchTerm.toLowerCase());
    const purchaseTypeMatch = purchaseType === 'all' || 
                              (purchaseType === 'purchase' && !book.isSubscription) ||
                              (purchaseType === 'subscription' && book.isSubscription);

    return statusMatch && tagMatch && searchMatch && purchaseTypeMatch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 max-w-7xl mx-auto p-4 md:p-8 w-full">
        {/* E-Book Catalog */}
        <section id="catalog" className="w-full">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-headline text-primary">
                E-Book Catalog
                </h1>
                <p className="text-muted-foreground mt-2">Browse, search, and filter our library of books.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search by title or description..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={purchaseType} onValueChange={setPurchaseType}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Purchase Types</SelectItem>
                        <SelectItem value="purchase">Purchase</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {allTags.map(tag => (
                    <Button 
                        key={tag} 
                        variant={selectedTag === tag ? "default" : "outline"}
                        onClick={() => setSelectedTag(tag)}
                        className="capitalize"
                    >
                        {tag}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {filteredBooks.map((book) => (
                <EbookCard key={book.id} book={book} />
              ))}
            </div>
            {filteredBooks.length === 0 && (
                <div className="text-center py-16 px-4 border-2 border-dashed border-muted-foreground/30 rounded-lg col-span-full">
                    <div className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4">
                        <BookUp className="h-full w-full"/>
                    </div>
                    <h2 className="text-2xl font-headline text-primary mb-2">No Books Found</h2>
                    <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                </div>
            )}
          </section>
      </main>
    </div>
  );
}
