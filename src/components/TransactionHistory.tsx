
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Download, Search } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { exportToPDF } from '@/lib/exportUtils';
import { exportToExcel } from '@/lib/excelExporter';
import { useToast } from '@/hooks/use-toast';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onExport: (format: 'excel' | 'pdf') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

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

  const handleExportExcel = async () => {
    if (filteredTransactions.length === 0) {
      toast({
        title: "No hay movimientos para exportar",
        description: "No se encontraron movimientos con los filtros aplicados.",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileName = await exportToExcel(filteredTransactions);
      
      toast({
        title: "✅ Los movimientos fueron exportados correctamente",
        description: `Archivo ${fileName} descargado exitosamente.`,
      });

    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      toast({
        title: "❌ Error en la exportación",
        description: "Hubo un problema al generar el archivo Excel. Intentá nuevamente.",
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
    <motion.div 
      className="space-y-4 sm:space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={cardVariants}>
        <Card className="border-border bg-card card-shadow rounded-2xl sm:rounded-3xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-foreground text-lg sm:text-xl font-semibold">Historial de Movimientos</CardTitle>
                <CardDescription className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Todas las transacciones del día actual
                </CardDescription>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleExportExcel}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground card-shadow transition-all-smooth"
                  size="sm"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Exportar a Excel
                </Button>
              </motion.div>
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
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleExportPDF} 
                  variant="outline" 
                  size="sm"
                  className="bg-card border-border text-foreground hover:bg-secondary hover:border-accent/50 transition-all-smooth card-shadow"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
              </motion.div>
            </div>

            <motion.div className="space-y-3" variants={containerVariants}>
              {filteredTransactions.length === 0 ? (
                <motion.div 
                  className="text-center py-8 sm:py-12 text-muted-foreground bg-secondary rounded-xl border-2 border-dashed border-border"
                  variants={cardVariants}
                >
                  <div className="text-base sm:text-lg font-medium mb-2">No hay transacciones</div>
                  <div className="text-xs sm:text-sm">No se encontraron movimientos para mostrar</div>
                </motion.div>
              ) : (
                filteredTransactions.map((transaction, index) => (
                  <motion.div 
                    key={transaction.id} 
                    className="border border-border rounded-xl p-4 sm:p-5 hover:bg-secondary/50 transition-all-smooth card-shadow bg-card"
                    variants={cardVariants}
                    whileHover={{ scale: 1.01, y: -1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <Badge 
                            variant={transaction.type === 'income' ? 'default' : 'destructive'} 
                            className={transaction.type === 'income' ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'}
                          >
                            {transaction.type === 'income' ? 'Ingreso' : 'Egreso'}
                          </Badge>
                          <span className="font-medium text-foreground text-sm sm:text-base">{transaction.concept}</span>
                        </div>
                        {transaction.observations && (
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2 bg-secondary p-2 rounded-lg border border-border">
                            {transaction.observations}
                          </p>
                        )}
                        <div className="text-xs sm:text-sm text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                          <span>{transaction.time}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>{transaction.userName}</span>
                          {transaction.paymentMethod && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span>{transaction.paymentMethod}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <motion.div 
                        className={`text-lg sm:text-xl font-semibold ${
                          transaction.type === 'income' ? 'text-primary' : 'text-destructive'
                        }`}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.02, duration: 0.3 }}
                      >
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </motion.div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default TransactionHistory;
