
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center space-x-4 animate-slide-up">
              <div className="flex items-center space-x-4">
                <div className="w-11 h-11 bg-blue-600 hover:bg-blue-700 flex items-center justify-center shadow-lg rounded-2xl transition-smooth hover-lift">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Control de Caja</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Sistema de gestión</p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.role}</span>
              </div>
            </div>
            
            {/* User Section */}
            <div className="flex items-center space-x-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-sm">
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Hola, {user.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Sesión activa</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  size="sm" 
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-smooth shadow-sm rounded-xl hover-lift"
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
