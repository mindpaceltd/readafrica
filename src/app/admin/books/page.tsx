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
import { PlusCircle, MoreHorizontal, Star, FileText, BookLock, Circle, FolderKanban, Copy, Award, CheckCircle2, Edit } from "lucide-react";
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
import type { Tables, TablesUpdate } from "@/lib/database.types";
import { useToast } from "@/hooks/use-toast";
import { duplicateBook } from "@/app/actions";
import { cn } from "@/lib/utils";

type BookWithCategoryAndPublisher = Tables<'books'> & {
  categories: { name: string } | null;
  profiles: { full_name: string | null } | null;
};

export default function ManageBooksPage() {
  const { toast } = useToast();
  const supabase = createClient();
  const [books, setBooks] = useState<BookWithCategoryAndPublisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookWithCategoryAndPublisher | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('books')
      .select('*, categories(name), profiles(full_name)')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Error fetching books", description: error.message, variant: "destructive" });
    } else if (data) {
      setBooks(data as BookWithCategoryAndPublisher[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleEdit = (book: BookWithCategoryAndPublisher) => {
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

  const handleDuplicate = async (bookId: string) => {
    try {
        await duplicateBook(bookId);
        toast({ title: "Book duplicated successfully", description: "A new draft has been created." });
        fetchBooks();
    } catch (error) {
        toast({ title: "Error duplicating book", description: (error as Error).message, variant: "destructive" });
    }
  }

  const handleStatusChange = async (book: BookWithCategoryAndPublisher, newStatus: 'published' | 'draft') => {
      const { error } = await supabase
        .from('books')
        .update({ status: newStatus })
        .eq('id', book.id);
    
     if (error) {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Book status updated" });
      fetchBooks();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-headline text-primary">Manage Books</h1>
            <p className="text-muted-foreground">Add, edit, approve and manage all e-books in the system.</p>
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
                <TableHead>Publisher</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Attributes</TableHead>
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
                    {book.title}
                  </TableCell>
                  <TableCell>{book.profiles?.full_name || 'N/A'}</TableCell>
                   <TableCell>
                      <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Badge variant={book.status === 'published' ? 'default' : 'secondary'} className={cn("cursor-pointer", book.status === 'published' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600')}>
                                <Circle className={`mr-1 h-2 w-2 ${book.status === 'published' ? 'fill-white' : 'fill-current'}`} />
                                {book.status === 'published' ? 'Published' : 'Draft'}
                            </Badge>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent>
                           <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                           <DropdownMenuItem onClick={() => handleStatusChange(book, 'published')} disabled={book.status === 'published'}>
                             <CheckCircle2 className="mr-2 text-green-600" /> Publish
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleStatusChange(book, 'draft')} disabled={book.status === 'draft'}>
                             <Edit className="mr-2" /> Move to Drafts
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                      </DropdownMenu>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                        {book.is_featured && <Badge variant="outline" className="flex items-center gap-1"><Star className="h-3 w-3" /> Featured</Badge>}
                        {book.bestseller && <Badge variant="outline" className="flex items-center gap-1 text-yellow-600 border-yellow-500"><Award className="h-3 w-3" /> Bestseller</Badge>}
                    </div>
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
                        <DropdownMenuItem onSelect={() => handleDuplicate(book.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                        </DropdownMenuItem>
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