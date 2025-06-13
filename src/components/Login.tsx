
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-blue-200/40 to-indigo-200/40 dark:from-blue-800/20 dark:to-indigo-800/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-emerald-200/30 to-green-200/30 dark:from-emerald-800/15 dark:to-green-800/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-lg glass-effect shadow-soft dark:shadow-soft-dark animate-scale-in border-0 rounded-3xl overflow-hidden">
        <CardHeader className="text-center pb-8 pt-12 px-8">
          <div className="mb-8 animate-bounce-subtle">
            <div className="w-20 h-20 mx-auto gradient-primary rounded-3xl flex items-center justify-center shadow-soft transition-smooth hover-lift group">
              <DollarSign className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
              <Sparkles className="w-4 h-4 text-blue-200 absolute top-2 right-2 animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            Control de Caja
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400 mt-4 text-lg leading-relaxed">
            Sistema inteligente de gestión financiera
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8 pb-12 px-8">
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100 block tracking-wide">
              SELECCIONAR USUARIO
            </label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="h-14 glass-effect border-0 text-slate-900 dark:text-slate-100 rounded-2xl shadow-soft transition-smooth hover:shadow-lg focus:shadow-xl focus:scale-105">
                <SelectValue placeholder="Elige tu perfil de usuario" />
              </SelectTrigger>
              <SelectContent className="glass-effect border-0 shadow-soft dark:shadow-soft-dark rounded-2xl">
                {users.map(user => (
                  <SelectItem 
                    key={user.id} 
                    value={user.id} 
                    className="hover:bg-slate-100/80 dark:hover:bg-slate-700/50 focus:bg-slate-100/80 dark:focus:bg-slate-700/50 cursor-pointer transition-smooth rounded-xl m-2 text-slate-900 dark:text-slate-100 p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-soft">
                        <span className="text-white text-lg font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-base">{user.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{user.role}</div>
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
            className="w-full h-14 gradient-primary disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-700 text-white font-bold rounded-2xl shadow-soft hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-smooth hover-lift disabled:hover:scale-100 animate-fade-in" 
            style={{ animationDelay: '0.5s' }}
          >
            <LogIn className="w-6 h-6 mr-3" />
            Iniciar Sesión Segura
          </Button>
          
          <div className="text-center text-sm text-slate-500 dark:text-slate-400 animate-fade-in font-medium" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>Sistema Empresarial v3.0 • Seguro & Confiable</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
