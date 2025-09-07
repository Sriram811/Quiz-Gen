import { AppLogo } from '@/components/icons';

export function Header() {
  return (
    <header className="flex items-center justify-center gap-2 py-8">
      <AppLogo className="h-8 w-8 text-primary" />
      <h1 className="text-3xl font-bold tracking-tight text-primary font-headline">
        QuizWhiz
      </h1>
    </header>
  );
}
