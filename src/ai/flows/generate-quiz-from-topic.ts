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
  prompt: `You are a quiz generator. Generate 5 multiple-choice questions about the topic: {{{topic}}}. For each question, provide 4 answer options, and indicate the correct answer.

Output the questions in JSON format:
{
  "questions": [
    {
      "question": "Question 1",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    },
    {
      "question": "Question 2",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B"
    },
       {
      "question": "Question 3",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option C"
    },
       {
      "question": "Question 4",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option D"
    },
       {
      "question": "Question 5",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    }
  ]
}`,
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
