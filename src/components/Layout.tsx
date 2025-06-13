
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, DollarSign, User } from 'lucide-react';
import { getCurrentUser, clearCurrentUser } from '@/lib/storage';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const user = getCurrentUser();

  const handleLogout = () => {
    clearCurrentUser();
    onLogout();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center space-x-4 animate-slide-down">
              <div className="flex items-center space-x-4">
                <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-elevated rounded-2xl hover-glow transition-smooth">
                  <DollarSign className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Control de Caja</h1>
                  <p className="text-xs text-muted-foreground">Sistema de gestión</p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-accent/50 border border-border/30">
                <span className="text-sm font-medium text-foreground">{user.role}</span>
              </div>
            </div>
            
            {/* User Section */}
            <div className="flex items-center space-x-4 animate-slide-down" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center shadow-soft">
                  <User className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">Hola, {user.name}</p>
                  <p className="text-xs text-muted-foreground">Sesión activa</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  size="sm" 
                  className="bg-card/50 border-border/50 text-foreground hover:bg-accent/30 hover:border-primary/30 transition-smooth shadow-soft rounded-xl hover-lift"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 animate-fade-in">
        <div className="relative">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
