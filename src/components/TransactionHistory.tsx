
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Download, Search } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { exportToPDF } from '@/lib/exportUtils';
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

  const exportToGoogleSheets = () => {
    // Verificar si hay datos para exportar
    if (filteredTransactions.length === 0) {
      toast({
        title: "No hay movimientos para exportar",
        description: "No se encontraron movimientos con los filtros aplicados.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Preparar los datos para exportación
      const exportData = filteredTransactions.map(transaction => ({
        Fecha: `${transaction.date} ${transaction.time}`,
        Concepto: transaction.concept,
        Monto: formatCurrency(transaction.amount),
        'Método de Pago': transaction.paymentMethod || 'Efectivo'
      }));

      // Crear encabezados CSV
      const headers = ['Fecha', 'Concepto', 'Monto', 'Método de Pago'];
      
      // Convertir a formato CSV
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escapar comillas y envolver en comillas si contiene comas
            return typeof value === 'string' && value.includes(',') 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      // Crear y descargar archivo CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const today = new Date().toLocaleDateString('es-AR').replace(/\//g, '-');
      link.setAttribute('href', url);
      link.setAttribute('download', `Movimientos_Caja_${today}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Abrir Google Sheets en nueva pestaña para importar el archivo
      const googleSheetsUrl = 'https://sheets.google.com/';
      window.open(googleSheetsUrl, '_blank');

      // Mostrar mensaje de éxito
      toast({
        title: "✓ Exportación exitosa",
        description: "Los movimientos fueron exportados correctamente.",
      });

    } catch (error) {
      console.error('Error al exportar:', error);
      toast({
        title: "✗ Error en la exportación",
        description: "Hubo un problema al exportar los datos. Intentá nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = () => {
    if (filteredTransactions.length === 0) {
      toast({
        title: "No hay movimientos para exportar",
        description: "No se encontraron movimientos con los filtros aplicados.",
        variant: "destructive",
      });
      return;
    }

    exportToPDF(filteredTransactions);
    toast({
      title: "✓ Exportación exitosa", 
      description: "Archivo HTML generado (imprimible como PDF)",
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <Card className="border-border bg-card card-shadow">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-foreground text-xl font-semibold">Historial de Movimientos</CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Todas las transacciones del día actual
              </CardDescription>
            </div>
            <Button 
              onClick={exportToGoogleSheets}
              className="bg-primary hover:bg-primary/90 text-primary-foreground card-shadow hover:card-shadow-hover transition-all-smooth hover-lift"
              size="sm"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Exportar a Sheets
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por concepto, observaciones o usuario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-border text-foreground bg-card focus:border-accent/50 h-10"
              />
            </div>
            <Select value={filter} onValueChange={(value: 'all' | 'income' | 'expense') => setFilter(value)}>
              <SelectTrigger className="w-full sm:w-40 border-border text-foreground bg-card h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border card-shadow z-50">
                <SelectItem value="all" className="text-foreground">Todos</SelectItem>
                <SelectItem value="income" className="text-foreground">Ingresos</SelectItem>
                <SelectItem value="expense" className="text-foreground">Egresos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleExportPDF} 
              variant="outline" 
              size="sm"
              className="bg-card border-border text-foreground hover:bg-secondary hover:border-accent/50 transition-all-smooth card-shadow hover:card-shadow-hover"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>

          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-secondary rounded-xl border-2 border-dashed border-border">
                <div className="text-lg font-medium mb-2">No hay transacciones</div>
                <div className="text-sm">No se encontraron movimientos para mostrar</div>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="border border-border rounded-xl p-5 hover:bg-secondary/50 transition-all-smooth card-shadow hover:card-shadow-hover bg-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge 
                          variant={transaction.type === 'income' ? 'default' : 'destructive'} 
                          className={transaction.type === 'income' ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'}
                        >
                          {transaction.type === 'income' ? 'Ingreso' : 'Egreso'}
                        </Badge>
                        <span className="font-medium text-foreground text-base">{transaction.concept}</span>
                      </div>
                      {transaction.observations && (
                        <p className="text-sm text-muted-foreground mb-2 bg-secondary p-2 rounded-lg border border-border">
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
                    <div className={`text-xl font-semibold ${
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
