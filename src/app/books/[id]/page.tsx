// src/app/books/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Hourglass, Lock, Unlock, ShoppingCart, Share2, Award, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/database.types";
import DOMPurify from "dompurify";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";

type BookWithCategory = Tables<'books'> & {
    categories: { name: string } | null;
};


export default function BookPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const supabase = createClient();
  const { addItem, items } = useCart();

  const [book, setBook] = useState<BookWithCategory | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isInCart = book ? items.some(item => item.id === book.id) : false;

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
            toast({ title: "Error", description: "Could not find the requested book.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        setBook(bookData as BookWithCategory);
        
        const { data: { user } } = await supabase.auth.getUser();

        if(user) {
            // Check admin status
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', user.id)
              .single();
            
            if (profileData?.is_admin) {
                setIsAdmin(true);
            }

            // Check purchase status
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
  }, [params.id, supabase, toast]);

  const handleAddToCart = () => {
      if (!book) return;
      addItem(book);
      toast({
          title: "Added to Cart!",
          description: `"${book.title}" has been added to your cart.`,
      })
  }

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

    // In a real app, a webhook from M-Pesa would trigger this logic.
    // For this demo, we simulate a successful payment after a delay.
    setTimeout(async () => {
      
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
  
  const canViewFullContent = isPurchased || isAdmin;


  if (isLoading) {
    return <BookPageSkeleton />;
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h2 className="text-2xl font-headline mb-4">Book Not Found</h2>
        <p className="text-muted-foreground mb-6">The book you are looking for does not exist or could not be loaded.</p>
        <Button asChild>
          <Link href="/books">
            <ArrowLeft className="mr-2" />
            Back to Catalog
          </Link>
        </Button>
      </div>
    );
  }

  const sanitizedDescription = book.description ? DOMPurify.sanitize(book.description) : null;
  const bookTags = ["spiritual warfare", "Motivation", "Prayers", "Spiritual Growth"]; // Placeholder tags

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Button asChild variant="ghost" className="mb-4 text-muted-foreground">
          <Link href="/books">
            <ArrowLeft className="mr-2" />
            Back to all books
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Book Cover */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden sticky top-8">
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
            </Card>
          </div>
          
          {/* Right Column - Book Info */}
          <div className="md:col-span-1 lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {book.is_featured && <Badge className="bg-primary/10 text-primary border-primary/20">Featured</Badge>}
                {book.bestseller && <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Bestseller</Badge>}
              </div>
              <h1 className="text-3xl lg:text-4xl font-headline text-primary">{book.title}</h1>
              <p className="text-lg text-muted-foreground">by {book.author || "Dr C Wiseman"}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button size="lg" className="flex-1" onClick={handlePurchase} disabled={isPurchasing}>
                {isPurchasing ? <Hourglass className="mr-2 animate-spin" /> : null}
                Buy PDF - KES {book.price}
              </Button>
              <Button size="lg" variant="outline" className="flex-1" onClick={handleAddToCart} disabled={isInCart}>
                <ShoppingCart className="mr-2" />
                {isInCart ? "In Cart" : "Add to Cart"}
              </Button>
            </div>
            
            <Card className="bg-secondary/20 border-secondary/30">
              <CardContent className="p-4 text-center">
                <p className="font-semibold text-secondary-foreground">EPUB Available with Subscription</p>
                <p className="text-sm text-secondary-foreground/80 mb-3">Get unlimited access to EPUB version and thousands more books</p>
                <Button variant="secondary" asChild>
                  <Link href="/subscriptions">Choose Your Plan</Link>
                </Button>
              </CardContent>
            </Card>

            <Button variant="ghost" className="w-full text-muted-foreground">
              <Share2 className="mr-2" />
              Share
            </Button>
            
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-4">
                {sanitizedDescription ? (
                  <div
                      className="prose dark:prose-invert max-w-none text-foreground"
                      dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  />
                ) : (
                  <p className="text-muted-foreground">No description available.</p>
                )}
              </TabsContent>
              <TabsContent value="details" className="py-4">
                 <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-foreground">Author:</p>
                        <p className="text-muted-foreground">{book.author || "Dr C Wiseman"}</p>
                      </div>
                       <div>
                        <p className="font-semibold text-foreground">Category:</p>
                        <p className="text-muted-foreground">{book.categories?.name || 'Uncategorized'}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Pages:</p>
                        <p className="text-muted-foreground">210</p>
                      </div>
                       <div>
                        <p className="font-semibold text-foreground">File Size:</p>
                        <p className="text-muted-foreground">3.0 MB</p>
                      </div>
                       <div>
                        <p className="font-semibold text-foreground">Format:</p>
                        <p className="text-muted-foreground">PDF & EPUB</p>
                      </div>
                   </div>
                   <div>
                     <p className="font-semibold text-foreground mb-2">Tags:</p>
                     <div className="flex flex-wrap gap-2">
                      {book.tags?.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                      {!book.tags?.length && bookTags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                     </div>
                   </div>
                 </div>
              </TabsContent>
              <TabsContent value="reviews" className="py-4">
                <p className="text-muted-foreground">No reviews yet.</p>
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </div>
    </div>
  );
}

function BookPageSkeleton() {
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 animate-pulse">
            <Skeleton className="h-10 w-48 mb-4" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="lg:col-span-1">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              </div>
              <div className="md:col-span-1 lg:col-span-2 space-y-6">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 flex-1" />
                </div>
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                 <div className="space-y-4">
                    <div className="flex gap-1 border-b">
                      <Skeleton className="h-10 w-1/3" />
                      <Skeleton className="h-10 w-1/3" />
                      <Skeleton className="h-10 w-1/3" />
                    </div>
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                 </div>
              </div>
            </div>
        </div>
    )
}
