'use client';

import { useState } from 'react';
import { generateQuiz } from '@/ai/flows/generate-quiz-from-topic';
import { generateQuizFromFile } from '@/ai/flows/generate-quiz-from-file';
import { useToast } from '@/hooks/use-toast';
import type { QuizQuestion } from '@/types/quiz';
import { Header } from '@/components/layout/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopicQuizForm } from '@/components/quiz/topic-quiz-form';
import { FileQuizForm } from '@/components/quiz/file-quiz-form';
import { QuizDisplay } from '@/components/quiz/quiz-display';
import { parseQuizText } from '@/lib/quiz-parser';
import { Spinner } from '@/components/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const { toast } = useToast();

  const handleGenerationError = (error: any) => {
    console.error(error);
    toast({
      variant: 'destructive',
      title: 'Oh no! Something went wrong.',
      description: error.message || 'There was a problem generating your quiz. Please try again.',
    });
    setQuiz(null);
  };

  const handleGenerateFromTopic = async (topic: string, numQuestions: number, difficulty: Difficulty) => {
    setIsLoading(true);
    setQuiz(null);
    try {
      const result = await generateQuiz({ topic, numQuestions, difficulty });
      if (!result.questions || result.questions.length === 0) {
        throw new Error("The AI didn't return any questions. Please try a different topic.");
      }
      setQuiz(result.questions);
    } catch (error) {
      handleGenerationError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFromFile = async (fileDataUri: string, numQuestions: number, difficulty: Difficulty) => {
    setIsLoading(true);
    setQuiz(null);
    try {
      const result = await generateQuizFromFile({ fileDataUri, numQuestions, difficulty });
      const parsedQuiz = parseQuizText(result.quiz);
      if (parsedQuiz.length === 0 && result.quiz.trim().length > 0) {
        throw new Error("Could not parse any questions from the provided text.");
      }
      setQuiz(parsedQuiz);
    } catch (error) {
      handleGenerationError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const restartQuiz = () => {
    setQuiz(null);
  };

  const renderContent = () => {
    if (quiz) {
      return <QuizDisplay quiz={quiz} onRestart={restartQuiz} />;
    }

    if (isLoading) {
      return (
        <Card className="w-full max-w-lg mx-auto text-center">
            <CardHeader>
                <CardTitle>Generating Your Quiz</CardTitle>
                <CardDescription>The AI is working its magic...</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center py-8">
                    <Spinner className="w-12 h-12 animate-spin text-primary" />
                </div>
            </CardContent>
        </Card>
      )
    }

    return (
      <Tabs defaultValue="topic" className="w-full max-w-lg mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="topic">From Topic</TabsTrigger>
          <TabsTrigger value="file">From File</TabsTrigger>
        </TabsList>
        <TabsContent value="topic">
          <TopicQuizForm onGenerate={handleGenerateFromTopic} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="file">
          <FileQuizForm onGenerate={handleGenerateFromFile} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container px-4 pb-12">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        Powered by Genkit
      </footer>
    </div>
  );
}
