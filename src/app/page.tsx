
import { EbookCard } from "@/components/ebook-card";
import { DevotionalCard } from "@/components/devotional-card";
import { books } from "@/lib/data";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <DevotionalCard />
          <section>
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
