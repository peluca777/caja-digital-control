
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Coins, List, History, Settings, Sparkles } from 'lucide-react';

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
                ? 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-elevated border-primary' 
                : 'bg-card/50 border-border/50 text-foreground hover:bg-accent/30 hover:border-primary/30 shadow-soft backdrop-blur-sm'
              }
            `}
            style={{ 
              animationDelay: `${index * 0.05}s`
            }}
          >
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl"></div>
            )}
            <IconComponent className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10 font-medium">{item.label}</span>
            {isActive && (
              <Sparkles className="w-3 h-3 ml-2 relative z-10 animate-pulse" />
            )}
            {!isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
            )}
          </Button>
        );
      })}
    </nav>
  );
};

export default Navigation;
