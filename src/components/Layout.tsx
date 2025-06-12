import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, DollarSign } from 'lucide-react';
import { getCurrentUser, clearCurrentUser } from '@/lib/storage';
import { User } from '@/lib/types';
interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}
const Layout: React.FC<LayoutProps> = ({
  children,
  onLogout
}) => {
  const user = getCurrentUser();
  const handleLogout = () => {
    clearCurrentUser();
    onLogout();
  };
  if (!user) return null;
  return <div className="min-h-screen bg-gray-700">
      <header className="bg-card border-b border-border sticky top-0 z-50 card-shadow">
        <div className="container mx-auto px-6 py-4 bg-slate-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 animate-slide-in-right">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary flex items-center justify-center card-shadow rounded-xl">
                  <DollarSign className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-semibold text-foreground">
                  Control de Caja
                </h1>
              </div>
              <div className="border border-border px-3 py-1 rounded-lg bg-slate-200">
                <span className="text-sm font-medium text-foreground">{user.role}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 animate-fade-in" style={{
            animationDelay: '0.1s'
          }}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-foreground">
                  Hola, <span className="font-medium">{user.name}</span>
                </span>
              </div>
              <Button variant="outline" onClick={handleLogout} size="sm" className="bg-card border-border text-foreground hover:bg-secondary hover:border-accent/50 transition-all-smooth card-shadow hover:card-shadow-hover">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-6 animate-fade-in bg-gray-50">
        {children}
      </main>
    </div>;
};
export default Layout;