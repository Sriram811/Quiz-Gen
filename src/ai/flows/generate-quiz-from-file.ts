'use server';

/**
 * @fileOverview Generates a quiz from a file content.
 *
 * - generateQuizFromFile - A function that handles the quiz generation process from a file.
 * - GenerateQuizFromFileInput - The input type for the generateQuizFromFile function.
 * - GenerateQuizFromFileOutput - The return type for the generateQuizFromFile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizFromFileInputSchema = z.object({
  fileContent: z.string().describe('The content of the file to generate a quiz from.'),
  topic: z.string().optional().describe('The topic of the quiz, if known.'),
});
export type GenerateQuizFromFileInput = z.infer<typeof GenerateQuizFromFileInputSchema>;

const GenerateQuizFromFileOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz questions.'),
});
export type GenerateQuizFromFileOutput = z.infer<typeof GenerateQuizFromFileOutputSchema>;

export async function generateQuizFromFile(input: GenerateQuizFromFileInput): Promise<GenerateQuizFromFileOutput> {
  return generateQuizFromFileFlow(input);
}

const generateQuizFromFilePrompt = ai.definePrompt({
  name: 'generateQuizFromFilePrompt',
  input: {schema: GenerateQuizFromFileInputSchema},
  output: {schema: GenerateQuizFromFileOutputSchema},
  prompt: `You are a quiz generator. Generate a multiple-choice quiz based on the content of the following file.\n\nFile Content: {{{fileContent}}}\n\nTopic (if available): {{{topic}}}\n\nQuiz should include at least 5 questions, each with 4 answer choices, and indicate the correct answer.\nThe output should be plain text and readable by humans.\n`,
});

const generateQuizFromFileFlow = ai.defineFlow(
  {
    name: 'generateQuizFromFileFlow',
    inputSchema: GenerateQuizFromFileInputSchema,
    outputSchema: GenerateQuizFromFileOutputSchema,
  },
  async input => {
    const {output} = await generateQuizFromFilePrompt(input);
    return output!;
  }
);
