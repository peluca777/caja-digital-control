
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Download, Search } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';
import { useToast } from '@/hooks/use-toast';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onExport: (format: 'excel' | 'pdf') => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [search, setSearch] = useState('');
  const { toast } = useToast();

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

  const handleExportExcel = () => {
    exportToExcel(filteredTransactions);
    toast({
      title: "Exportación exitosa",
      description: `Archivo Excel descargado: Caja_Diaria_${new Date().toLocaleDateString('es-AR').replace(/\//g, '-')}.xlsx`,
    });
  };

  const handleExportPDF = () => {
    exportToPDF(filteredTransactions);
    toast({
      title: "Exportación exitosa", 
      description: "Archivo HTML generado (imprimible como PDF)",
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Card className="border-border bg-white shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-foreground text-xl">Historial de Movimientos</CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Todas las transacciones del día actual
              </CardDescription>
            </div>
            <Button 
              onClick={handleExportExcel}
              className="bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md transition-all-smooth hover:scale-105"
              size="sm"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por concepto, observaciones o usuario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-border text-foreground bg-white focus:border-primary/50"
              />
            </div>
            <Select value={filter} onValueChange={(value: 'all' | 'income' | 'expense') => setFilter(value)}>
              <SelectTrigger className="w-full sm:w-48 border-border text-foreground bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-border">
                <SelectItem value="all" className="text-foreground">Todos</SelectItem>
                <SelectItem value="income" className="text-foreground">Ingresos</SelectItem>
                <SelectItem value="expense" className="text-foreground">Egresos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleExportPDF} 
              variant="outline" 
              size="sm"
              className="bg-white border-border text-foreground hover:bg-secondary hover:border-primary/50 transition-all-smooth hover:shadow-md"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>

          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-lg border-2 border-dashed border-border">
                <div className="text-lg font-medium mb-2">No hay transacciones</div>
                <div className="text-sm">No se encontraron movimientos para mostrar</div>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="border border-border rounded-xl p-6 hover:bg-gray-50 transition-all-smooth hover:shadow-md bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge 
                          variant={transaction.type === 'income' ? 'default' : 'destructive'} 
                          className={transaction.type === 'income' ? 'bg-primary text-white' : 'bg-destructive text-white'}
                        >
                          {transaction.type === 'income' ? 'Ingreso' : 'Egreso'}
                        </Badge>
                        <span className="font-semibold text-foreground text-lg">{transaction.concept}</span>
                      </div>
                      {transaction.observations && (
                        <p className="text-sm text-muted-foreground mb-2 bg-gray-50 p-2 rounded-md">
                          {transaction.observations}
                        </p>
                      )}
                      <div className="text-sm text-muted-foreground flex items-center gap-4">
                        <span>{transaction.time}</span>
                        <span>•</span>
                        <span>{transaction.userName}</span>
                        {transaction.paymentMethod && (
                          <>
                            <span>•</span>
                            <span>{transaction.paymentMethod}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${
                      transaction.type === 'income' ? 'text-primary' : 'text-destructive'
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
