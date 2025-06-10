
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getGoogleSheetsConfig, saveGoogleSheetsConfig } from '@/lib/googleSheets';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState(getGoogleSheetsConfig()?.webhookUrl || '');
  const { toast } = useToast();

  const handleSave = () => {
    if (webhookUrl.trim()) {
      saveGoogleSheetsConfig({ webhookUrl: webhookUrl.trim() });
      toast({
        title: "Configuración guardada",
        description: "La integración con Google Sheets ha sido configurada",
      });
    } else {
      localStorage.removeItem('googleSheetsConfig');
      toast({
        title: "Configuración eliminada",
        description: "La integración con Google Sheets ha sido desactivada",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold">Configuración</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Integración con Google Sheets</CardTitle>
          <CardDescription>
            Configura la URL del webhook para sincronizar automáticamente los datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">URL del Webhook de Google Sheets</Label>
            <Input
              id="webhookUrl"
              placeholder="https://script.google.com/macros/s/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Para obtener esta URL, crea un Google Apps Script con un webhook que reciba los datos del sistema.
            </p>
          </div>
          <Button onClick={handleSave}>
            Guardar Configuración
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instrucciones de Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="font-medium mb-2">Para configurar Google Sheets:</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Crea una nueva hoja de cálculo en Google Sheets</li>
              <li>Ve a Extensiones → Apps Script</li>
              <li>Crea un nuevo script que reciba los datos mediante webhook</li>
              <li>Despliega el script como aplicación web</li>
              <li>Copia la URL del webhook y pégala arriba</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
