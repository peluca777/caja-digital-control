
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
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      description: 'Apertura de caja'
    },
    {
      title: 'Ingresos',
      value: formatCurrency(stats.totalIncome),
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      description: `${stats.transactionCount} transacciones`,
      trend: '+12.5%'
    },
    {
      title: 'Egresos',
      value: formatCurrency(stats.totalExpenses),
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      description: 'Gastos del período'
    },
    {
      title: 'Saldo Actual',
      value: formatCurrency(stats.balance),
      icon: Activity,
      color: stats.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bgColor: stats.balance >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30',
      description: 'Balance total',
      trend: stats.balance >= 0 ? '+5.2%' : '-2.1%'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Resumen de actividad financiera</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 px-4 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
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
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-smooth hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </p>
                  {stat.trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      stat.trend.startsWith('+') 
                        ? 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' 
                        : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
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
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resumen del Día</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Actividad financiera actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Total Movimientos</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.transactionCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Flujo Neto</span>
                <span className={`text-lg font-bold ${stats.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(stats.totalIncome - stats.totalExpenses)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Estado del Sistema</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Información operativa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Sistema</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Operativo</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Última sincronización</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Hace 2 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
