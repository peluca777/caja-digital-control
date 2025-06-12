import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/lib/types';
interface DashboardProps {
  stats: DashboardStats;
}
const Dashboard: React.FC<DashboardProps> = ({
  stats
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };
  return <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Dashboard</h2>
        <div className="text-sm text-muted-foreground px-3 py-1 rounded-lg border border-border bg-gray-500">
          {new Date().toLocaleDateString('es-AR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="animate-slide-up bg-card border-border card-shadow hover:card-shadow-hover transition-all-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monto Inicial</CardTitle>
            <div className="h-3 w-3 rounded-full bg-gray-50"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">
              {formatCurrency(stats.openAmount)}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up bg-card border-border card-shadow hover:card-shadow-hover transition-all-smooth" style={{
        animationDelay: '0.05s'
      }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos</CardTitle>
            <div className="h-3 w-3 bg-success rounded-full"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-success">
              {formatCurrency(stats.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.transactionCount} transacciones
            </p>
          </CardContent>
        </Card>

        <Card className="animate-slide-up bg-card border-border card-shadow hover:card-shadow-hover transition-all-smooth" style={{
        animationDelay: '0.1s'
      }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Egresos</CardTitle>
            <div className="h-3 w-3 rounded-full bg-gray-50"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-destructive">
              {formatCurrency(stats.totalExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up bg-card border-border card-shadow hover:card-shadow-hover transition-all-smooth" style={{
        animationDelay: '0.15s'
      }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Actual</CardTitle>
            <div className={`h-3 w-3 rounded-full ${stats.balance >= 0 ? 'bg-success' : 'bg-destructive'}`}></div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-semibold ${stats.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(stats.balance)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Dashboard;