
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/lib/types';
import { TrendingUp, TrendingDown, DollarSign, Activity, Calendar } from 'lucide-react';

interface DashboardProps {
  stats: DashboardStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Monto Inicial',
      value: formatCurrency(stats.openAmount),
      icon: DollarSign,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      description: 'Apertura de caja'
    },
    {
      title: 'Ingresos',
      value: formatCurrency(stats.totalIncome),
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: `${stats.transactionCount} transacciones`,
      trend: '+12.5%'
    },
    {
      title: 'Egresos',
      value: formatCurrency(stats.totalExpenses),
      icon: TrendingDown,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      description: 'Gastos del período'
    },
    {
      title: 'Saldo Actual',
      value: formatCurrency(stats.balance),
      icon: Activity,
      color: stats.balance >= 0 ? 'text-success' : 'text-destructive',
      bgColor: stats.balance >= 0 ? 'bg-success/10' : 'bg-destructive/10',
      description: 'Balance total',
      trend: stats.balance >= 0 ? '+5.2%' : '-2.1%'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Resumen de actividad financiera</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground px-4 py-2 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date().toLocaleDateString('es-AR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card 
              key={stat.title}
              className="glass border-border/50 shadow-elevated hover-lift transition-smooth animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`h-10 w-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <IconComponent className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  {stat.trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      stat.trend.startsWith('+') 
                        ? 'text-success bg-success/10' 
                        : 'text-destructive bg-destructive/10'
                    }`}>
                      {stat.trend}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <Card className="glass border-border/50 shadow-elevated">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Resumen del Día</CardTitle>
            <CardDescription>Actividad financiera actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-medium">Total Movimientos</span>
                <span className="text-lg font-bold text-primary">{stats.transactionCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-medium">Flujo Neto</span>
                <span className={`text-lg font-bold ${stats.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(stats.totalIncome - stats.totalExpenses)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50 shadow-elevated">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Estado del Sistema</CardTitle>
            <CardDescription>Información operativa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-success/10">
                <span className="text-sm font-medium">Sistema</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  <span className="text-sm font-medium text-success">Operativo</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <span className="text-sm font-medium">Última sincronización</span>
                <span className="text-sm text-muted-foreground">Hace 2 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
