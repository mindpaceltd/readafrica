'use server';

import {
  generateDailyDevotional,
  type DailyDevotionalInput,
  type DailyDevotionalOutput,
} from '@/ai/flows/daily-devotional-message';

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
