import { AppLogo } from '@/components/icons';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="flex items-center gap-2 px-4 py-3 border-b">
      <SidebarTrigger className="md:hidden"/>
      <AppLogo className="h-8 w-8 text-primary" />
      <h1 className="text-xl font-bold tracking-tight text-primary font-headline">
        QuizWhiz
      </h1>
    </header>
  );
}
