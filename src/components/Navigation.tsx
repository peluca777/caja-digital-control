
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
    <nav className="flex flex-wrap gap-3 mb-8 animate-slide-up">
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
              transition-smooth hover-lift rounded-2xl px-6 py-3 relative overflow-hidden group
              ${isActive 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-blue-600' 
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm'
              }
            `}
            style={{ 
              animationDelay: `${index * 0.05}s`
            }}
          >
            <IconComponent className="w-4 h-4 mr-2" />
            <span className="font-medium">{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );
};

export default Navigation;
