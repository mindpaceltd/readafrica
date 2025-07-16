import type { Book } from "@/lib/data";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";

type EbookCardProps = {
  book: Book;
};

export function EbookCard({ book }: EbookCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-transform transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl bg-card h-full">
        <Link href={`/books/${book.id}`} className="block">
          <CardHeader className="p-0">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={book.thumbnail_url || 'https://placehold.co/600x800.png'}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover rounded-t-lg"
                data-ai-hint={book.data_ai_hint || 'book cover'}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </CardHeader>
        </Link>
      <CardContent className="flex-1 p-3 flex flex-col">
        <CardTitle className="font-headline text-lg mb-1 text-primary leading-tight line-clamp-2">
          <Link href={`/books/${book.id}`} className="hover:underline">{book.title}</Link>
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          by {book.author || 'Dr C Wiseman'}
        </p>
         <Badge variant="outline" className="mt-2 w-fit text-xs">
            {/* @ts-ignore */}
            {book.category || 'Uncategorized'}
        </Badge>
        <div className="flex-grow" />
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <p className="font-bold text-base text-accent w-full">KES {book.price}</p>
      </CardFooter>
    </Card>
  );
}
