
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

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const user = getCurrentUser();

  const handleLogout = () => {
    clearCurrentUser();
    onLogout();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-white border-b border-blue-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 animate-slide-in-right">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-black">
                  Control de Caja
                </h1>
              </div>
              <div className="bg-blue-100 border border-blue-300 px-3 py-1 rounded-full animate-bounce-gentle">
                <span className="text-sm font-medium text-black">{user.role}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-black">
                  Hola, <span className="font-medium">{user.name}</span>
                </span>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                size="sm"
                className="bg-white border-blue-300 text-black hover:bg-blue-50 hover:border-blue-400 transition-all-smooth hover-lift"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;
