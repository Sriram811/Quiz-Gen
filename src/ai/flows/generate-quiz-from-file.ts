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
  fileDataUri: z
    .string()
    .describe(
      "The file to generate a quiz from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  topic: z.string().optional().describe('The topic of the quiz, if known.'),
  numQuestions: z.number().default(5).describe('The number of questions to generate.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium').describe('The difficulty level of the quiz.'),
});
export type GenerateQuizFromFileInput = z.infer<typeof GenerateQuizFromFileInputSchema>;

const GenerateQuizFromFileOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz as a JSON string. The JSON should be an object with a "questions" array, where each question has "question", "options", and "correctAnswer" properties.'),
});
export type GenerateQuizFromFileOutput = z.infer<typeof GenerateQuizFromFileOutputSchema>;

export async function generateQuizFromFile(input: GenerateQuizFromFileInput): Promise<GenerateQuizFromFileOutput> {
  return generateQuizFromFileFlow(input);
}

const generateQuizFromFilePrompt = ai.definePrompt({
  name: 'generateQuizFromFilePrompt',
  input: {schema: GenerateQuizFromFileInputSchema},
  output: {schema: GenerateQuizFromFileOutputSchema},
  prompt: `You are a quiz generator. Generate a multiple-choice quiz based on the content of the following file.

File Content: {{media url=fileDataUri}}

Topic (if available): {{{topic}}}

Generate {{{numQuestions}}} questions with a difficulty level of {{{difficulty}}}.
Each question must have 4 answer choices.

IMPORTANT: You must output a single, valid JSON object containing a "questions" array.
Each object in the "questions" array must have the following properties:
- "question": a string containing the question text.
- "options": an array of 4 strings representing the answer choices.
- "correctAnswer": a string containing the correct answer, which must exactly match one of the strings in the "options" array.

Do not include any other text, markdown, or formatting outside of the JSON object.
`,
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
