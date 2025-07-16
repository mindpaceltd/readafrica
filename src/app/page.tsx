
import { EbookCard } from "@/components/ebook-card";
import { DevotionalCard } from "@/components/devotional-card";
import { books } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  // For now, let's feature the first book. This could be dynamic later.
  const featuredBook = books[0];

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
            <h2 className="text-3xl md:text-4xl font-headline text-primary mb-6">
              E-Book Catalog
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {books.map((book) => (
                <EbookCard key={book.id} book={book} />
              ))}
            </div>
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
