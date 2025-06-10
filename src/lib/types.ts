
export interface User {
  id: string;
  name: string;
  role: 'Cajero' | 'Supervisor';
}

export interface CashRegister {
  id: string;
  date: string;
  userId: string;
  userName: string;
  openAmount: number;
  closeAmount?: number;
  declaredAmount?: number;
  difference?: number;
  openTime: string;
  closeTime?: string;
  status: 'open' | 'closed';
}

export interface Transaction {
  id: string;
  cashRegisterId: string;
  type: 'income' | 'expense';
  amount: number;
  concept: string;
  observations?: string;
  date: string;
  time: string;
  userId: string;
  userName: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  openAmount: number;
}
