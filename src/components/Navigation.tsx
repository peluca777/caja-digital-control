
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
    <nav className="flex flex-wrap gap-4 mb-8 animate-slide-up">
      {availableItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <Button
            key={item.id}
            variant={currentView === item.id ? 'default' : 'outline'}
            onClick={() => onViewChange(item.id)}
            size="sm"
            className={`
              transition-all-smooth hover:shadow-md hover:scale-105 animate-fade-in
              ${currentView === item.id 
                ? 'bg-primary hover:bg-primary/90 text-white shadow-md border-primary' 
                : 'bg-white border-border text-foreground hover:bg-secondary hover:border-primary/50'
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
