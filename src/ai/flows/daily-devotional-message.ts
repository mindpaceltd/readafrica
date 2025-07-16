// src/ai/flows/daily-devotional-message.ts
'use server';

/**
 * @fileOverview Generates a daily prophetic message or devotional using AI.
 *
 * - generateDailyDevotional - A function that generates the daily devotional message.
 * - DailyDevotionalInput - The input type for the generateDailyDevotional function.
 * - DailyDevotionalOutput - The return type for the generateDailyDevotional function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyDevotionalInputSchema = z.object({
  mood: z
    .string()
    .optional()
    .describe(
      'The user selected mood for the devotional. e.g. "Faith", "Anxiety", "Breakthrough"'
    ),
});
export type DailyDevotionalInput = z.infer<typeof DailyDevotionalInputSchema>;

const DailyDevotionalOutputSchema = z.object({
  message: z
    .string()
    .describe('The generated daily prophetic message or devotional.'),
});
export type DailyDevotionalOutput = z.infer<typeof DailyDevotionalOutputSchema>;

export async function generateDailyDevotional(
  input: DailyDevotionalInput
): Promise<DailyDevotionalOutput> {
  return generateDailyDevotionalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyDevotionalPrompt',
  input: {schema: DailyDevotionalInputSchema},
  output: {schema: DailyDevotionalOutputSchema},
  prompt: `You are a spiritual guide who provides daily prophetic messages and devotionals.
  Generate a unique and inspiring message for the day.
  The message should be uplifting and provide spiritual guidance to the reader.

  If the user has provided a mood, tailor the message to be especially encouraging for someone feeling that way.
  User's mood: {{{mood}}}

  Message:`,
});

const generateDailyDevotionalFlow = ai.defineFlow(
  {
    name: 'generateDailyDevotionalFlow',
    inputSchema: DailyDevotionalInputSchema,
    outputSchema: DailyDevotionalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
