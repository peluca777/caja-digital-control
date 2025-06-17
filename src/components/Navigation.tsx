
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BarChart3, Coins, List, History, Settings } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userRole: 'Cajero' | 'Supervisor';
}

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

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', roles: ['Cajero', 'Supervisor'], icon: BarChart3 },
    { id: 'cash-register', label: 'Control de Caja', roles: ['Cajero', 'Supervisor'], icon: Coins },
    { id: 'transactions', label: 'Movimientos', roles: ['Cajero', 'Supervisor'], icon: List },
    { id: 'history', label: 'Historial', roles: ['Supervisor'], icon: History },
    { id: 'settings', label: 'Configuración', roles: ['Supervisor'], icon: Settings },
  ];

  const availableItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <motion.nav 
      className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {availableItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <motion.div key={item.id} variants={itemVariants}>
            <Button
              variant={isActive ? 'default' : 'outline'}
              onClick={() => onViewChange(item.id)}
              size="sm"
              className={`
                transition-all-smooth rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-3 sm:py-4 h-auto relative overflow-hidden group card-shadow
                ${isActive 
                  ? 'gradient-primary text-white border-0' 
                  : 'glass-effect border-0 text-slate-900 dark:text-slate-100 hover:card-shadow-hover'
                }
              `}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                }`} />
                <span className="font-bold text-xs sm:text-sm">{item.label}</span>
              </div>
              {isActive && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Button>
          </motion.div>
        );
      })}
    </motion.nav>
  );
};

export default Navigation;
