
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200 animate-slide-up">
        <CardHeader className="text-center pb-8 pt-12">
          <div className="mb-6 animate-fade-in">
            <div className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center shadow-md">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Control de Caja
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-3 text-base">
            Selecciona tu usuario para acceder al sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8 pb-12">
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <label className="text-sm font-medium text-foreground">Usuario</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="h-12 bg-white border-border hover:border-primary/50 transition-all-smooth text-foreground">
                <SelectValue placeholder="Selecciona un usuario" />
              </SelectTrigger>
              <SelectContent className="bg-white border-border shadow-xl">
                {users.map(user => (
                  <SelectItem 
                    key={user.id} 
                    value={user.id}
                    className="hover:bg-secondary focus:bg-secondary cursor-pointer text-foreground"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
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
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium shadow-sm hover:shadow-md transition-all-smooth animate-fade-in disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ animationDelay: '0.4s' }}
          >
            <LogIn className="w-5 h-5 mr-2" />
            Iniciar Sesión
          </Button>
          
          <div className="text-center text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Sistema de gestión empresarial
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
