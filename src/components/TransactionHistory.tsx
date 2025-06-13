
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Download, Search, TrendingUp, TrendingDown, Clock, User } from 'lucide-react';
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
        description: "Datos exportados y Google Sheets abierto en nueva pestaña",
        className: "bg-emerald-50 border-emerald-200 text-emerald-800",
      });
    } catch (error) {
      toast({
        title: "✗ Error en la exportación",
        description: "Error al exportar los datos, intentá nuevamente.",
        variant: "destructive",
        className: "bg-red-50 border-red-200 text-red-800",
      });
    }
  };

  const handleExportPDF = () => {
    exportToPDF(filteredTransactions);
    toast({
      title: "✓ Exportación exitosa", 
      description: "Archivo HTML generado (imprimible como PDF)",
      className: "bg-blue-50 border-blue-200 text-blue-800",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Historial de Movimientos
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Gestiona y exporta todas las transacciones del día actual
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white shadow-2xl border-0 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">Control de Transacciones</CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  {filteredTransactions.length} movimientos encontrados
                </CardDescription>
              </div>
              <Button 
                onClick={handleExportGoogleSheets}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                size="lg"
              >
                <FileSpreadsheet className="w-5 h-5 mr-3" />
                Exportar a Google Sheets
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Filters */}
            <div className="bg-slate-50 rounded-2xl p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Filtros y Búsqueda
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar por concepto, observaciones o usuario..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 h-14 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  />
                </div>
                
                <Select value={filter} onValueChange={(value: 'all' | 'income' | 'expense') => setFilter(value)}>
                  <SelectTrigger className="h-14 bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-slate-200 rounded-xl shadow-2xl">
                    <SelectItem value="all" className="text-slate-900 hover:bg-slate-50 rounded-lg">Todos los movimientos</SelectItem>
                    <SelectItem value="income" className="text-slate-900 hover:bg-emerald-50 rounded-lg">Solo Ingresos</SelectItem>
                    <SelectItem value="expense" className="text-slate-900 hover:bg-red-50 rounded-lg">Solo Egresos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Export Options */}
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleExportPDF} 
                variant="outline" 
                className="bg-slate-100 border-2 border-slate-300 text-slate-900 hover:bg-slate-200 hover:border-slate-400 font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            </div>

            {/* Transactions List */}
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-20 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border-2 border-dashed border-slate-300">
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-10 h-10 text-slate-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-slate-900">No hay transacciones</h3>
                      <p className="text-slate-600">No se encontraron movimientos que coincidan con los filtros aplicados</p>
                    </div>
                  </div>
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <Badge 
                            className={`px-4 py-2 rounded-xl font-bold text-sm ${
                              transaction.type === 'income' 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                : 'bg-red-100 text-red-800 border-red-200'
                            }`}
                          >
                            {transaction.type === 'income' ? (
                              <TrendingUp className="w-4 h-4 mr-1" />
                            ) : (
                              <TrendingDown className="w-4 h-4 mr-1" />
                            )}
                            {transaction.type === 'income' ? 'Ingreso' : 'Egreso'}
                          </Badge>
                          <h4 className="font-bold text-xl text-slate-900">{transaction.concept}</h4>
                        </div>
                        
                        {transaction.observations && (
                          <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-4">
                            <p className="text-slate-700 font-medium">{transaction.observations}</p>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-6 text-slate-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{transaction.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{transaction.userName}</span>
                          </div>
                          {transaction.paymentMethod && (
                            <div className="bg-slate-100 px-3 py-1 rounded-lg">
                              <span className="font-medium text-slate-700">{transaction.paymentMethod}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${
                          transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionHistory;
