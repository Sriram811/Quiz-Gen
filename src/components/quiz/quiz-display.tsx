'use client';

import type { QuizQuestion } from '@/types/quiz';
import { useState } from 'react';
import { QuestionCard } from './question-card';
import { QuizResults } from './quiz-results';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface QuizDisplayProps {
  quiz: QuizQuestion[];
  onRestart: () => void;
}

export function QuizDisplay({ quiz, onRestart }: QuizDisplayProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isAborted, setIsAborted] = useState(false);

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setCurrentQuestionIndex((prev) => prev + 1);
  };
  
  const handleAbort = () => {
    setIsAborted(true);
  }

  const progress = ((currentQuestionIndex + (isAnswered ? 1: 0)) / quiz.length) * 100;
  const isQuizFinished = currentQuestionIndex >= quiz.length || isAborted;

  if (isQuizFinished) {
    return <QuizResults score={score} totalQuestions={quiz.length} onRestart={onRestart} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div>
        <Progress value={progress} className="w-full h-2" />
      </div>
      <QuestionCard
        question={quiz[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={quiz.length}
        onAnswerSubmit={handleAnswerSubmit}
      />
      <div className="flex justify-center items-center gap-4">
        {isAnswered && (
          <Button onClick={handleNextQuestion} className="animate-in fade-in">
            {currentQuestionIndex === quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        )}
        <Button onClick={handleAbort} variant="ghost" size="sm">
            End Quiz
        </Button>
      </div>
    </div>
  );
}
