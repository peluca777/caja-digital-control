
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Download, Search } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { exportToPDF } from '@/lib/exportUtils';
import { sendToGoogleSheets } from '@/lib/googleSheets';
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

  const handleExportGoogleSheets = async () => {
    try {
      const datos = filteredTransactions.map(transaction => ({
        fecha: transaction.date,
        monto: transaction.amount,
        concepto: transaction.concept,
        metodo_pago: transaction.paymentMethod || 'Efectivo'
      }));

      await sendToGoogleSheets({ datos }, 'export_transactions');
      
      toast({
        title: "✓ Exportación exitosa",
        description: "¡Datos exportados exitosamente a Google Sheets!",
      });
    } catch (error) {
      toast({
        title: "✗ Error en la exportación",
        description: "Error al exportar los datos, intentá nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = () => {
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
              onClick={handleExportGoogleSheets}
              className="bg-primary hover:bg-primary/90 text-primary-foreground card-shadow hover:card-shadow-hover transition-all-smooth hover-lift"
              size="sm"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Exportar a Google Sheets
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
