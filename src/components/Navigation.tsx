
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChartBar, CashRegister, List, History, Settings } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userRole: 'Cajero' | 'Supervisor';
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', roles: ['Cajero', 'Supervisor'], icon: ChartBar },
    { id: 'cash-register', label: 'Control de Caja', roles: ['Cajero', 'Supervisor'], icon: CashRegister },
    { id: 'transactions', label: 'Movimientos', roles: ['Cajero', 'Supervisor'], icon: List },
    { id: 'history', label: 'Historial', roles: ['Supervisor'], icon: History },
    { id: 'settings', label: 'Configuración', roles: ['Supervisor'], icon: Settings },
  ];

  const availableItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <nav className="flex flex-wrap gap-3 mb-8 animate-slide-up">
      {availableItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <Button
            key={item.id}
            variant={currentView === item.id ? 'default' : 'outline'}
            onClick={() => onViewChange(item.id)}
            size="sm"
            className={`
              transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg animate-fade-in
              ${currentView === item.id 
                ? 'bg-blue-600 hover:bg-blue-700 text-black shadow-lg border-blue-500' 
                : 'bg-blue-50 border-blue-300 text-black hover:bg-blue-100 hover:border-blue-400'
              }
            `}
            style={{ 
              animationDelay: `${index * 0.1}s`
            }}
          >
            <IconComponent className="w-4 h-4 mr-2" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );
};

export default Navigation;
