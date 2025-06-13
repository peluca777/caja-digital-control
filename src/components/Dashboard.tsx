
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/lib/types';
import { TrendingUp, TrendingDown, DollarSign, Activity, Calendar, Target, Zap } from 'lucide-react';

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
      icon: Target,
      color: 'text-slate-700 dark:text-slate-300',
      bgGradient: 'from-slate-500 to-slate-600',
      bgLight: 'bg-slate-100/80 dark:bg-slate-800/50',
      description: 'Apertura de caja',
      trend: null
    },
    {
      title: 'Ingresos',
      value: formatCurrency(stats.totalIncome),
      icon: TrendingUp,
      color: 'text-emerald-700 dark:text-emerald-400',
      bgGradient: 'from-emerald-500 to-green-600',
      bgLight: 'bg-emerald-100/80 dark:bg-emerald-900/30',
      description: `${stats.transactionCount} transacciones`,
      trend: '+12.5%'
    },
    {
      title: 'Egresos',
      value: formatCurrency(stats.totalExpenses),
      icon: TrendingDown,
      color: 'text-red-700 dark:text-red-400',
      bgGradient: 'from-red-500 to-rose-600',
      bgLight: 'bg-red-100/80 dark:bg-red-900/30',
      description: 'Gastos del período',
      trend: null
    },
    {
      title: 'Saldo Actual',
      value: formatCurrency(stats.balance),
      icon: Activity,
      color: stats.balance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400',
      bgGradient: stats.balance >= 0 ? 'from-blue-500 to-indigo-600' : 'from-red-500 to-rose-600',
      bgLight: stats.balance >= 0 ? 'bg-blue-100/80 dark:bg-blue-900/30' : 'bg-red-100/80 dark:bg-red-900/30',
      description: 'Balance total',
      trend: stats.balance >= 0 ? '+5.2%' : '-2.1%'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="animate-slide-up">
          <div className="flex items-center space-x-3 mb-2">
            <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Resumen inteligente de actividad financiera</p>
        </div>
        <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400 px-6 py-3 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 glass-effect shadow-soft animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="font-medium">
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
              className="glass-effect border-0 shadow-soft dark:shadow-soft-dark transition-smooth hover-lift animate-slide-up rounded-3xl overflow-hidden group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-r ${stat.bgGradient} flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <div className={`text-3xl font-bold ${stat.color} mb-3 group-hover:scale-105 transition-transform duration-300`}>
                  {stat.value}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {stat.description}
                  </p>
                  {stat.trend && (
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${
                      stat.trend.startsWith('+') 
                        ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-900/30' 
                        : 'text-red-700 dark:text-red-400 bg-red-100/80 dark:bg-red-900/30'
                    } shadow-soft`}>
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
        <Card className="glass-effect border-0 shadow-soft dark:shadow-soft-dark rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span>Resumen del Día</span>
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 font-medium">Actividad financiera en tiempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-2xl glass-effect shadow-soft group hover:scale-105 transition-smooth">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Total Movimientos</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.transactionCount}</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl glass-effect shadow-soft group hover:scale-105 transition-smooth">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Flujo Neto</span>
                <span className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(stats.totalIncome - stats.totalExpenses)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-soft dark:shadow-soft-dark rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span>Estado del Sistema</span>
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 font-medium">Información operativa avanzada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 shadow-soft group hover:scale-105 transition-smooth">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Sistema</span>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-soft"></div>
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Operativo</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl glass-effect shadow-soft group hover:scale-105 transition-smooth">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Última sincronización</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Hace 2 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
