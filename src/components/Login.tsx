
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Control de Caja</CardTitle>
          <CardDescription>
            Selecciona tu usuario para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Usuario</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un usuario" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} - {user.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleLogin} 
            disabled={!selectedUserId}
            className="w-full"
          >
            Iniciar Sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
