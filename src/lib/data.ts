// This file provides a type definition for the Book object used in components.
// Actual data is fetched from Supabase.
import type { Tables } from './database.types';

export type Book = Omit<Tables<'books'>, 'full_content_url'>;

// Mock data is no longer used, but the getBookById function signature is kept
// to avoid breaking imports in components that are not yet updated.
export const books: Book[] = [];

export const getBookById = (id: string): Book | undefined => {
    return undefined;
};
