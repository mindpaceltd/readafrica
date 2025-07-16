
// src/app/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookHeart, Sparkles } from "lucide-react";
import Image from "next/image";
import { EbookCard } from "@/components/ebook-card";
import { createClient } from "@/lib/supabase/server";

async function getFeaturedBooks() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('books')
        .select('*, categories(name)')
        .eq('is_featured', true)
        .eq('status', 'published')
        .limit(3);

    if (error) {
        console.error("Error fetching featured books:", error);
        return [];
    }

    // Remap book to fit EbookCard props
    const formattedBooks = data?.map(book => ({
        id: book.id,
        title: book.title,
        description: book.description || '',
        price: `KES ${book.price}`,
        thumbnailUrl: book.thumbnail_url || 'https://placehold.co/600x800.png',
        dataAiHint: book.data_ai_hint || 'book cover',
        tags: book.tags || [],
        // @ts-ignore
        category: book.categories?.name || 'Uncategorized',
        isSubscription: book.is_subscription,
        status: book.status as 'published' | 'draft',
        previewContent: book.preview_content || "No preview available.",
        fullContent: "Full content is available after purchase.",
    })) || [];

    return formattedBooks;
}

export default async function HomePage() {

  const featuredBooks = await getFeaturedBooks();
  const supabase = createClient();
  const { data: settings } = await supabase.from('app_settings').select('site_title, site_description').eq('id', 1).single();


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-primary-foreground text-center py-24 md:py-40 px-4 isolate">
            <div className="absolute inset-0 -z-10">
                 <Image 
                    src="https://images.saymedia-content.com/.image/t_share/MTg2MTkzMjg5NzY0OTM5NDU5/five-biblical-steps-to-controlling-anger.jpg"
                    alt="Inspirational background"
                    fill
                    className="object-cover"
                    data-ai-hint="inspirational landscape"
                    priority
                 />
                 <div className="absolute inset-0 bg-primary/70 mix-blend-multiply"></div>
            </div>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-headline mb-4 drop-shadow-md">Welcome to {settings?.site_title || 'Prophetic Reads'}</h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 drop-shadow-sm">
                {settings?.site_description || 'Your source for transformative e-books and daily spiritual nourishment from Dr. Climate Wiseman.'}
            </p>
            <Button size="lg" asChild>
                <Link href="/books">
                    Explore the Book Catalog <ArrowRight className="ml-2"/>
                </Link>
            </Button>
          </div>
        </section>

        <div className="max-w-5xl mx-auto space-y-20 md:space-y-24 p-4 md:p-8">

          {/* Featured Books Section */}
          {featuredBooks.length > 0 && (
             <section id="featured">
                <h2 className="text-3xl md:text-4xl font-headline text-primary text-center mb-8">
                    Featured Books
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {featuredBooks.map((book) => (
                    // @ts-ignore
                    <EbookCard key={book.id} book={book} />
                ))}
                </div>
            </section>
          )}

          {/* About the Author */}
           <section id="about-author" className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-card p-8 rounded-lg shadow-md">
                <div className="w-48 h-48 md:w-56 md:h-56 flex-shrink-0 relative">
                    <Image 
                        src="https://images.saymedia-content.com/.image/t_share/MTg2MTkzMjg5NzY0OTM5NDU5/five-biblical-steps-to-controlling-anger.jpg"
                        alt="Dr. Climate Wiseman"
                        fill
                        className="rounded-full object-cover shadow-lg"
                        data-ai-hint="man portrait"
                    />
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-headline text-primary mb-2">About Dr. Climate Wiseman</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Dr. Climate Wiseman is a renowned spiritual leader, author, and speaker, dedicated to empowering individuals with prophetic wisdom and guidance. With decades of experience in ministry, his teachings have transformed lives across the globe, bringing clarity, healing, and purpose.
                    </p>
                     <p className="font-headline text-2xl text-accent">Dr. Climate Wiseman</p>
                </div>
           </section>

          {/* Devotionals CTA */}
           <section className="bg-gradient-to-tr from-primary to-accent border rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-primary-foreground">
                <div className="text-center md:text-left">
                    <Sparkles className="h-12 w-12 mx-auto md:mx-0 mb-4"/>
                    <h2 className="text-3xl font-headline mb-2">Daily Prophetic Word</h2>
                    <p className="text-primary-foreground/80 max-w-2xl">
                        Receive a unique and inspiring message for your day, tailored to provide spiritual guidance and upliftment.
                    </p>
                </div>
                <Button size="lg" asChild variant="secondary" className="flex-shrink-0">
                    <Link href="/devotionals">
                        Get Your Daily Word <ArrowRight className="ml-2"/>
                    </Link>
                </Button>
          </section>

        </div>
      </main>
    </div>
  );
}
