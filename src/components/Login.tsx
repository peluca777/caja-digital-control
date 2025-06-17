
import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-10 sm:top-20 left-10 sm:left-20 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-r from-blue-200/40 to-indigo-200/40 dark:from-blue-800/20 dark:to-indigo-800/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-r from-emerald-200/30 to-green-200/30 dark:from-emerald-800/15 dark:to-green-800/15 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.4, 0.3]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      {/* Theme Toggle */}
      <motion.div 
        className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        <ThemeToggle />
      </motion.div>

      {/* Login Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="w-full max-w-sm sm:max-w-lg glass-effect card-shadow dark:card-shadow border-0 rounded-2xl sm:rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-6 sm:pb-8 pt-8 sm:pt-12 px-6 sm:px-8">
            <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
              <motion.div 
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto gradient-primary rounded-2xl sm:rounded-3xl flex items-center justify-center card-shadow transition-all-smooth group relative"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-200 absolute top-1 sm:top-2 right-1 sm:right-2" />
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Control de Caja
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-3 sm:mt-4 text-sm sm:text-lg leading-relaxed">
                Sistema inteligente de gestión financiera
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-6 sm:space-y-8 pb-8 sm:pb-12 px-6 sm:px-8">
            <motion.div className="space-y-3 sm:space-y-4" variants={itemVariants}>
              <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 block tracking-wide">
                SELECCIONAR USUARIO
              </label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="h-12 sm:h-14 glass-effect border-0 text-slate-900 dark:text-slate-100 rounded-xl sm:rounded-2xl card-shadow transition-all-smooth focus:card-shadow-hover">
                  <SelectValue placeholder="Elige tu perfil de usuario" />
                </SelectTrigger>
                <SelectContent className="glass-effect border-0 card-shadow dark:card-shadow rounded-xl sm:rounded-2xl">
                  {users.map(user => (
                    <SelectItem 
                      key={user.id} 
                      value={user.id} 
                      className="hover:bg-slate-100/80 dark:hover:bg-slate-700/50 focus:bg-slate-100/80 dark:focus:bg-slate-700/50 cursor-pointer transition-all-smooth rounded-lg m-2 text-slate-900 dark:text-slate-100 p-3 sm:p-4"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center card-shadow">
                          <span className="text-white text-sm sm:text-lg font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base">{user.name}</div>
                          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{user.role}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={selectedUserId ? { scale: 1.02, y: -1 } : {}}
                whileTap={selectedUserId ? { scale: 0.98 } : {}}
              >
                <Button 
                  onClick={handleLogin} 
                  disabled={!selectedUserId} 
                  className="w-full h-12 sm:h-14 gradient-primary disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-600 dark:disabled:to-slate-700 text-white font-bold rounded-xl sm:rounded-2xl card-shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all-smooth"
                >
                  <LogIn className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Iniciar Sesión Segura
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium" 
              variants={itemVariants}
            >
              <div className="flex items-center justify-center space-x-2">
                <motion.div 
                  className="w-2 h-2 bg-emerald-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>Sistema Empresarial v3.0 • Seguro & Confiable</span>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
