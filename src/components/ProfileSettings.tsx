
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfileSettings: React.FC = () => {
  const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || 'Administrador');
  const { toast } = useToast();

  const handleSave = () => {
    const finalName = adminName.trim() || 'Administrador';
    localStorage.setItem('adminName', finalName);
    
    toast({
      title: "✅ Perfil actualizado",
      description: "Los cambios se guardaron correctamente",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Configuración de Perfil</h2>
      
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Datos del Administrador
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Configura la información del perfil administrativo
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="adminName" className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Nombre del Administrador
            </Label>
            <Input
              id="adminName"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl"
              placeholder="Ingresa el nombre del administrador"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Este nombre aparecerá en la interfaz y en los reportes del sistema.
            </p>
          </div>
          
          <Button 
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Información del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Tipo de usuario:</span>
            <span className="font-medium">Administrador</span>
          </div>
          <div className="flex justify-between">
            <span>Permisos:</span>
            <span className="font-medium">Acceso completo</span>
          </div>
          <div className="flex justify-between">
            <span>Versión del sistema:</span>
            <span className="font-medium">1.0.0</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
