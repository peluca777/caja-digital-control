
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

    const now = new Date();
    const transaction: Omit<Transaction, 'id'> = {
      cashRegisterId,
      type,
      amount: amountNum,
      concept: concept.trim(),
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
      observaciones: observations,
      fecha: transaction.date,
      hora: transaction.time,
      usuario: user.name
    }, type === 'income' ? 'INGRESO' : 'EGRESO');

    // Reset form
    setAmount('');
    setConcept('');
    setObservations('');
    
    toast({
      title: "Transacción registrada",
      description: `${type === 'income' ? 'Ingreso' : 'Egreso'} de ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amountNum)} registrado`,
    });
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle>Registrar Movimiento</CardTitle>
        <CardDescription>
          Agrega un nuevo ingreso o egreso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Movimiento</Label>
            <Select value={type} onValueChange={(value: 'income' | 'expense') => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Ingreso</SelectItem>
                <SelectItem value="expense">Egreso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="concept">Concepto</Label>
            <Input
              id="concept"
              placeholder="Descripción del movimiento"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observaciones (Opcional)</Label>
            <Textarea
              id="observations"
              placeholder="Detalles adicionales..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Registrar {type === 'income' ? 'Ingreso' : 'Egreso'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
