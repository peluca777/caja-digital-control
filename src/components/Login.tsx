
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 animate-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/80 to-blue-700/80"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse-subtle"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
      
      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-sm border-blue-200 shadow-2xl animate-slide-up hover-glow">
        <CardHeader className="text-center pb-8">
          <div className="mb-4 animate-bounce-gentle">
            <div className="w-16 h-16 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-black">
            Control de Caja
          </CardTitle>
          <CardDescription className="text-gray-700 mt-2 text-base">
            Selecciona tu usuario para acceder al sistema
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <label className="text-sm font-medium text-black">Usuario</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="h-12 bg-blue-50 border-blue-300 hover:border-blue-400 transition-all-smooth hover:bg-blue-100 text-black">
                <SelectValue placeholder="Selecciona un usuario" />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-200 shadow-xl">
                {users.map(user => (
                  <SelectItem 
                    key={user.id} 
                    value={user.id}
                    className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer text-black"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-black">{user.name}</div>
                        <div className="text-xs text-gray-600">{user.role}</div>
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
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover-lift animate-fade-in disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ animationDelay: '0.4s' }}
          >
            <LogIn className="w-5 h-5 mr-2" />
            Iniciar Sesión
          </Button>
          
          <div className="text-center text-xs text-gray-600 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Sistema de gestión empresarial
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
