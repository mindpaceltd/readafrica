// This file provides a type definition for the Book object used in components.
// Actual data is fetched from Supabase.

export type Book = {
  id: string;
  title: string;
  description: string;
  price: string;
  thumbnailUrl: string;
  dataAiHint: string;
  previewContent: string;
  fullContent: string; // In a real app, this might be a URL to the content
  isFeatured?: boolean;
  isSubscription?: boolean;
  readCount?: number;
  tags?: string[];
  category?: string;
  status: 'published' | 'draft';
  seoTitle?: string;
  seoDescription?: string;
};

// Mock data is no longer used, but the getBookById function signature is kept
// to avoid breaking imports in components that are not yet updated.
export const books: Book[] = [];

export const getBookById = (id: string): Book | undefined => {
    return undefined;
};

