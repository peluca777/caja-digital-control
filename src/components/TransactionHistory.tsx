
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/lib/types';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onExport: (format: 'excel' | 'pdf') => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, onExport }) => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [search, setSearch] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = transaction.concept.toLowerCase().includes(search.toLowerCase()) ||
                         transaction.observations?.toLowerCase().includes(search.toLowerCase()) ||
                         transaction.userName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4 animate-slide-up">
      <Card>
        <CardHeader>
          <CardTitle>Historial de Movimientos</CardTitle>
          <CardDescription>
            Todas las transacciones del día actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Buscar por concepto, observaciones o usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <Select value={filter} onValueChange={(value: 'all' | 'income' | 'expense') => setFilter(value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="income">Ingresos</SelectItem>
                <SelectItem value="expense">Egresos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 mb-4">
            <Button onClick={() => onExport('excel')} variant="outline" size="sm">
              Exportar Excel
            </Button>
            <Button onClick={() => onExport('pdf')} variant="outline" size="sm">
              Exportar PDF
            </Button>
          </div>

          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay transacciones para mostrar
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'}>
                          {transaction.type === 'income' ? 'Ingreso' : 'Egreso'}
                        </Badge>
                        <span className="font-medium">{transaction.concept}</span>
                      </div>
                      {transaction.observations && (
                        <p className="text-sm text-muted-foreground mb-1">
                          {transaction.observations}
                        </p>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {transaction.time} - {transaction.userName}
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${
                      transaction.type === 'income' ? 'text-success' : 'text-destructive'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;
