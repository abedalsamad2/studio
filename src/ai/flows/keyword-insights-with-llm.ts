'use server';

/**
 * @fileOverview A Genkit flow for providing keyword insights using an LLM.
 *
 * - keywordInsightsWithLLM - A function that takes keyword data and returns LLM-generated insights.
 * - KeywordInsightsInput - The input type for the keywordInsightsWithLLM function.
 * - KeywordInsightsOutput - The return type for the keywordInsightsWithLLM function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KeywordInsightsInputSchema = z.object({
  keyword: z.string().describe('The seed keyword for analysis.'),
  locale: z.string().describe('The locale for keyword analysis (e.g., en-US).'),
  searchVolume: z.number().describe('The average monthly search volume for the keyword.'),
  cpc: z.number().describe('The cost per click for the keyword.'),
  competition: z
    .number()
    .describe('The competition level for the keyword (0-1).'),
  source: z.string().describe('The source of the keyword data (e.g., Google Ads, Trends).'),
});
export type KeywordInsightsInput = z.infer<typeof KeywordInsightsInputSchema>;

const KeywordInsightsOutputSchema = z.object({
  insights: z.string().describe('LLM-generated insights on the keyword data.'),
});
export type KeywordInsightsOutput = z.infer<typeof KeywordInsightsOutputSchema>;

export async function keywordInsightsWithLLM(input: KeywordInsightsInput): Promise<KeywordInsightsOutput> {
  return keywordInsightsWithLLMFlow(input);
}

const keywordInsightsPrompt = ai.definePrompt({
  name: 'keywordInsightsPrompt',
  input: {schema: KeywordInsightsInputSchema},
  output: {schema: KeywordInsightsOutputSchema},
  prompt: `You are an SEO expert providing insights on keyword data.

  Based on the following information, provide insights on high-potential keywords and suggest content ideas.

  Keyword: {{{keyword}}}
  Locale: {{{locale}}}
  Search Volume: {{{searchVolume}}}
  CPC: {{{cpc}}}
  Competition: {{{competition}}}
  Source: {{{source}}}

  Insights:`,
});

const keywordInsightsWithLLMFlow = ai.defineFlow(
  {
    name: 'keywordInsightsWithLLMFlow',
    inputSchema: KeywordInsightsInputSchema,
    outputSchema: KeywordInsightsOutputSchema,
  },
  async input => {
    const {output} = await keywordInsightsPrompt(input);
    return output!;
  }
);
