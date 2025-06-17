import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import CashRegisterControl from '@/components/CashRegisterControl';
import TransactionForm from '@/components/TransactionForm';
import TransactionHistory from '@/components/TransactionHistory';
import Settings from '@/components/Settings';
import ProfileSettings from '@/components/ProfileSettings';
import Navigation from '@/components/Navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  getCurrentUser, 
  getTodaysCashRegister, 
  getTodaysTransactions,
  addCashRegister,
  updateCashRegister,
  addTransaction,
  updateTransaction,
  getCashRegisters,
  getTransactions
} from '@/lib/storage';
import { User, CashRegister, Transaction, DashboardStats } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [currentView, setCurrentView] = useState('dashboard');
  const [cashRegister, setCashRegister] = useState<CashRegister | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0,
    openAmount: 0,
    cashBalance: 0,
    totalDaySales: 0,
    cashIncome: 0,
    cashExpenses: 0,
    transferIncome: 0,
    cardIncome: 0,
    otherIncome: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = () => {
    if (!currentUser) return;

    const todaysCashRegister = getTodaysCashRegister(currentUser.id);
    setCashRegister(todaysCashRegister);

    const todaysTransactions = getTodaysTransactions(todaysCashRegister?.id);
    setTransactions(todaysTransactions);

    // Calcular estadísticas separando por método de pago
    const openAmount = todaysCashRegister?.openAmount || 0;
    
    // Ingresos por método de pago
    const cashIncome = todaysTransactions
      .filter(t => t.type === 'income' && (t.paymentMethod === 'Efectivo' || !t.paymentMethod))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const transferIncome = todaysTransactions
      .filter(t => t.type === 'income' && t.paymentMethod === 'Transferencia')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const cardIncome = todaysTransactions
      .filter(t => t.type === 'income' && t.paymentMethod === 'Tarjeta')
      .reduce((sum, t) => sum + t.amount, 0);

    const otherIncome = todaysTransactions
      .filter(t => t.type === 'income' && t.paymentMethod && !['Efectivo', 'Transferencia', 'Tarjeta'].includes(t.paymentMethod))
      .reduce((sum, t) => sum + t.amount, 0);

    // Solo egresos en efectivo afectan la caja
    const cashExpenses = todaysTransactions
      .filter(t => t.type === 'expense' && (t.paymentMethod === 'Efectivo' || !t.paymentMethod))
      .reduce((sum, t) => sum + t.amount, 0);

    // Totales
    const totalIncome = cashIncome + transferIncome + cardIncome + otherIncome;
    const totalExpenses = cashExpenses; // Solo efectivo para gastos
    const cashBalance = openAmount + cashIncome - cashExpenses; // Solo efectivo
    const totalDaySales = totalIncome; // Todas las ventas del día
    const balance = openAmount + totalIncome - totalExpenses; // Balance general

    setStats({
      totalIncome,
      totalExpenses,
      balance,
      transactionCount: todaysTransactions.length,
      openAmount,
      cashBalance,
      totalDaySales,
      cashIncome,
      cashExpenses,
      transferIncome,
      cardIncome,
      otherIncome
    });

    // Actualizar el monto de cierre con el balance de efectivo
    if (todaysCashRegister && todaysCashRegister.status === 'open') {
      updateCashRegister(todaysCashRegister.id, { closeAmount: cashBalance });
    }
  };

  const handleLogin = (user: User) => {
    // Usar el nombre guardado en localStorage si existe
    const savedName = localStorage.getItem('adminName');
    if (savedName && savedName !== user.name) {
      user = { ...user, name: savedName };
    }
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleOpenCashRegister = (openAmount: number) => {
    if (!currentUser) return;

    const now = new Date();
    const newCashRegister: CashRegister = {
      id: `cash_${Date.now()}`,
      date: now.toISOString().split('T')[0],
      userId: currentUser.id,
      userName: currentUser.name,
      openAmount,
      openTime: now.toLocaleTimeString('es-AR', { hour12: false }),
      status: 'open'
    };

    addCashRegister(newCashRegister);
    setCashRegister(newCashRegister);
    loadData();
  };

  const handleCloseCashRegister = (declaredAmount: number) => {
    if (!cashRegister) return;

    const now = new Date();
    // La diferencia debe ser basada en el efectivo, no en el balance total
    const difference = stats.cashBalance - declaredAmount;
    
    const updates = {
      declaredAmount,
      difference,
      closeTime: now.toLocaleTimeString('es-AR', { hour12: false }),
      status: 'closed' as const
    };

    updateCashRegister(cashRegister.id, updates);
    setCashRegister({ ...cashRegister, ...updates });

    if (Math.abs(difference) > 0.01) {
      toast({
        title: "Diferencia en caja",
        description: `Hay una diferencia de ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Math.abs(difference))} en efectivo`,
        variant: "destructive",
      });
    }
  };

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: `trans_${Date.now()}`
    };

    addTransaction(newTransaction);
    loadData();
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    updateTransaction(updatedTransaction.id, updatedTransaction);
    loadData();
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    toast({
      title: "Función en desarrollo",
      description: `La exportación a ${format.toUpperCase()} estará disponible próximamente`,
    });
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard stats={stats} />;
      
      case 'cash-register':
        return (
          <div className="space-y-6">
            <CashRegisterControl
              cashRegister={cashRegister}
              onOpen={handleOpenCashRegister}
              onClose={handleCloseCashRegister}
            />
            {cashRegister && cashRegister.status === 'open' && (
              <TransactionForm
                cashRegisterId={cashRegister.id}
                onAddTransaction={handleAddTransaction}
              />
            )}
          </div>
        );
      
      case 'transactions':
        if (!cashRegister || cashRegister.status === 'closed') {
          return (
            <Alert>
              <AlertDescription>
                No hay una caja abierta. Primero debes abrir la caja para registrar movimientos.
              </AlertDescription>
            </Alert>
          );
        }
        return (
          <TransactionHistory
            transactions={transactions}
            onExport={handleExport}
            onUpdateTransaction={handleUpdateTransaction}
          />
        );
      
      case 'history':
        const allTransactions = getTransactions();
        return (
          <TransactionHistory
            transactions={allTransactions}
            onExport={handleExport}
            onUpdateTransaction={handleUpdateTransaction}
          />
        );
      
      case 'profile':
        return <ProfileSettings />;
      
      case 'settings':
        return <Settings />;
      
      default:
        return <Dashboard stats={stats} />;
    }
  };

  return (
    <Layout onLogout={handleLogout}>
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        userRole={currentUser.role}
      />
      {renderContent()}
    </Layout>
  );
};

export default Index;
