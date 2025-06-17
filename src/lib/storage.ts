
import { CashRegister, Transaction, User } from './types';

const USERS_KEY = 'cashRegister_users';
const CASH_REGISTERS_KEY = 'cashRegister_cashRegisters';
const TRANSACTIONS_KEY = 'cashRegister_transactions';
const CURRENT_USER_KEY = 'cashRegister_currentUser';

// Users
export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [
    { id: '1', name: 'Admin', role: 'Supervisor' },
    { id: '2', name: 'Cajero 1', role: 'Cajero' }
  ];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Current User
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Cash Registers
export const getCashRegisters = (): CashRegister[] => {
  const cashRegisters = localStorage.getItem(CASH_REGISTERS_KEY);
  return cashRegisters ? JSON.parse(cashRegisters) : [];
};

export const saveCashRegisters = (cashRegisters: CashRegister[]) => {
  localStorage.setItem(CASH_REGISTERS_KEY, JSON.stringify(cashRegisters));
};

export const addCashRegister = (cashRegister: CashRegister) => {
  const cashRegisters = getCashRegisters();
  cashRegisters.push(cashRegister);
  saveCashRegisters(cashRegisters);
};

export const updateCashRegister = (id: string, updates: Partial<CashRegister>) => {
  const cashRegisters = getCashRegisters();
  const index = cashRegisters.findIndex(cr => cr.id === id);
  if (index !== -1) {
    cashRegisters[index] = { ...cashRegisters[index], ...updates };
    saveCashRegisters(cashRegisters);
  }
};

// Transactions
export const getTransactions = (): Transaction[] => {
  const transactions = localStorage.getItem(TRANSACTIONS_KEY);
  return transactions ? JSON.parse(transactions) : [];
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const addTransaction = (transaction: Transaction) => {
  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
};

export const updateTransaction = (id: string, updates: Partial<Transaction>) => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates };
    saveTransactions(transactions);
  }
};

export const deleteTransaction = (id: string) => {
  const transactions = getTransactions();
  const filteredTransactions = transactions.filter(t => t.id !== id);
  saveTransactions(filteredTransactions);
};

// Utility functions
export const getTodaysCashRegister = (userId?: string): CashRegister | null => {
  const today = new Date().toISOString().split('T')[0];
  const cashRegisters = getCashRegisters();
  
  return cashRegisters.find(cr => 
    cr.date === today && 
    (userId ? cr.userId === userId : true) &&
    cr.status === 'open'
  ) || null;
};

export const getTodaysTransactions = (cashRegisterId?: string): Transaction[] => {
  const today = new Date().toISOString().split('T')[0];
  const transactions = getTransactions();
  
  return transactions.filter(t => 
    t.date === today && 
    (cashRegisterId ? t.cashRegisterId === cashRegisterId : true)
  );
};
