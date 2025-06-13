
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
import { DollarSign, Lock, Unlock, AlertTriangle, CheckCircle } from 'lucide-react';

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
        title: "Error de validación",
        description: "Por favor ingresa un monto inicial válido",
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
      title: "✅ Caja abierta exitosamente",
      description: "El sistema está listo para registrar movimientos",
    });
  };

  const handleClose = async () => {
    if (!cashRegister) return;

    const declared = parseFloat(declaredAmount);
    if (isNaN(declared) || declared < 0) {
      toast({
        title: "Error de validación",
        description: "Por favor ingresa un monto declarado válido",
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
      title: "✅ Caja cerrada exitosamente",
      description: "Resumen del día completado",
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
      <Card className="animate-slide-up glass-effect border-0 shadow-soft dark:shadow-soft-dark rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-green-50/30 dark:from-emerald-900/20 dark:to-green-900/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 gradient-success rounded-2xl flex items-center justify-center shadow-soft">
              <Unlock className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900 dark:text-slate-100 text-xl font-bold">Apertura de Caja</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 font-medium">
                Configura el monto inicial para comenzar las operaciones del día
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <div className="space-y-3">
            <Label htmlFor="openAmount" className="text-slate-900 dark:text-slate-100 font-bold text-sm uppercase tracking-wider">Monto Inicial</Label>
            <Input
              id="openAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={openAmount}
              onChange={(e) => setOpenAmount(e.target.value)}
              className="glass-effect border-0 text-slate-900 dark:text-slate-100 shadow-soft h-14 rounded-2xl transition-smooth hover:shadow-lg focus:shadow-xl text-lg font-semibold"
            />
          </div>
          <Button 
            onClick={handleOpen} 
            disabled={!openAmount} 
            className="w-full h-14 gradient-success text-white font-bold rounded-2xl shadow-soft transition-smooth hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Unlock className="w-6 h-6 mr-3" />
            Abrir Caja Registradora
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (cashRegister.status === 'open') {
    const currentBalance = cashRegister.closeAmount || cashRegister.openAmount;
    const difference = declaredAmount ? currentBalance - parseFloat(declaredAmount) : 0;
    
    return (
      <Card className="animate-slide-up glass-effect border-0 shadow-soft dark:shadow-soft-dark rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-soft">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900 dark:text-slate-100 text-xl font-bold">Cierre de Caja</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 font-medium">
                Caja operativa desde las {cashRegister.openTime}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl glass-effect shadow-soft">
              <span className="text-sm text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">Monto inicial</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(cashRegister.openAmount)}</div>
            </div>
            <div className="p-4 rounded-2xl glass-effect shadow-soft">
              <span className="text-sm text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">Saldo calculado</span>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(currentBalance)}</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="declaredAmount" className="text-slate-900 dark:text-slate-100 font-bold text-sm uppercase tracking-wider">Efectivo en Caja (Conteo Manual)</Label>
            <Input
              id="declaredAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={declaredAmount}
              onChange={(e) => setDeclaredAmount(e.target.value)}
              className="glass-effect border-0 text-slate-900 dark:text-slate-100 shadow-soft h-14 rounded-2xl transition-smooth hover:shadow-lg focus:shadow-xl text-lg font-semibold"
            />
          </div>

          {declaredAmount && !isNaN(parseFloat(declaredAmount)) && (
            <Alert className={`border-0 rounded-2xl shadow-soft ${
              Math.abs(difference) <= 0.01 
                ? 'bg-emerald-50/80 dark:bg-emerald-900/20' 
                : 'bg-amber-50/80 dark:bg-amber-900/20'
            }`}>
              <div className="flex items-center space-x-3">
                {Math.abs(difference) <= 0.01 ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                )}
                <AlertDescription className="font-semibold text-slate-900 dark:text-slate-100">
                  <span className="font-bold">Diferencia: {formatCurrency(Math.abs(difference))}</span>
                  {Math.abs(difference) > 0.01 && (
                    <div className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      ⚠️ Revisar el conteo manual de efectivo
                    </div>
                  )}
                  {Math.abs(difference) <= 0.01 && (
                    <div className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                      ✅ Conteo correcto - Sin diferencias
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <Button 
            onClick={handleClose} 
            disabled={!declaredAmount} 
            className="w-full h-14 gradient-primary text-white font-bold rounded-2xl shadow-soft transition-smooth hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock className="w-6 h-6 mr-3" />
            Cerrar Caja Registradora
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default CashRegisterControl;
