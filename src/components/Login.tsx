
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, LogIn } from 'lucide-react';
import { getUsers, setCurrentUser } from '@/lib/storage';
import { User } from '@/lib/types';

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card card-shadow animate-slide-up border-border">
        <CardHeader className="text-center pb-6 pt-8">
          <div className="mb-4 animate-fade-in">
            <div className="w-12 h-12 mx-auto bg-primary rounded-xl flex items-center justify-center card-shadow">
              <DollarSign className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-foreground">
            Control de Caja
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Selecciona tu usuario para acceder al sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pb-8">
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <label className="text-sm font-medium text-foreground">Usuario</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="h-11 bg-card border-border hover:border-accent/50 transition-all-smooth text-foreground">
                <SelectValue placeholder="Selecciona un usuario" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border card-shadow z-50">
                {users.map(user => (
                  <SelectItem 
                    key={user.id} 
                    value={user.id}
                    className="hover:bg-secondary focus:bg-secondary cursor-pointer text-foreground"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground text-sm font-medium">
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
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium card-shadow hover:card-shadow-hover transition-all-smooth animate-fade-in disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ animationDelay: '0.2s' }}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Iniciar Sesión
          </Button>
          
          <div className="text-center text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Sistema de gestión empresarial
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
