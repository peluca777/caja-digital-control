
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, LogIn, Sparkles } from 'lucide-react';
import { getUsers, setCurrentUser } from '@/lib/storage';
import { User } from '@/lib/types';
import { ThemeToggle } from './ThemeToggle';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const users = getUsers();

  const handleLogin = () => {
    const user = users.find(u => u.id === selectedUserId);
    if (user) {
      setCurrentUser(user);
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md glass shadow-floating border-border/50 animate-scale-in">
        <CardHeader className="text-center pb-8 pt-10">
          <div className="mb-6 animate-fade-in">
            <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-elevated hover-glow transition-smooth">
              <DollarSign className="w-8 h-8 text-primary-foreground" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-5 h-5 text-warning animate-pulse" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Control de Caja
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-3 text-base">
            Selecciona tu usuario para acceder al sistema de gestión
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8 pb-10">
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <label className="text-sm font-medium text-foreground/90 block">Usuario</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="h-12 bg-card/50 border-border/50 hover:border-primary/30 transition-fast rounded-xl focus-ring">
                <SelectValue placeholder="Selecciona un usuario" />
              </SelectTrigger>
              <SelectContent className="bg-card/90 backdrop-blur-xl border-border/50 shadow-elevated rounded-xl">
                {users.map(user => (
                  <SelectItem 
                    key={user.id} 
                    value={user.id} 
                    className="hover:bg-accent/30 focus:bg-accent/30 cursor-pointer transition-fast rounded-lg m-1"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-soft">
                        <span className="text-primary-foreground text-sm font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.role}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleLogin} 
            disabled={!selectedUserId} 
            className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold rounded-xl shadow-elevated hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition-smooth animate-fade-in" 
            style={{ animationDelay: '0.4s' }}
          >
            <LogIn className="w-5 h-5 mr-2" />
            Iniciar Sesión
          </Button>
          
          <div className="text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Sistema de gestión empresarial v2.0
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
