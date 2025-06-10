
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import CashRegisterControl from '@/components/CashRegisterControl';
import TransactionForm from '@/components/TransactionForm';
import TransactionHistory from '@/components/TransactionHistory';
import Settings from '@/components/Settings';
import Navigation from '@/components/Navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  getCurrentUser, 
  getTodaysCashRegister, 
  getTodaysTransactions,
  addCashRegister,
  updateCashRegister,
  addTransaction,
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
    openAmount: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = () => {
    if (!currentUser) return;

    const todaysCashRegister = getTodaysCashRegister(
      currentUser.role === 'Cajero' ? currentUser.id : undefined
    );
    setCashRegister(todaysCashRegister);

    const todaysTransactions = getTodaysTransactions(todaysCashRegister?.id);
    setTransactions(todaysTransactions);

    // Calculate stats
    const totalIncome = todaysTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = todaysTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const openAmount = todaysCashRegister?.openAmount || 0;
    const balance = openAmount + totalIncome - totalExpenses;

    setStats({
      totalIncome,
      totalExpenses,
      balance,
      transactionCount: todaysTransactions.length,
      openAmount
    });

    // Update cash register close amount
    if (todaysCashRegister && todaysCashRegister.status === 'open') {
      updateCashRegister(todaysCashRegister.id, { closeAmount: balance });
    }
  };

  const handleLogin = (user: User) => {
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
      openTime: now.toLocaleTimeString('es-AR'),
      status: 'open'
    };

    addCashRegister(newCashRegister);
    setCashRegister(newCashRegister);
    loadData();
  };

  const handleCloseCashRegister = (declaredAmount: number) => {
    if (!cashRegister) return;

    const now = new Date();
    const difference = (cashRegister.closeAmount || 0) - declaredAmount;
    
    const updates = {
      declaredAmount,
      difference,
      closeTime: now.toLocaleTimeString('es-AR'),
      status: 'closed' as const
    };

    updateCashRegister(cashRegister.id, updates);
    setCashRegister({ ...cashRegister, ...updates });

    if (Math.abs(difference) > 0.01) {
      toast({
        title: "Diferencia en caja",
        description: `Hay una diferencia de ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Math.abs(difference))}`,
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
          />
        );
      
      case 'history':
        const allTransactions = getTransactions();
        const filteredTransactions = currentUser.role === 'Supervisor' 
          ? allTransactions 
          : allTransactions.filter(t => t.userId === currentUser.id);
        
        return (
          <TransactionHistory
            transactions={filteredTransactions}
            onExport={handleExport}
          />
        );
      
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
