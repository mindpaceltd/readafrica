"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Book } from "@/lib/data";
import { getBookById } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Hourglass, Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function BookPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [book, setBook] = useState<Book | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you might persist purchase status in localStorage or a backend
    if (params.id) {
      const bookId = Array.isArray(params.id) ? params.id[0] : params.id;
      const bookData = getBookById(bookId);
      if (bookData) {
        setBook(bookData);
        // Check mock purchase status
        const purchasedStatus = localStorage.getItem(`book_${bookId}_purchased`);
        if (purchasedStatus === 'true') {
          setIsPurchased(true);
        }
      }
      setIsLoading(false);
    }
  }, [params.id]);

  const handlePurchase = () => {
    if(!book) return;
    setIsPurchasing(true);
    // Simulate M-Pesa STK Push
    setTimeout(() => {
      setIsPurchasing(false);
      setIsPurchased(true);
      // Persist purchase status
      localStorage.setItem(`book_${book.id}_purchased`, 'true');
      toast({
        title: "Purchase Successful!",
        description: `You can now read "${book?.title}".`,
        className: 'bg-green-600 border-green-600 text-white',
      });
    }, 2500);
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
          <Link href="/">
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
          <Link href="/">
            <ArrowLeft className="mr-2" />
            Back to Catalog
          </Link>
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="overflow-hidden md:sticky top-8">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={book.thumbnailUrl}
                  alt={`Cover of ${book.title}`}
                  fill
                  className="object-cover"
                  data-ai-hint={book.dataAiHint}
                   sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <CardContent className="p-4">
                 <h1 className="text-2xl md:text-3xl font-headline text-primary mb-2">{book.title}</h1>
                 <p className="text-muted-foreground mb-4 text-sm md:text-base">{book.description}</p>
                 <p className="text-2xl font-bold text-accent mb-4">{book.price}</p>
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
                    <p>{book.previewContent}</p>
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
                    <p>{book.fullContent}</p>
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
