import type { QuizQuestion } from '@/types/quiz';

export function parseQuizText(text: string): QuizQuestion[] {
  try {
    const questions: QuizQuestion[] = [];
    const questionBlocks = text.trim().split(/\n\s*\n/);

    for (const block of questionBlocks) {
      const lines = block.split('\n').filter(line => line.trim() !== '');
      if (lines.length < 2) continue;

      const questionMatch = lines[0].match(/^\d+\.\s*(.*)/);
      if (!questionMatch) continue;
      
      const question = questionMatch[1].trim();
      const options: string[] = [];
      const optionMap: { [key: string]: string } = {};
      let answerLineIndex = -1;

      lines.slice(1).forEach((line, index) => {
        const optionMatch = line.match(/^([A-Z])\)\s*(.*)/);
        if (optionMatch) {
          const letter = optionMatch[1];
          const text = optionMatch[2].trim();
          options.push(text);
          optionMap[letter] = text;
        }
        if (line.toLowerCase().startsWith('correct answer:')) {
          answerLineIndex = index + 1;
        }
      });
      
      if (answerLineIndex === -1) continue;

      const answerLine = lines[answerLineIndex];
      const answerMatch = answerLine.match(/Correct Answer:\s*([A-Z])/i);
      if (!answerMatch) continue;
      
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

    if (questions.length === 0) {
      throw new Error("Could not parse any questions from the provided text.");
    }

    return questions;
  } catch (error) {
    console.error("Failed to parse quiz text:", error);
    throw new Error("The AI returned data in an unexpected format. Please try generating the quiz again.");
  }
}
