
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Download } from 'lucide-react';
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
      description: "Archivo Excel descargado correctamente",
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
    <div className="space-y-4 animate-slide-up">
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-black">Historial de Movimientos</CardTitle>
          <CardDescription className="text-gray-700">
            Todas las transacciones del día actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Buscar por concepto, observaciones o usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-blue-300 text-black"
            />
            <Select value={filter} onValueChange={(value: 'all' | 'income' | 'expense') => setFilter(value)}>
              <SelectTrigger className="w-full sm:w-48 border-blue-300 text-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-200">
                <SelectItem value="all" className="text-black">Todos</SelectItem>
                <SelectItem value="income" className="text-black">Ingresos</SelectItem>
                <SelectItem value="expense" className="text-black">Egresos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 mb-4">
            <Button 
              onClick={handleExportExcel} 
              variant="outline" 
              size="sm"
              className="bg-blue-50 border-blue-300 text-black hover:bg-blue-100 hover:border-blue-400 transition-all-smooth hover-lift"
            >
              <FileText className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
            <Button 
              onClick={handleExportPDF} 
              variant="outline" 
              size="sm"
              className="bg-blue-50 border-blue-300 text-black hover:bg-blue-100 hover:border-blue-400 transition-all-smooth hover-lift"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>

          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                No hay transacciones para mostrar
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="border border-blue-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'} className="bg-blue-600 text-white">
                          {transaction.type === 'income' ? 'Ingreso' : 'Egreso'}
                        </Badge>
                        <span className="font-medium text-black">{transaction.concept}</span>
                      </div>
                      {transaction.observations && (
                        <p className="text-sm text-gray-600 mb-1">
                          {transaction.observations}
                        </p>
                      )}
                      <div className="text-xs text-gray-600">
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
