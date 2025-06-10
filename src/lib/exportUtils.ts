
import { Transaction } from './types';

export const exportToExcel = (transactions: Transaction[]) => {
  // Agrupar transacciones por método de pago
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

  // Función para formatear moneda
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Crear encabezado del reporte
  const reportHeader = [
    ['CONTROL DE CAJA DIARIA'],
    [`Fecha: ${new Date().toLocaleDateString('es-AR')}`],
    [''],
    ['DETALLE DE MOVIMIENTOS'],
    ['']
  ];

  // Crear encabezados de la tabla
  const headers = ['Hora', 'Tipo', 'Método de Pago', 'Descripción', 'Importe', 'Observaciones', 'Usuario'];
  
  // Ordenar transacciones por hora
  const sortedTransactions = [...transactions].sort((a, b) => a.time.localeCompare(b.time));
  
  // Crear filas de datos
  const dataRows = sortedTransactions.map(t => [
    t.time,
    t.type === 'income' ? 'Ingreso' : 'Egreso',
    t.paymentMethod || 'Efectivo',
    `"${t.concept}"`,
    formatCurrency(t.amount),
    `"${t.observations || ''}"`,
    `"${t.userName}"`
  ]);

  // Crear resumen por método de pago
  const paymentSummary = [
    [''],
    ['RESUMEN POR MÉTODO DE PAGO'],
    ['Método', 'Total']
  ];
  
  paymentMethods.forEach(method => {
    if (paymentTotals[method] !== 0) {
      paymentSummary.push([method, formatCurrency(paymentTotals[method])]);
    }
  });

  // Crear totales generales
  const generalTotals = [
    [''],
    ['TOTALES GENERALES'],
    ['Concepto', 'Importe'],
    ['Total Ingresos', formatCurrency(totalIncome)],
    ['Total Egresos', formatCurrency(totalExpense)],
    [''],
    ['SALDO FINAL', formatCurrency(finalBalance)]
  ];

  // Combinar todas las secciones
  const csvContent = [
    ...reportHeader,
    headers,
    ...dataRows,
    ...paymentSummary,
    ...generalTotals
  ].map(row => row.join(',')).join('\n');

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
  URL.revokeObjectURL(url);
};

export const exportToPDF = (transactions: Transaction[]) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calcular totales
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const finalBalance = totalIncome - totalExpense;

  // Crear contenido HTML mejorado para PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Control de Caja Diaria</title>
        <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 20px; 
              color: #1a202c; 
              line-height: 1.4;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #48bb78; 
              padding-bottom: 15px; 
            }
            h1 { 
              color: #48bb78; 
              margin: 0; 
              font-size: 24px; 
              font-weight: 600; 
            }
            .date { 
              color: #4a5568; 
              font-size: 14px; 
              margin-top: 5px; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
              font-size: 12px; 
            }
            th, td { 
              border: 1px solid #e2e8f0; 
              padding: 10px 8px; 
              text-align: left; 
            }
            th { 
              background-color: #48bb78; 
              color: white; 
              font-weight: 600; 
              text-align: center; 
            }
            .income { 
              color: #38a169; 
              font-weight: 600; 
            }
            .expense { 
              color: #e53e3e; 
              font-weight: 600; 
            }
            tr:nth-child(even) { 
              background-color: #f7fafc; 
            }
            .summary { 
              margin-top: 30px; 
              background: #f8f9fa; 
              padding: 20px; 
              border-radius: 8px; 
              border: 1px solid #e2e8f0; 
            }
            .summary h3 { 
              color: #2d3748; 
              margin-top: 0; 
              border-bottom: 1px solid #cbd5e0; 
              padding-bottom: 10px; 
            }
            .total-final { 
              font-size: 16px; 
              font-weight: bold; 
              color: #2d3748; 
              background-color: #edf2f7; 
              padding: 10px; 
              border-radius: 5px; 
              margin-top: 15px; 
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Control de Caja Diaria</h1>
            <div class="date">Fecha: ${new Date().toLocaleDateString('es-AR')}</div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Hora</th>
                    <th>Tipo</th>
                    <th>Método de Pago</th>
                    <th>Descripción</th>
                    <th>Importe</th>
                    <th>Observaciones</th>
                    <th>Usuario</th>
                </tr>
            </thead>
            <tbody>
                ${transactions.map(t => `
                    <tr>
                        <td style="text-align: center;">${t.time}</td>
                        <td class="${t.type}" style="text-align: center;">${t.type === 'income' ? 'Ingreso' : 'Egreso'}</td>
                        <td style="text-align: center;">${t.paymentMethod || 'Efectivo'}</td>
                        <td>${t.concept}</td>
                        <td style="text-align: right; font-weight: 600;">${formatCurrency(t.amount)}</td>
                        <td>${t.observations || '-'}</td>
                        <td>${t.userName}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        
        <div class="summary">
            <h3>Resumen de Totales</h3>
            <p><strong>Total Ingresos:</strong> <span style="color: #38a169;">${formatCurrency(totalIncome)}</span></p>
            <p><strong>Total Egresos:</strong> <span style="color: #e53e3e;">${formatCurrency(totalExpense)}</span></p>
            <div class="total-final">
                <strong>Saldo Final: ${formatCurrency(finalBalance)}</strong>
            </div>
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
  URL.revokeObjectURL(url);
};
