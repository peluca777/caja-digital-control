
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Download, Search, Edit } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { exportToPDF } from '@/lib/exportUtils';
import { exportToExcel } from '@/lib/excelExporter';
import { useToast } from '@/hooks/use-toast';
import EditTransactionModal from './EditTransactionModal';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onExport: (format: 'excel' | 'pdf') => void;
  onUpdateTransaction?: (transaction: Transaction) => void;
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

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  transactions, 
  onUpdateTransaction 
}) => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [search, setSearch] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleSaveTransaction = (updatedTransaction: Transaction) => {
    if (onUpdateTransaction) {
      onUpdateTransaction(updatedTransaction);
    }
  };

  return (
    <>
      <motion.div 
        className="space-y-4 sm:space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={cardVariants}>
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg rounded-2xl sm:rounded-3xl">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-gray-900 dark:text-gray-100 text-lg sm:text-xl font-semibold">
                    Historial de Movimientos
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                    Todas las transacciones del día actual
                  </CardDescription>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={handleExportExcel}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all rounded-xl"
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por concepto, observaciones o usuario..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 h-10 rounded-xl"
                  />
                </div>
                <Select value={filter} onValueChange={(value: 'all' | 'income' | 'expense') => setFilter(value)}>
                  <SelectTrigger className="w-full sm:w-40 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg z-50 rounded-xl">
                    <SelectItem value="all" className="text-gray-900 dark:text-gray-100">Todos</SelectItem>
                    <SelectItem value="income" className="text-gray-900 dark:text-gray-100">Ingresos</SelectItem>
                    <SelectItem value="expense" className="text-gray-900 dark:text-gray-100">Egresos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={handleExportPDF} 
                    variant="outline" 
                    size="sm"
                    className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all shadow-md rounded-xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar PDF
                  </Button>
                </motion.div>
              </div>

              <motion.div className="space-y-3" variants={containerVariants}>
                {filteredTransactions.length === 0 ? (
                  <motion.div 
                    className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600"
                    variants={cardVariants}
                  >
                    <div className="text-base sm:text-lg font-medium mb-2">No hay transacciones</div>
                    <div className="text-xs sm:text-sm">No se encontraron movimientos para mostrar</div>
                  </motion.div>
                ) : (
                  filteredTransactions.map((transaction, index) => (
                    <motion.div 
                      key={transaction.id} 
                      className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md bg-white dark:bg-gray-800"
                      variants={cardVariants}
                      whileHover={{ scale: 1.01, y: -1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <Badge 
                              variant={transaction.type === 'income' ? 'default' : 'destructive'} 
                              className={transaction.type === 'income' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}
                            >
                              {transaction.type === 'income' ? 'Ingreso' : 'Egreso'}
                            </Badge>
                            <span className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                              {transaction.concept}
                            </span>
                          </div>
                          {transaction.observations && (
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                              {transaction.observations}
                            </p>
                          )}
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
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
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className={`text-lg sm:text-xl font-semibold ${
                              transaction.type === 'income' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
                            }`}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.02, duration: 0.3 }}
                          >
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </motion.div>
                          {onUpdateTransaction && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTransaction(transaction)}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <EditTransactionModal
        transaction={editingTransaction}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
      />
    </>
  );
};

export default TransactionHistory;
