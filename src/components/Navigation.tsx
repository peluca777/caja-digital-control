
import React from 'react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  userRole: 'Cajero' | 'Supervisor';
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', roles: ['Cajero', 'Supervisor'] },
    { id: 'cash-register', label: 'Control de Caja', roles: ['Cajero', 'Supervisor'] },
    { id: 'transactions', label: 'Movimientos', roles: ['Cajero', 'Supervisor'] },
    { id: 'history', label: 'Historial', roles: ['Supervisor'] },
    { id: 'settings', label: 'Configuración', roles: ['Supervisor'] },
  ];

  const availableItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <nav className="flex flex-wrap gap-2 mb-6">
      {availableItems.map((item) => (
        <Button
          key={item.id}
          variant={currentView === item.id ? 'default' : 'outline'}
          onClick={() => onViewChange(item.id)}
          size="sm"
        >
          {item.label}
        </Button>
      ))}
    </nav>
  );
};

export default Navigation;
