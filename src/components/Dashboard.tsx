
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/lib/types';
import { TrendingUp, TrendingDown, DollarSign, Activity, Calendar, Target, Zap, Banknote, CreditCard, ArrowRightLeft } from 'lucide-react';

interface DashboardProps {
  stats: DashboardStats;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.3 }
  }
};

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
      title: 'Efectivo en Caja',
      value: formatCurrency(stats.cashBalance),
      icon: Banknote,
      color: 'text-green-700 dark:text-green-400',
      bgGradient: 'from-green-500 to-emerald-600',
      bgLight: 'bg-green-100/80 dark:bg-green-900/30',
      description: 'Solo movimientos en efectivo',
      trend: stats.cashBalance > stats.openAmount ? '+' + formatCurrency(stats.cashBalance - stats.openAmount) : null
    },
    {
      title: 'Total del Día',
      value: formatCurrency(stats.totalDaySales),
      icon: TrendingUp,
      color: 'text-blue-700 dark:text-blue-400',
      bgGradient: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-100/80 dark:bg-blue-900/30',
      description: 'Efectivo + Transferencias + Tarjetas',
      trend: null
    },
    {
      title: 'Egresos',
      value: formatCurrency(stats.totalExpenses),
      icon: TrendingDown,
      color: 'text-red-700 dark:text-red-400',
      bgGradient: 'from-red-500 to-rose-600',
      bgLight: 'bg-red-100/80 dark:bg-red-900/30',
      description: 'Solo gastos en efectivo',
      trend: null
    }
  ];

  return (
    <motion.div 
      className="space-y-6 sm:space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" variants={cardVariants}>
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg">Resumen inteligente de actividad financiera</p>
        </div>
        <div className="flex items-center space-x-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-slate-700/50 glass-effect card-shadow">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
          <span className="font-medium">
            {new Date().toLocaleDateString('es-AR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" variants={containerVariants}>
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div key={stat.title} variants={cardVariants}>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="glass-effect border-0 card-shadow dark:card-shadow transition-all-smooth rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      {stat.title}
                    </CardTitle>
                    <motion.div 
                      className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-gradient-to-r ${stat.bgGradient} flex items-center justify-center card-shadow`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </motion.div>
                  </CardHeader>
                  <CardContent className="pb-4 sm:pb-6">
                    <motion.div 
                      className={`text-lg sm:text-3xl font-bold ${stat.color} mb-2 sm:mb-3`}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {stat.description}
                      </p>
                      {stat.trend && (
                        <span className="text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-900/30 card-shadow">
                          {stat.trend}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Payment Methods Breakdown */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6" variants={containerVariants}>
        <motion.div variants={cardVariants}>
          <Card className="glass-effect border-0 card-shadow dark:card-shadow rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <ArrowRightLeft className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                <span>Ingresos por Método</span>
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 font-medium">Desglose de métodos de pago</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <motion.div 
                  className="flex justify-between items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/50 card-shadow group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <Banknote className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Efectivo</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(stats.cashIncome)}</span>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 card-shadow group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <ArrowRightLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Transferencias</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(stats.transferIncome)}</span>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/50 card-shadow group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Tarjetas</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(stats.cardIncome)}</span>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="glass-effect border-0 card-shadow dark:card-shadow rounded-2xl sm:rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
                <span>Estado del Sistema</span>
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 font-medium">Información operativa avanzada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <motion.div 
                  className="flex justify-between items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-effect card-shadow group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Total Movimientos</span>
                  <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.transactionCount}</span>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-effect card-shadow group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Diferencia Esperada</span>
                  <span className={`text-xl sm:text-2xl font-bold ${Math.abs(stats.cashBalance - stats.openAmount) < 0.01 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(stats.cashBalance - stats.openAmount)}
                  </span>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 card-shadow group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Sistema</span>
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="w-3 h-3 rounded-full bg-emerald-500 card-shadow"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Operativo</span>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
