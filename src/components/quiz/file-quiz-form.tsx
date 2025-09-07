'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Spinner } from '@/components/icons';

const ACCEPTED_FILE_TYPES = [
  'text/plain',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
];

const formSchema = z.object({
  file:
    typeof window === 'undefined'
      ? z.any()
      : z
          .instanceof(FileList)
          .refine((files) => files?.length === 1, 'File is required.')
          .refine(
            (files) => files?.[0] && ACCEPTED_FILE_TYPES.includes(files[0].type),
            '.txt, .pdf, .docx, and .pptx files are supported.'
          ),
});

interface FileQuizFormProps {
  onGenerate: (fileDataUri: string) => void;
  isLoading: boolean;
}

export function FileQuizForm({ onGenerate, isLoading }: FileQuizFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register('file');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const file = values.file[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onGenerate(content);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Generate from File
        </CardTitle>
        <CardDescription>Upload a .txt, .pdf, .docx, or .pptx file to create a quiz.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input type="file" accept={ACCEPTED_FILE_TYPES.join(',')} {...fileRef} />
                  </FormControl>
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
      </CardContent>
    </Card>
  );
}
