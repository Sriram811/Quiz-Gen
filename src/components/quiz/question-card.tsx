'use client';

import type { QuizQuestion } from '@/types/quiz';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSubmit: (isCorrect: boolean) => void;
}

export function QuestionCard({ question, questionNumber, totalQuestions, onAnswerSubmit }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) return;
    setIsSubmitted(true);
    onAnswerSubmit(selectedOption === question.correctAnswer);
  };

  const getOptionClass = (option: string) => {
    if (!isSubmitted) return '';
    if (option === question.correctAnswer) return 'bg-green-100 dark:bg-green-900 border-green-500';
    if (option === selectedOption) return 'bg-red-100 dark:bg-red-900 border-red-500';
    return '';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto animate-in fade-in">
      <CardHeader>
        <CardDescription>
          Question {questionNumber} of {totalQuestions}
        </CardDescription>
        <CardTitle>{question.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <RadioGroup
            value={selectedOption ?? ''}
            onValueChange={setSelectedOption}
            disabled={isSubmitted}
            className="space-y-4"
          >
            {question.options.map((option, index) => (
              <Label
                key={index}
                className={cn(
                  'flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent/50',
                  getOptionClass(option)
                )}
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                <span>{option}</span>
                {isSubmitted && option === question.correctAnswer && <CheckCircle className="ml-auto text-green-600" />}
                {isSubmitted && option === selectedOption && option !== question.correctAnswer && <XCircle className="ml-auto text-red-600" />}
              </Label>
            ))}
          </RadioGroup>
          <Button type="submit" disabled={isSubmitted || !selectedOption} className="mt-6 w-full">
            Submit Answer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
