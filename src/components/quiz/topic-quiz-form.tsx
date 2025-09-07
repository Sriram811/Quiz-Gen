'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Spinner } from '@/components/icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Difficulty } from '@/app/page';

const formSchema = z.object({
  topic: z.string().min(2, {
    message: 'Topic must be at least 2 characters.',
  }),
  numQuestions: z.coerce.number().min(1, 'Must have at least 1 question.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
});

interface TopicQuizFormProps {
  onGenerate: (topic: string, numQuestions: number, difficulty: Difficulty) => void;
  isLoading: boolean;
}

export function TopicQuizForm({ onGenerate, isLoading }: TopicQuizFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      numQuestions: 5,
      difficulty: 'Medium',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onGenerate(values.topic, values.numQuestions, values.difficulty as Difficulty);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quiz Topic</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Roman Empire" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numQuestions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Questions</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Quiz'
          )}
        </Button>
      </form>
    </Form>
  );
}
