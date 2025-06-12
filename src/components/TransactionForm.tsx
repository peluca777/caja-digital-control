
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa un monto válido",
        variant: "destructive",
      });
      return;
    }

    if (!concept.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un concepto",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Error",
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
      time: now.toLocaleTimeString('es-AR'),
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
      title: "Transacción registrada",
      description: `${type === 'income' ? 'Ingreso' : 'Egreso'} de ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amountNum)} registrado`,
    });
  };

  return (
    <Card className="animate-slide-up bg-card border-border card-shadow hover:card-shadow-hover transition-all-smooth">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground text-lg font-semibold">Registrar Movimiento</CardTitle>
        <CardDescription className="text-muted-foreground">
          Agrega un nuevo ingreso o egreso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-foreground font-medium">Tipo de Movimiento</Label>
            <Select value={type} onValueChange={(value: 'income' | 'expense') => setType(value)}>
              <SelectTrigger className="bg-card border-border text-foreground focus:border-primary/50 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border card-shadow z-50">
                <SelectItem value="income" className="text-foreground">Ingreso</SelectItem>
                <SelectItem value="expense" className="text-foreground">Egreso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground font-medium">Monto</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-card border-border text-foreground focus:border-primary/50 h-11 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="concept" className="text-foreground font-medium">Concepto</Label>
            <Input
              id="concept"
              placeholder="Descripción del movimiento"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className="bg-card border-border text-foreground focus:border-primary/50 h-11 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-medium">Método de Pago *</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="bg-card border-border text-foreground focus:border-primary/50 h-11 rounded-xl">
                <SelectValue placeholder="Seleccionar método de pago" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border card-shadow z-50">
                <SelectItem value="Efectivo" className="text-foreground">Efectivo</SelectItem>
                <SelectItem value="Transferencia" className="text-foreground">Transferencia</SelectItem>
                <SelectItem value="Tarjeta" className="text-foreground">Tarjeta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations" className="text-foreground font-medium">Observaciones (Opcional)</Label>
            <Textarea
              id="observations"
              placeholder="Detalles adicionales..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="bg-card border-border text-foreground focus:border-primary/50 rounded-xl resize-none"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-xl font-medium transition-all-smooth hover:scale-[1.02] card-shadow hover:card-shadow-hover"
          >
            Registrar {type === 'income' ? 'Ingreso' : 'Egreso'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
