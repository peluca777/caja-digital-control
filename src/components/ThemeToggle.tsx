
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-11 w-11 rounded-2xl glass-effect border-0 shadow-soft transition-smooth hover-lift"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-600" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-300" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="glass-effect border-0 shadow-soft dark:shadow-soft-dark rounded-2xl p-2"
      >
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="gap-3 cursor-pointer transition-smooth hover:bg-slate-100/80 dark:hover:bg-slate-700/50 text-slate-900 dark:text-slate-100 rounded-xl p-3 font-medium"
        >
          <Sun className="h-5 w-5" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="gap-3 cursor-pointer transition-smooth hover:bg-slate-100/80 dark:hover:bg-slate-700/50 text-slate-900 dark:text-slate-100 rounded-xl p-3 font-medium"
        >
          <Moon className="h-5 w-5" />
          <span>Oscuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="gap-3 cursor-pointer transition-smooth hover:bg-slate-100/80 dark:hover:bg-slate-700/50 text-slate-900 dark:text-slate-100 rounded-xl p-3 font-medium"
        >
          <Monitor className="h-5 w-5" />
          <span>Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
