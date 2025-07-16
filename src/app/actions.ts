// src/app/actions.ts
'use server';

import {
  generateDailyDevotional,
  type DailyDevotionalInput,
  type DailyDevotionalOutput,
} from '@/ai/flows/daily-devotional-message';
import { createClient } from '@/lib/supabase/server';
import type { TablesInsert } from '@/lib/database.types';

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
