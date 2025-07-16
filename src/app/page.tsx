// src/app/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookHeart, Sparkles, Star, Users, Library } from "lucide-react";
import Image from "next/image";
import { EbookCard } from "@/components/ebook-card";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

async function getPageData() {
    const supabase = createClient();
    
    const settingsPromise = supabase.from('app_settings').select('site_title, site_description').eq('id', 1).single();

    const featuredPromise = supabase
        .from('books')
        .select('*, categories(name)')
        .eq('is_featured', true)
        .eq('status', 'published')
        .limit(3);
    
    const recentPromise = supabase
        .from('books')
        .select('*, categories(name)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(4);

    // Placeholder for bestsellers - in a real app, this would be based on sales data
    const bestsellerPromise = supabase
        .from('books')
        .select('*, categories(name)')
        .eq('bestseller', true)
        .eq('status', 'published')
        .limit(4);

    const [
        { data: settings },
        { data: featuredBooksData },
        { data: recentBooksData },
        { data: bestsellerBooksData }
    ] = await Promise.all([settingsPromise, featuredPromise, recentPromise, bestsellerPromise]);
    
    const formatBooks = (books: any[] | null) => {
        return books?.map(book => ({
            id: book.id,
            title: book.title,
            description: book.description || '',
            price: book.price,
            thumbnail_url: book.thumbnail_url || 'https://placehold.co/600x800.png',
            data_ai_hint: book.data_ai_hint || 'book cover',
            tags: book.tags || [],
            author: book.author || 'Dr C Wiseman',
            // @ts-ignore
            category: book.categories?.name || 'Uncategorized',
            is_subscription: book.is_subscription,
            status: book.status as 'published' | 'draft',
            preview_content: book.preview_content || "No preview available.",
            bestseller: book.bestseller || false,
            is_featured: book.is_featured || false,
        })) || [];
    };

    return {
        settings,
        featuredBooks: formatBooks(featuredBooksData),
        recentBooks: formatBooks(recentBooksData),
        bestsellerBooks: formatBooks(bestsellerBooksData),
    };
}

export default async function HomePage() {
  const { settings, recentBooks, bestsellerBooks } = await getPageData();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative text-primary-foreground text-center py-20 md:py-32 px-4 isolate">
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
            <h1 className="text-4xl md:text-6xl font-headline mb-4 drop-shadow-md">Welcome to {settings?.site_title || 'ReadAfrica'}</h1>
            <p className="text-base md:text-xl text-primary-foreground/90 mb-8 drop-shadow-sm">
                {settings?.site_description || 'Your source for transformative e-books and daily spiritual nourishment from Dr. Climate Wiseman.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                    <Link href="/my-books">
                        Get Started <ArrowRight className="ml-2"/>
                    </Link>
                </Button>
                 <Button size="lg" asChild variant="secondary">
                    <Link href="/books">
                        Browse Books
                    </Link>
                </Button>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto space-y-20 md:space-y-24 p-4 md:p-8">

          {/* Recently Added Section */}
          {recentBooks.length > 0 && (
             <section id="recent">
                <h2 className="text-3xl md:text-4xl font-headline text-primary text-center mb-8">
                    Recently Added
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {recentBooks.map((book) => (
                    // @ts-ignore
                    <EbookCard key={book.id} book={book} />
                ))}
                </div>
            </section>
          )}

          {/* Featured Series CTA */}
          <section className="bg-card rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 relative min-h-[300px] md:min-h-0">
                <Image 
                    src="https://placehold.co/600x400.png"
                    alt="Featured Series"
                    fill
                    className="object-cover"
                    data-ai-hint="books stack"
                />
            </div>
            <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                    <Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /><Star />
                    <span className="text-sm text-muted-foreground font-semibold ml-1">4.9/5 Rating</span>
                </div>
                <h2 className="text-3xl font-headline text-primary mb-2">30 Days to Financial Freedom</h2>
                <p className="text-muted-foreground mb-4">Transform your relationship with money through biblical principles and practical wisdom.</p>
                <div className="flex items-center gap-6 text-sm mb-6">
                    <span className="flex items-center gap-2"><Users /> 15,000+ readers</span>
                    <span className="flex items-center gap-2"><Library /> 7-book series</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg">Start Your Journey</Button>
                    <Button size="lg" variant="outline">Preview Free Chapter</Button>
                </div>
            </div>
          </section>

          {/* Bestsellers Section */}
          {bestsellerBooks.length > 0 && (
             <section id="bestsellers">
                <h2 className="text-3xl md:text-4xl font-headline text-primary text-center mb-8">
                    Popular This Month
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {bestsellerBooks.map((book) => (
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

          {/* Subscription CTA */}
           <section className="bg-gradient-to-tr from-primary to-accent border rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-primary-foreground">
                <div className="text-center md:text-left">
                    <Sparkles className="h-12 w-12 mx-auto md:mx-0 mb-4"/>
                    <h2 className="text-3xl font-headline mb-2">Unlock the Full Library with a Subscription</h2>
                    <p className="text-primary-foreground/80 max-w-2xl">
                        Get unlimited access to our entire EPUB collection with exclusive subscriber-only titles and save on every purchase.
                    </p>
                </div>
                <Button size="lg" asChild variant="secondary" className="flex-shrink-0">
                    <Link href="/subscriptions">
                        Choose Your Plan <ArrowRight className="ml-2"/>
                    </Link>
                </Button>
          </section>

        </div>
      </main>
    </div>
  );
}
