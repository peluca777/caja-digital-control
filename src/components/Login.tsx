
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/lib/types';
import { getUsers, setCurrentUser } from '@/lib/storage';
import { LogIn, User as UserIcon, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const { toast } = useToast();

  const handleLogin = () => {
    const finalName = customName.trim() || 'Administrador';
    
    const adminUser: User = {
      id: 'admin',
      name: finalName,
      role: 'Supervisor'
    };

    // Guardar el nombre personalizado en localStorage
    localStorage.setItem('adminName', finalName);
    
    setCurrentUser(adminUser);
    onLogin(adminUser);
    
    toast({
      title: "✅ Sesión iniciada",
      description: `Bienvenido/a, ${finalName}`,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4, 
        ease: [0.4, 0.0, 0.2, 1], 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3, 
        ease: [0.4, 0.0, 0.2, 1] 
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
            className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <span className="text-3xl">💰</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Caja Digital Control</h1>
          <p className="text-gray-600">Sistema de gestión de caja profesional</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 pb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 text-xl font-bold">Acceso al Sistema</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">
                    Ingresa como administrador
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <motion.div variants={itemVariants} className="space-y-3">
                <Label htmlFor="customName" className="text-gray-900 font-bold text-sm uppercase tracking-wider">
                  Nombre del Administrador
                </Label>
                <Input
                  id="customName"
                  type="text"
                  placeholder="Ingresa tu nombre (opcional)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="bg-gray-50 border-0 text-gray-900 shadow-md h-14 rounded-2xl transition-all hover:shadow-lg focus:shadow-xl text-lg"
                />
                <p className="text-xs text-gray-500">
                  Si no ingresas un nombre, se usará "Administrador" por defecto
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button 
                  onClick={handleLogin}
                  className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg transition-all hover:shadow-xl text-lg"
                >
                  <LogIn className="w-6 h-6 mr-3" />
                  Iniciar Sesión
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="text-center mt-6 text-gray-500 text-sm"
        >
          © 2024 Caja Digital Control - Sistema profesional de gestión
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
