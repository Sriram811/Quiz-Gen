import type { QuizQuestion } from '@/types/quiz';

export function parseQuizText(text: string): QuizQuestion[] {
  try {
    const questions: QuizQuestion[] = [];
    // Split by one or more newlines, which might be followed by another newline.
    // This is more robust to variations in spacing between question blocks.
    const questionBlocks = text.trim().split(/\n\s*\n/);

    for (const block of questionBlocks) {
      const lines = block.split('\n').filter(line => line.trim() !== '');
      if (lines.length < 2) continue;

      // Find the question line, which usually starts with a number.
      const questionLineIndex = lines.findIndex(line => /^\d+\.\s*/.test(line));
      if (questionLineIndex === -1) continue;

      const questionMatch = lines[questionLineIndex].match(/^\d+\.\s*(.*)/);
      if (!questionMatch) continue;
      
      const question = questionMatch[1].trim();
      const options: string[] = [];
      const optionMap: { [key: string]: string } = {};
      
      // Find the answer line and its index
      const answerLineIndex = lines.findIndex(line => line.toLowerCase().startsWith('correct answer:'));
      if (answerLineIndex === -1) continue;
      
      const answerLine = lines[answerLineIndex];
      const answerMatch = answerLine.match(/Correct Answer:\s*([A-Z])/i);
      if (!answerMatch) continue;

      // Options are lines between the question and the answer
      const optionLines = lines.slice(questionLineIndex + 1, answerLineIndex);

      optionLines.forEach((line) => {
        const optionMatch = line.match(/^([A-Z])\)\s*(.*)/);
        if (optionMatch) {
          const letter = optionMatch[1];
          const text = optionMatch[2].trim();
          options.push(text);
          optionMap[letter] = text;
        }
      });
      
      const correctLetter = answerMatch[1].toUpperCase();
      const correctAnswer = optionMap[correctLetter];

      if (question && options.length > 1 && correctAnswer) {
        questions.push({
          question,
          options,
          correctAnswer,
        });
      }
    }

    if (questions.length === 0 && text.trim().length > 0) {
      throw new Error("Could not parse any questions from the provided text.");
    }

    return questions;
  } catch (error) {
    console.error("Failed to parse quiz text:", error);
    if (error instanceof Error && error.message.includes("Could not parse")) {
      throw new Error("The AI returned data in an unexpected format. Please try generating the quiz again.");
    }
    throw new Error("An unexpected error occurred while parsing the quiz.");
  }
}
