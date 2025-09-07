import { AppLogo } from '@/components/icons';

export function Header() {
  return (
    <header className="flex items-center gap-4 p-4 border-b bg-background">
      <AppLogo className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">
        QuizWhiz
      </h1>
    </header>
  );
}
