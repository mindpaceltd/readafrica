
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Hourglass, Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/database.types";

type BookWithCategory = Tables<'books'> & {
    categories: { name: string } | null;
};


export default function BookPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const supabase = createClient();

  const [book, setBook] = useState<BookWithCategory | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bookId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!bookId) return;

    const fetchBookAndPurchaseStatus = async () => {
        setIsLoading(true);

        const { data: bookData, error: bookError } = await supabase
            .from('books')
            .select('*, categories(name)')
            .eq('id', bookId)
            .single();

        if (bookError || !bookData) {
            console.error("Error fetching book", bookError);
            setIsLoading(false);
            return;
        }

        setBook(bookData as BookWithCategory);
        
        const { data: { user } } = await supabase.auth.getUser();

        if(user) {
            const { data: purchaseData, error: purchaseError } = await supabase
                .from('user_books')
                .select('*')
                .eq('user_id', user.id)
                .eq('book_id', bookId)
                .maybeSingle();

            if (purchaseError) {
                console.error("Error checking purchase status", purchaseError);
            }
            if (purchaseData) {
                setIsPurchased(true);
            }
        }
        setIsLoading(false);
    }
    
    fetchBookAndPurchaseStatus();
  }, [params.id, supabase]);

  const handlePurchase = async () => {
    if(!book) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        toast({ title: "Please log in to purchase.", variant: "destructive" });
        return router.push('/login');
    }

    setIsPurchasing(true);
    // Simulate M-Pesa STK Push
    toast({
        title: "Processing Payment",
        description: "Please check your phone to complete the M-Pesa transaction.",
    });

    setTimeout(async () => {
      // In a real app, a webhook from M-Pesa would trigger this logic.
      // Here, we simulate a successful payment.
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
            user_id: user.id,
            book_id: book.id,
            amount: book.price,
            status: 'completed',
            transaction_type: 'purchase',
            mpesa_code: `SIM${Date.now()}`
        });

       if (transactionError) {
            console.error("Error creating transaction:", transactionError);
            toast({ title: "Payment Failed", description: "Could not record the transaction.", variant: "destructive" });
            setIsPurchasing(false);
            return;
       }

       const { error: userBookError } = await supabase
        .from('user_books')
        .insert({ user_id: user.id, book_id: book.id });

       if (userBookError) {
            console.error("Error adding book to user library:", userBookError);
            toast({ title: "Purchase Error", description: "Could not add book to your library.", variant: "destructive" });
            setIsPurchasing(false);
            return;
       }
      
      setIsPurchasing(false);
      setIsPurchased(true);
      
      toast({
        title: "Purchase Successful!",
        description: `You can now read "${book?.title}".`,
        className: 'bg-green-600 border-green-600 text-white',
      });
    }, 3000);
  };

  if (isLoading) {
    return <BookPageSkeleton />;
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-2xl font-headline mb-4">Book Not Found</h2>
        <p className="text-muted-foreground mb-6">The book you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/books">
            <ArrowLeft className="mr-2" />
            Back to Catalog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <Button asChild variant="outline" className="mb-8">
          <Link href="/books">
            <ArrowLeft className="mr-2" />
            Back to Catalog
          </Link>
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="overflow-hidden md:sticky top-8">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={book.thumbnail_url || 'https://placehold.co/600x800.png'}
                  alt={`Cover of ${book.title}`}
                  fill
                  className="object-cover"
                  data-ai-hint={book.data_ai_hint || 'book cover'}
                   sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <CardContent className="p-4">
                 <h1 className="text-2xl md:text-3xl font-headline text-primary mb-2">{book.title}</h1>
                 <p className="text-muted-foreground mb-4 text-sm md:text-base">{book.description}</p>
                 <p className="text-2xl font-bold text-accent mb-4">KES {book.price}</p>
                 {isPurchased ? (
                     <div className="flex items-center justify-center w-full p-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md">
                        <CheckCircle className="mr-2" />
                        <span>Purchased</span>
                    </div>
                 ) : (
                    <Button onClick={handlePurchase} disabled={isPurchasing} className="w-full">
                        {isPurchasing ? <Hourglass className="mr-2 animate-spin" /> : null}
                        {isPurchasing ? 'Processing...' : 'Buy Now'}
                    </Button>
                 )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div id="preview">
                <h2 className="text-xl md:text-2xl font-headline text-accent flex items-center gap-2"><Unlock/> Book Preview</h2>
                <div className="prose dark:prose-invert mt-4 text-base md:text-lg leading-relaxed whitespace-pre-line p-4 md:p-6 bg-card rounded-lg shadow-inner">
                    <p>{book.preview_content}</p>
                </div>
            </div>

            <div id="full-text">
                <h2 className="text-xl md:text-2xl font-headline text-primary flex items-center gap-2">
                    {isPurchased ? <Unlock className="text-green-500"/> : <Lock className="text-red-500" />} Full Text
                </h2>
                <div className="prose dark:prose-invert mt-4 text-base md:text-lg leading-relaxed whitespace-pre-line p-4 md:p-6 bg-card rounded-lg shadow-inner relative">
                    {!isPurchased && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                           <div className="text-center p-4">
                                <Lock className="mx-auto h-10 w-10 md:h-12 md:w-12 text-primary mb-4" />
                                <p className="font-bold text-sm md:text-base">Purchase this book to unlock the full text.</p>
                           </div>
                        </div>
                    )}
                    {/* In a real app, this would be fetched from book.full_content_url */}
                    <p>{isPurchased ? "Thank you for your purchase! You can now read the full content of the book here." : "Purchase the book to see the full content."}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookPageSkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 animate-pulse">
            <Skeleton className="h-10 w-36 md:w-48 mb-8" />
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-4">
                    <Skeleton className="aspect-[3/4] w-full" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-12 w-full" />
                </div>
                <div className="md:col-span-2 space-y-6">
                     <Skeleton className="h-8 w-32 md:w-40" />
                     <div className="space-y-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-5/6" />
                     </div>
                     <Skeleton className="h-8 w-32 md:w-40" />
                     <div className="space-y-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-4/6" />
                     </div>
                </div>
            </div>
        </div>
    )
}

