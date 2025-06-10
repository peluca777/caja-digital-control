
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CashRegister } from '@/lib/types';
import { getCurrentUser } from '@/lib/storage';
import { sendToGoogleSheets } from '@/lib/googleSheets';
import { useToast } from '@/hooks/use-toast';

interface CashRegisterControlProps {
  cashRegister: CashRegister | null;
  onOpen: (openAmount: number) => void;
  onClose: (declaredAmount: number) => void;
}

const CashRegisterControl: React.FC<CashRegisterControlProps> = ({
  cashRegister,
  onOpen,
  onClose
}) => {
  const [openAmount, setOpenAmount] = useState<string>('');
  const [declaredAmount, setDeclaredAmount] = useState<string>('');
  const { toast } = useToast();
  const user = getCurrentUser();

  const handleOpen = async () => {
    const amount = parseFloat(openAmount);
    if (isNaN(amount) || amount < 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa un monto válido",
        variant: "destructive",
      });
      return;
    }

    onOpen(amount);
    
    // Send to Google Sheets
    await sendToGoogleSheets({
      type: 'apertura_caja',
      monto_inicial: amount,
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString('es-AR'),
      usuario: user?.name
    }, 'APERTURA_CAJA');

    setOpenAmount('');
    toast({
      title: "Caja abierta",
      description: "La caja se ha abierto exitosamente",
    });
  };

  const handleClose = async () => {
    if (!cashRegister) return;

    const declared = parseFloat(declaredAmount);
    if (isNaN(declared) || declared < 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa un monto válido",
        variant: "destructive",
      });
      return;
    }

    onClose(declared);
    
    // Send to Google Sheets
    await sendToGoogleSheets({
      type: 'cierre_caja',
      monto_inicial: cashRegister.openAmount,
      monto_final_calculado: cashRegister.closeAmount,
      monto_declarado: declared,
      diferencia: (cashRegister.closeAmount || 0) - declared,
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString('es-AR'),
      usuario: user?.name
    }, 'CIERRE_CAJA');

    setDeclaredAmount('');
    toast({
      title: "Caja cerrada",
      description: "La caja se ha cerrado exitosamente",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  if (!cashRegister) {
    return (
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle>Apertura de Caja</CardTitle>
          <CardDescription>
            Ingresa el monto inicial para comenzar el día
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openAmount">Monto Inicial</Label>
            <Input
              id="openAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={openAmount}
              onChange={(e) => setOpenAmount(e.target.value)}
            />
          </div>
          <Button onClick={handleOpen} disabled={!openAmount} className="w-full">
            Abrir Caja
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (cashRegister.status === 'open') {
    const currentBalance = cashRegister.closeAmount || cashRegister.openAmount;
    
    return (
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle>Cierre de Caja</CardTitle>
          <CardDescription>
            Caja abierta desde las {cashRegister.openTime}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Monto inicial:</span>
              <div className="font-semibold">{formatCurrency(cashRegister.openAmount)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Saldo calculado:</span>
              <div className="font-semibold">{formatCurrency(currentBalance)}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="declaredAmount">Efectivo en Caja (Conteo Manual)</Label>
            <Input
              id="declaredAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={declaredAmount}
              onChange={(e) => setDeclaredAmount(e.target.value)}
            />
          </div>

          {declaredAmount && !isNaN(parseFloat(declaredAmount)) && (
            <Alert>
              <AlertDescription>
                Diferencia: {formatCurrency(currentBalance - parseFloat(declaredAmount))}
                {Math.abs(currentBalance - parseFloat(declaredAmount)) > 0.01 && (
                  <span className="text-warning ml-2">⚠️ Hay diferencia en el conteo</span>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={handleClose} disabled={!declaredAmount} className="w-full">
            Cerrar Caja
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default CashRegisterControl;
