// src/app/admin/books/page.tsx
'use client'

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useState, useEffect } from "react";
import { BookForm } from "@/components/book-form";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/database.types";
import { useToast } from "@/hooks/use-toast";

type BookWithCategory = Tables<'books'> & {
  categories: { name: string } | null;
};

export default function ManageBooksPage() {
  const { toast } = useToast();
  const supabase = createClient();
  const [books, setBooks] = useState<BookWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookWithCategory | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Error fetching books", description: error.message, variant: "destructive" });
    } else if (data) {
      setBooks(data as BookWithCategory[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleEdit = (book: BookWithCategory) => {
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

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book? This action cannot be undone.")) return;

    const { error } = await supabase.from('books').delete().eq('id', bookId);

    if (error) {
      toast({ title: "Error deleting book", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Book deleted successfully" });
      fetchBooks(); // Refresh the list
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
              {loading && <TableRow><TableCell colSpan={7} className="text-center">Loading books...</TableCell></TableRow>}
              {!loading && books.length === 0 && <TableRow><TableCell colSpan={7} className="text-center">No books found. Add your first book!</TableCell></TableRow>}
              {!loading && books.map((book) => (
                <TableRow key={book.id}>
                    <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={book.title}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={book.thumbnail_url || 'https://placehold.co/64x64.png'}
                      width="64"
                      data-ai-hint={book.data_ai_hint || ''}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        {book.title}
                        {book.is_featured && <Star className="h-4 w-4 text-yellow-400" />}
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
                        <span>{book.categories?.name || 'Uncategorized'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={book.is_subscription ? "secondary" : "outline"} className="flex items-center gap-1 w-fit">
                      {book.is_subscription ? <BookLock /> : <FileText />}
                      <span>{book.is_subscription ? "Subscription" : "Purchase"}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>KES {book.price}</TableCell>
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
                        <DropdownMenuItem onSelect={() => handleDelete(book.id)} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <BookForm open={isFormOpen} onOpenChange={onFormOpenChange} book={selectedBook} onFormSubmit={fetchBooks} />
    </div>
  );
}