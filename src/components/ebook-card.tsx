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

type EbookCardProps = {
  book: Book;
};

export function EbookCard({ book }: EbookCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-transform transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl bg-card">
      <CardHeader className="p-0">
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={book.thumbnailUrl}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover rounded-t-lg"
            data-ai-hint={book.dataAiHint}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="font-headline text-xl mb-2 text-primary">
          {book.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {book.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="font-bold text-lg text-accent">{book.price}</p>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/books/${book.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
