
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCurrentUser, clearCurrentUser } from '@/lib/storage';
import { User } from '@/lib/types';

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
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">Control de Caja</h1>
              <div className="bg-primary/10 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-primary">{user.role}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Hola, <span className="font-medium text-foreground">{user.name}</span>
              </span>
              <Button variant="outline" onClick={handleLogout} size="sm">
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
