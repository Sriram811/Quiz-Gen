'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, RotateCw } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/use-window-size';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export function QuizResults({ score, totalQuestions, onRestart }: QuizResultsProps) {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const isPerfectScore = score === totalQuestions && totalQuestions > 0;
  const { width, height } = useWindowSize();

  return (
    <>
      {isPerfectScore && width && height && <Confetti width={width} height={height} recycle={false} />}
      <Card className="w-full max-w-lg mx-auto animate-in fade-in zoom-in-95">
        <CardHeader className="items-center">
          <Award className="w-16 h-16 text-primary" />
          <CardTitle className="text-2xl mt-4">Quiz Completed!</CardTitle>
          <CardDescription>Here's how you did.</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-6xl font-bold text-primary">{percentage}%</div>
          <p className="text-lg text-muted-foreground">
            You answered {score} out of {totalQuestions} questions correctly.
          </p>
          <Button onClick={onRestart} size="lg">
            <RotateCw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
