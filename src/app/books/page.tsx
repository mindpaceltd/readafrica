// src/app/books/page.tsx
import { createClient } from "@/lib/supabase/server";
import { BooksPageClient } from './books-page-client';

export default async function BooksPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createClient();

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('name');
  
  if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
  }

  const allTags = ['All', ...(categories?.map(c => c.name) || [])];

  const searchTerm = typeof searchParams.q === 'string' ? searchParams.q : '';
  const selectedTag = typeof searchParams.tag === 'string' ? searchParams.tag : 'All';
  const purchaseType = typeof searchParams.type === 'string' ? searchParams.type : 'all';

  let query = supabase
    .from('books')
    .select('*, categories(name)')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (searchTerm) {
    query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }

  if (selectedTag !== 'All') {
    query = query.eq('categories.name', selectedTag);
  }
  
  if (purchaseType !== 'all') {
    query = query.eq('is_subscription', purchaseType === 'subscription');
  }

  const { data: books, error: booksError } = await query;

  if (booksError) {
    console.error("Error fetching books:", booksError);
    return <div>Error loading books.</div>
  }

  // Remap book to fit EbookCard props
  const formattedBooks = books?.map(book => ({
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
      // The book object from the db doesn't have these, but the component expects them.
      // Providing default values to satisfy the type.
      previewContent: book.preview_content || "No preview available.",
      fullContent: "Full content is available after purchase.",
  })) || [];


  return (
    <BooksPageClient
        books={formattedBooks}
        allTags={allTags}
        initialSearchTerm={searchTerm}
        initialSelectedTag={selectedTag}
        initialPurchaseType={purchaseType}
    />
  );
}

