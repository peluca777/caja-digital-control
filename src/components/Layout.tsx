
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogOut, DollarSign, User, Shield } from 'lucide-react';
import { getCurrentUser, clearCurrentUser } from '@/lib/storage';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, delay: 0.1, ease: "easeOut" }
  }
};

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
      <motion.header 
        className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-700/50 glass-effect card-shadow"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 sm:space-x-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <motion.div 
                  className="w-10 h-10 sm:w-12 sm:h-12 gradient-primary flex items-center justify-center card-shadow rounded-2xl sm:rounded-3xl transition-all-smooth group"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <DollarSign className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </motion.div>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Control de Caja</h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">Sistema Inteligente de Gestión</p>
                </div>
              </div>
              <div className="hidden sm:block px-3 py-2 rounded-2xl glass-effect border border-slate-200/50 dark:border-slate-700/50 card-shadow">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.role}</span>
                </div>
              </div>
            </div>
            
            {/* User Section */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-9 h-9 sm:w-11 sm:h-11 glass-effect rounded-xl sm:rounded-2xl flex items-center justify-center card-shadow">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 dark:text-slate-300" />
                </div>
                <div className="text-right">
                  <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">Hola, {user.name}</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-center">
                    <motion.div 
                      className="w-2 h-2 bg-emerald-500 rounded-full mr-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    Sesión Activa
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <ThemeToggle />
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout} 
                    size="sm" 
                    className="glass-effect border-0 text-slate-900 dark:text-slate-100 card-shadow transition-all-smooth rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 h-auto"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                    <span className="hidden sm:inline">Cerrar Sesión</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Main Content */}
      <motion.main 
        className="container mx-auto px-4 sm:px-6 py-6 sm:py-8"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default Layout;
