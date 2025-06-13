
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, DollarSign, User, Shield } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Animated background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] [background-size:20px_20px] pointer-events-none"></div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-700/50 glass-effect shadow-soft">
        <div className="container mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center space-x-6 animate-slide-up">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 gradient-primary flex items-center justify-center shadow-soft rounded-3xl transition-smooth hover-lift group">
                  <DollarSign className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Control de Caja</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Sistema Inteligente de Gestión</p>
                </div>
              </div>
              <div className="px-4 py-2 rounded-2xl glass-effect border border-slate-200/50 dark:border-slate-700/50 shadow-soft">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.role}</span>
                </div>
              </div>
            </div>
            
            {/* User Section */}
            <div className="flex items-center space-x-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center space-x-4">
                <div className="w-11 h-11 glass-effect rounded-2xl flex items-center justify-center shadow-soft">
                  <User className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Hola, {user.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                    Sesión Activa
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  size="sm" 
                  className="glass-effect border-0 text-slate-900 dark:text-slate-100 shadow-soft transition-smooth hover-lift rounded-2xl px-5 py-3 h-auto"
                >
                  <LogOut className="w-5 h-5 mr-2" />
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
