// src/app/admin/books/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { books, type Book } from "@/lib/data";
import { PlusCircle, MoreHorizontal, Star, FileText, BookLock, Circle, FolderKanban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Image from "next/image";
import { useState } from "react";
import { BookForm } from "@/components/book-form";

export default function ManageBooksPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedBook(null);
    setIsFormOpen(true);
  };

  const onFormOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
        setSelectedBook(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-headline text-primary">Manage Books</h1>
            <p className="text-muted-foreground">Add, edit, and manage your e-books.</p>
        </div>
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2" /> Add Book
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                    <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={book.title}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={book.thumbnailUrl}
                      width="64"
                      data-ai-hint={book.dataAiHint}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        {book.title}
                        {book.isFeatured && <Star className="h-4 w-4 text-yellow-400" />}
                    </div>
                  </TableCell>
                   <TableCell>
                      <Badge variant={book.status === 'published' ? 'default' : 'secondary'} className={book.status === 'published' ? 'bg-green-600' : ''}>
                          <Circle className={`mr-1 h-2 w-2 ${book.status === 'published' ? 'fill-white' : 'fill-current'}`} />
                          {book.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                        <span>{book.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={book.isSubscription ? "secondary" : "outline"} className="flex items-center gap-1 w-fit">
                      {book.isSubscription ? <BookLock /> : <FileText />}
                      <span>{book.isSubscription ? "Subscription" : "Purchase"}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{book.price}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleEdit(book)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <BookForm open={isFormOpen} onOpenChange={onFormOpenChange} book={selectedBook} />
    </div>
  );
}
