
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Coins, List, History, Settings } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userRole: 'Cajero' | 'Supervisor';
}

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
    <nav className="flex flex-wrap gap-4 mb-10 animate-slide-up">
      {availableItems.map((item, index) => {
        const IconComponent = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? 'default' : 'outline'}
            onClick={() => onViewChange(item.id)}
            size="sm"
            className={`
              transition-smooth hover-lift rounded-3xl px-8 py-4 h-auto relative overflow-hidden group shadow-soft
              ${isActive 
                ? 'gradient-primary text-white border-0 shadow-xl' 
                : 'glass-effect border-0 text-slate-900 dark:text-slate-100 hover:shadow-xl'
              }
            `}
            style={{ 
              animationDelay: `${index * 0.08}s`
            }}
          >
            <div className="flex items-center space-x-3">
              <IconComponent className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'
              }`} />
              <span className="font-bold text-sm">{item.label}</span>
            </div>
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
            )}
          </Button>
        );
      })}
    </nav>
  );
};

export default Navigation;
