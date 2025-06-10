
import { Transaction } from './types';

export const exportToExcel = (transactions: Transaction[]) => {
  // Agrupar por medio de pago
  const paymentMethods = ['Efectivo', 'Transferencia', 'Tarjeta', 'Débito', 'Otro'];
  const paymentTotals = paymentMethods.reduce((acc, method) => {
    const income = transactions
      .filter(t => t.type === 'income' && (t.paymentMethod || 'Efectivo') === method)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === 'expense' && (t.paymentMethod || 'Efectivo') === method)
      .reduce((sum, t) => sum + t.amount, 0);
    acc[method] = income - expense;
    return acc;
  }, {} as Record<string, number>);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const finalBalance = totalIncome - totalExpense;

  // Crear contenido CSV con formato mejorado
  const headers = ['Hora', 'Tipo', 'Medio de Pago', 'Concepto', 'Monto', 'Observaciones', 'Usuario'];
  const dataRows = transactions.map(t => [
    t.time,
    t.type === 'income' ? 'Ingreso' : 'Egreso',
    t.paymentMethod || 'Efectivo',
    `"${t.concept}"`,
    t.amount.toString(),
    `"${t.observations || ''}"`,
    `"${t.userName}"`
  ]);

  // Agregar resumen al final
  const summaryRows = [
    [''],
    ['RESUMEN DE MOVIMIENTOS'],
    [''],
    ['Totales por medio de pago:'],
    ...paymentMethods.map(method => [`${method}:`, `$${paymentTotals[method].toLocaleString('es-AR')}`]),
    [''],
    ['Totales generales:'],
    [`Total Ingresos:`, `$${totalIncome.toLocaleString('es-AR')}`],
    [`Total Egresos:`, `$${totalExpense.toLocaleString('es-AR')}`],
    [`Saldo Final:`, `$${finalBalance.toLocaleString('es-AR')}`]
  ];

  const csvContent = [
    headers.join(','),
    ...dataRows.map(row => row.join(',')),
    ...summaryRows.map(row => row.join(','))
  ].join('\n');

  // Crear y descargar archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const today = new Date().toLocaleDateString('es-AR').replace(/\//g, '-');
  link.setAttribute('href', url);
  link.setAttribute('download', `Caja_Diaria_${today}.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (transactions: Transaction[]) => {
  // Crear contenido HTML para PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Movimientos del Día</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; color: #1f2937; }
            h1 { color: #22c55e; text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 12px 8px; text-align: left; }
            th { background-color: #22c55e; color: white; font-weight: 600; }
            .income { color: #059669; font-weight: 600; }
            .expense { color: #dc2626; font-weight: 600; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .summary { margin-top: 30px; background: #f8fafc; padding: 20px; border-radius: 8px; }
        </style>
    </head>
    <body>
        <h1>Control de Caja - Movimientos del Día</h1>
        <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-AR')}</p>
        <table>
            <thead>
                <tr>
                    <th>Hora</th>
                    <th>Tipo</th>
                    <th>Medio de Pago</th>
                    <th>Concepto</th>
                    <th>Monto</th>
                    <th>Observaciones</th>
                    <th>Usuario</th>
                </tr>
            </thead>
            <tbody>
                ${transactions.map(t => `
                    <tr>
                        <td>${t.time}</td>
                        <td class="${t.type}">${t.type === 'income' ? 'Ingreso' : 'Egreso'}</td>
                        <td>${t.paymentMethod || 'Efectivo'}</td>
                        <td>${t.concept}</td>
                        <td>$${t.amount.toLocaleString('es-AR')}</td>
                        <td>${t.observations || '-'}</td>
                        <td>${t.userName}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="summary">
            <h3>Resumen de Totales</h3>
            <p><strong>Total Ingresos:</strong> $${transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0).toLocaleString('es-AR')}</p>
            <p><strong>Total Egresos:</strong> $${transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0).toLocaleString('es-AR')}</p>
            <p><strong>Saldo Final:</strong> $${(transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)).toLocaleString('es-AR')}</p>
        </div>
    </body>
    </html>
  `;

  // Crear y descargar archivo HTML
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const today = new Date().toLocaleDateString('es-AR').replace(/\//g, '-');
  link.setAttribute('href', url);
  link.setAttribute('download', `Caja_Diaria_${today}.html`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
