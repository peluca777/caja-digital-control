
import React from 'react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userRole: 'Cajero' | 'Supervisor';
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', roles: ['Cajero', 'Supervisor'], icon: '📊' },
    { id: 'cash-register', label: 'Control de Caja', roles: ['Cajero', 'Supervisor'], icon: '💰' },
    { id: 'transactions', label: 'Movimientos', roles: ['Cajero', 'Supervisor'], icon: '📝' },
    { id: 'history', label: 'Historial', roles: ['Supervisor'], icon: '📚' },
    { id: 'settings', label: 'Configuración', roles: ['Supervisor'], icon: '⚙️' },
  ];

  const availableItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <nav className="flex flex-wrap gap-3 mb-8 animate-slide-up">
      {availableItems.map((item, index) => (
        <Button
          key={item.id}
          variant={currentView === item.id ? 'default' : 'outline'}
          onClick={() => onViewChange(item.id)}
          size="sm"
          className={`
            transition-all-smooth hover-lift animate-fade-in
            ${currentView === item.id 
              ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20' 
              : 'bg-card/50 border-border/50 hover:bg-primary/10 hover:border-primary/30'
            }
          `}
          style={{ 
            animationDelay: `${index * 0.1}s`,
            '--stagger-index': index 
          }}
        >
          <span className="mr-2">{item.icon}</span>
          {item.label}
        </Button>
      ))}
    </nav>
  );
};

export default Navigation;
