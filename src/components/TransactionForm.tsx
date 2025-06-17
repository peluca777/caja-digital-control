
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transaction } from '@/lib/types';
import { getCurrentUser } from '@/lib/storage';
import { sendToGoogleSheets } from '@/lib/googleSheets';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, MinusCircle, Sparkles } from 'lucide-react';

interface TransactionFormProps {
  cashRegisterId: string;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ cashRegisterId, onAddTransaction }) => {
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState<string>('');
  const [concept, setConcept] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [observations, setObservations] = useState<string>('');
  const { toast } = useToast();
  const user = getCurrentUser();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir solo números y punto decimal, sin ceros iniciales innecesarios
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Error de validación",
        description: "Por favor ingresa un monto válido mayor a cero",
        variant: "destructive",
      });
      return;
    }

    if (!concept.trim()) {
      toast({
        title: "Error de validación",
        description: "Por favor ingresa un concepto descriptivo",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Error de validación",
        description: "Por favor selecciona un método de pago",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const transaction: Omit<Transaction, 'id'> = {
      cashRegisterId,
      type,
      amount: amountNum,
      concept: concept.trim(),
      paymentMethod,
      observations: observations.trim(),
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('es-AR', { hour12: false }),
      userId: user.id,
      userName: user.name
    };

    onAddTransaction(transaction);

    // Send to Google Sheets
    await sendToGoogleSheets({
      tipo: type === 'income' ? 'INGRESO' : 'EGRESO',
      monto: amountNum,
      concepto: concept,
      metodo_pago: paymentMethod,
      observaciones: observations,
      fecha: transaction.date,
      hora: transaction.time,
      usuario: user.name
    }, type === 'income' ? 'INGRESO' : 'EGRESO');

    // Reset form
    setAmount('');
    setConcept('');
    setPaymentMethod('');
    setObservations('');
    
    toast({
      title: "✅ Transacción registrada",
      description: `${type === 'income' ? 'Ingreso' : 'Egreso'} de ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amountNum)} procesado exitosamente`,
    });
  };

  return (
    <Card className="animate-slide-up glass-effect border-0 shadow-soft dark:shadow-soft-dark transition-smooth hover:shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-slate-50/50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center shadow-soft">
            {type === 'income' ? 
              <PlusCircle className="w-6 h-6 text-white" /> : 
              <MinusCircle className="w-6 h-6 text-white" />
            }
          </div>
          <div>
            <CardTitle className="text-slate-900 dark:text-slate-100 text-xl font-bold">Registrar Movimiento</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 font-medium">
              Agrega un nuevo {type === 'income' ? 'ingreso' : 'egreso'} al sistema
            </CardDescription>
          </div>
          <Sparkles className="w-5 h-5 text-blue-500 ml-auto animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label className="text-slate-900 dark:text-slate-100 font-bold text-sm uppercase tracking-wider">Tipo de Movimiento</Label>
            <Select value={type} onValueChange={(value: 'income' | 'expense') => setType(value)}>
              <SelectTrigger className="glass-effect border-0 text-slate-900 dark:text-slate-100 shadow-soft h-14 rounded-2xl transition-smooth hover:shadow-lg focus:shadow-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-effect border-0 shadow-soft dark:shadow-soft-dark rounded-2xl">
                <SelectItem value="income" className="text-slate-900 dark:text-slate-100 rounded-xl p-3 font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                  <div className="flex items-center space-x-3">
                    <PlusCircle className="w-4 h-4 text-emerald-600" />
                    <span>Ingreso</span>
                  </div>
                </SelectItem>
                <SelectItem value="expense" className="text-slate-900 dark:text-slate-100 rounded-xl p-3 font-medium hover:bg-red-50 dark:hover:bg-red-900/20">
                  <div className="flex items-center space-x-3">
                    <MinusCircle className="w-4 h-4 text-red-600" />
                    <span>Egreso</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="amount" className="text-slate-900 dark:text-slate-100 font-bold text-sm uppercase tracking-wider">Monto</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              className="glass-effect border-0 text-slate-900 dark:text-slate-100 shadow-soft h-14 rounded-2xl transition-smooth hover:shadow-lg focus:shadow-xl text-lg font-semibold"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="concept" className="text-slate-900 dark:text-slate-100 font-bold text-sm uppercase tracking-wider">Concepto</Label>
            <Input
              id="concept"
              placeholder="Descripción detallada del movimiento"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className="glass-effect border-0 text-slate-900 dark:text-slate-100 shadow-soft h-14 rounded-2xl transition-smooth hover:shadow-lg focus:shadow-xl"
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="text-slate-900 dark:text-slate-100 font-bold text-sm uppercase tracking-wider">Método de Pago</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="glass-effect border-0 text-slate-900 dark:text-slate-100 shadow-soft h-14 rounded-2xl transition-smooth hover:shadow-lg focus:shadow-xl">
                <SelectValue placeholder="Seleccionar método de pago" />
              </SelectTrigger>
              <SelectContent className="glass-effect border-0 shadow-soft dark:shadow-soft-dark rounded-2xl">
                <SelectItem value="Efectivo" className="text-slate-900 dark:text-slate-100 rounded-xl p-3 font-medium">Efectivo</SelectItem>
                <SelectItem value="Transferencia" className="text-slate-900 dark:text-slate-100 rounded-xl p-3 font-medium">Transferencia</SelectItem>
                <SelectItem value="Tarjeta" className="text-slate-900 dark:text-slate-100 rounded-xl p-3 font-medium">Tarjeta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="observations" className="text-slate-900 dark:text-slate-100 font-bold text-sm uppercase tracking-wider">Observaciones (Opcional)</Label>
            <Textarea
              id="observations"
              placeholder="Detalles adicionales o comentarios..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="glass-effect border-0 text-slate-900 dark:text-slate-100 shadow-soft rounded-2xl resize-none transition-smooth hover:shadow-lg focus:shadow-xl"
              rows={4}
            />
          </div>

          <Button 
            type="submit" 
            className={`w-full h-16 text-white font-bold rounded-2xl shadow-soft transition-smooth hover-lift text-lg ${
              type === 'income' ? 'gradient-success' : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
            }`}
          >
            {type === 'income' ? <PlusCircle className="w-6 h-6 mr-3" /> : <MinusCircle className="w-6 h-6 mr-3" />}
            Registrar {type === 'income' ? 'Ingreso' : 'Egreso'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
