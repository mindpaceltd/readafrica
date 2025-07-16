// This file is no longer needed as we are fetching data from Supabase.
// It is kept to prevent breaking imports in components that are not yet updated.

export type Book = {
  id: string;
  title: string;
  description: string;
  price: string;
  thumbnailUrl: string;
  dataAiHint: string;
  previewContent: string;
  fullContent: string;
  isFeatured?: boolean;
  isSubscription?: boolean;
  readCount?: number;
  tags?: string[];
  category?: string;
  status: 'published' | 'draft';
  seoTitle?: string;
  seoDescription?: string;
};

export const books: Book[] = [];

export const getBookById = (id: string): Book | undefined => {
    return undefined;
};
