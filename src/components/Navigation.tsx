
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BarChart3, Calculator, FileText, History, Settings, User } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userRole: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, userRole }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'cash-register', label: 'Caja', icon: Calculator },
    { id: 'transactions', label: 'Movimientos', icon: FileText },
    { id: 'history', label: 'Historial', icon: History },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.nav 
      className="mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <motion.div key={item.id} variants={itemVariants}>
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onViewChange(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700' 
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default Navigation;
