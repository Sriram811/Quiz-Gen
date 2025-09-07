'use server';
/**
 * @fileOverview Generates multiple-choice questions based on a user-provided topic.
 *
 * - generateQuiz - A function that generates a quiz based on the given topic.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate multiple-choice questions.'),
  numQuestions: z.number().default(5).describe('The number of questions to generate.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium').describe('The difficulty level of the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The multiple-choice question.'),
      options: z.array(z.string()).describe('The possible answers for the question.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('An array of multiple-choice questions, their options, and correct answers.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are a quiz generator. Generate {{{numQuestions}}} multiple-choice questions about the topic: {{{topic}}}. The difficulty of the questions should be {{{difficulty}}}. For each question, provide 4 answer options, and indicate the correct answer.

Output the questions in JSON format.`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
