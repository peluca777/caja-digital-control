
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, LogIn } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-70"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-100 dark:bg-green-900/20 rounded-full blur-3xl opacity-50"></div>
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 animate-scale-in">
        <CardHeader className="text-center pb-8 pt-10">
          <div className="mb-6 animate-fade-in">
            <div className="w-16 h-16 mx-auto bg-blue-600 hover:bg-blue-700 rounded-2xl flex items-center justify-center shadow-lg transition-smooth hover-lift">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Control de Caja
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400 mt-3 text-base">
            Selecciona tu usuario para acceder al sistema de gestión
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8 pb-10">
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100 block">Usuario</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-smooth rounded-xl text-gray-900 dark:text-gray-100">
                <SelectValue placeholder="Selecciona un usuario" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl rounded-xl">
                {users.map(user => (
                  <SelectItem 
                    key={user.id} 
                    value={user.id} 
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 cursor-pointer transition-smooth rounded-lg m-1 text-gray-900 dark:text-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-white text-sm font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.role}</div>
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
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold rounded-xl shadow-lg hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition-smooth animate-fade-in" 
            style={{ animationDelay: '0.4s' }}
          >
            <LogIn className="w-5 h-5 mr-2" />
            Iniciar Sesión
          </Button>
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Sistema de gestión empresarial v2.0
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
