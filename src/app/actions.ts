// src/app/actions.ts
'use server';

import {
  generateDailyDevotional,
  type DailyDevotionalInput,
  type DailyDevotionalOutput,
} from '@/ai/flows/daily-devotional-message';
import { createClient } from '@/lib/supabase/server';
import type { Tables, TablesInsert } from '@/lib/database.types';

export async function getDailyDevotional(
  input: DailyDevotionalInput
): Promise<DailyDevotionalOutput> {
  try {
    const output = await generateDailyDevotional(input);
    return output;
  } catch (error) {
    console.error('Error generating daily devotional:', error);
    // In a real app, you might want to return a more user-friendly error or a fallback message
    throw new Error('Could not generate devotional message.');
  }
}

export async function submitVolunteerForm(formData: Omit<TablesInsert<'volunteers'>, 'id' | 'created_at' | 'status'>) {
    const supabase = createClient();
    const { data, error } = await supabase.from('volunteers').insert([
        { 
            full_name: formData.full_name,
            email: formData.email,
            phone_number: formData.phone_number,
            interests: formData.interests
        }
    ]);

    if (error) {
        console.error('Volunteer submission error:', error);
        throw new Error('There was an error submitting your application. Please try again.');
    }

    return { success: true, data };
}

export async function duplicateBook(bookId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('You must be logged in to duplicate a book.');
    }

    // 1. Fetch the original book data
    const { data: originalBook, error: fetchError } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();

    if (fetchError || !originalBook) {
        console.error('Error fetching book to duplicate:', fetchError);
        throw new Error('Could not find the book to duplicate.');
    }

    // 2. Prepare the new book data, ensuring all required fields are handled
    const newBookData: Omit<TablesInsert<'books'>, 'id' | 'created_at' | 'updated_at'> = {
        title: `${originalBook.title} (Copy)`,
        author: originalBook.author,
        description: originalBook.description,
        price: originalBook.price,
        is_subscription: originalBook.is_subscription,
        category_id: originalBook.category_id,
        status: 'draft', // Always create duplicates as drafts
        is_featured: false, // Don't feature duplicates by default
        bestseller: false, // Don't feature duplicates by default
        publisher_id: originalBook.publisher_id || user.id, // Assign to original publisher or current user
        tags: originalBook.tags,
        preview_content: originalBook.preview_content,
        full_content_url: originalBook.full_content_url,
        thumbnail_url: originalBook.thumbnail_url,
        data_ai_hint: originalBook.data_ai_hint,
        seo_title: originalBook.seo_title,
        seo_description: originalBook.seo_description,
    };
    
    // 3. Insert the new book as a copy
    const { data: newBook, error: insertError } = await supabase
        .from('books')
        .insert(newBookData)
        .select()
        .single();

    if (insertError) {
        console.error('Error duplicating book:', insertError);
        throw new Error('There was an error duplicating the book.');
    }

    return { success: true, data: newBook };
}
